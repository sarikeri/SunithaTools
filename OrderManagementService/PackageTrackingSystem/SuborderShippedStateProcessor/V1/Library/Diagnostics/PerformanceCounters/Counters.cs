using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using Wag.Oms.OrderRouterClient.Logging;

namespace Wag.Oms.PerformanceCounters
{
    public abstract class Counters
    {
        private readonly object lockObject = new object();
        // TODO Add logging interval
        //private readonly ILoggingInterval loggingInterval = new LoggingInterval(300); //5 minutes
        private readonly CounterInfo[] counterInfos;
        private bool initialized;

        protected Counters(string categoryName,
                    string categoryHelp,
                    PerformanceCounterCategoryType counterCategoryType,
                    Type enumerationType)
            : this(categoryName, categoryHelp, counterCategoryType, Enum.GetValues(enumerationType).Length, 5)
        {
        }

        protected Counters(string categoryName,
                            string categoryHelp,
                            PerformanceCounterCategoryType counterCategoryType,
                            int maxSize)
            : this(categoryName, categoryHelp, counterCategoryType, maxSize, 5)
        {
        }

        protected Counters(string categoryName,
                            string categoryHelp,
                            PerformanceCounterCategoryType counterCategoryType,
                            int maxSize,
                            int maxNumberOfInitAttempts)
        {
            CategoryName = categoryName;
            CategoryHelp = categoryHelp;
            CategoryType = counterCategoryType;
            MaxNumberOfInitAttempts = maxNumberOfInitAttempts;

            counterInfos = new CounterInfo[maxSize];
        }

        private string CategoryName { get; set; }
        private string CategoryHelp { get; set; }
        private PerformanceCounterCategoryType CategoryType { get; set; }

        private int NumberOfInitAttempts { get; set; }
        private int MaxNumberOfInitAttempts { get; set; }

        [DllImport("Kernel32.dll")]
        public static extern void QueryPerformanceCounter(ref long ticks);

        protected bool OneTimeInit()
        {
            if (initialized)
                return true;

            try
            {
                lock (lockObject)
                {
                    if (initialized)
                        return true;

                    NumberOfInitAttempts++;

                    InitCounterInfo();

                    initialized = true;
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, new LogBag().AddToBag(ex), "Custom counter initialization failed");
                return false;
            }
            return true;
        }

        public PerformanceCounter GetCounter<T>(T counter, string instanceName) where T : struct, IConvertible
        {
#if DEBUG
            if (!typeof(T).IsEnum)
                throw new ArgumentException("T must be an enumerated type");
#endif

            return counterInfos[Convert.ToInt32(counter)].GetCounter(instanceName);
        }

        public PerformanceCounter GetCounter<T>(T counter) where T : struct, IConvertible
        {
#if DEBUG
            if (!typeof(T).IsEnum)
                throw new ArgumentException("T must be an enumerated type");
#endif

            return counterInfos[Convert.ToInt32(counter)].GetCounter();
        }

        /// <summary>
        /// Register Counters to the operating system
        /// </summary>
        public void RegisterCounters()
        {
            var col = new CounterCreationDataCollection();

            foreach (CounterInfo counterInfo in counterInfos)
            {
                if (counterInfo == null)
                {
                    continue;
                }

                col.Add(new CounterCreationData(counterInfo.CounterName, counterInfo.Help, counterInfo.Type));
            }

            if (PerformanceCounterCategory.Exists(CategoryName))
            {
                PerformanceCounterCategory.Delete(CategoryName);
            }

            PerformanceCounterCategory.Create(CategoryName, CategoryHelp, CategoryType, col);
        }

        /// <summary>
        /// UnRegister Counters from the operating system
        /// </summary>
        public void UnregisterCounters()
        {
            if (PerformanceCounterCategory.Exists(CategoryName))
            {
                PerformanceCounterCategory.Delete(CategoryName);
            }
        }

        #region Multi Instance Based
        protected void Increment(string instanceName, int counter)
        {
            // Pass null for incrementby parameter 
            SetCounterValue(CounterApi.Increment, instanceName, counter, null);
        }
       
        protected void IncrementBy(string instanceName, int counter, long? incrementBy)
        {
            SetCounterValue(CounterApi.IncrementBy, instanceName, counter, incrementBy);
        }

        protected void SetRawValue(string instanceName, int counter, long? time)
        {
            SetCounterValue(CounterApi.RawValue, instanceName, counter, time);
        }
        #endregion


        #region Single Instance Based
        protected void Increment(int counter)
        {
            // Pass null for incrementby parameter and instance name
            SetCounterValue(CounterApi.Increment, null, counter, null);
        }       

        protected void IncrementBy(int counter, long? incrementBy)
        {
            SetCounterValue(CounterApi.IncrementBy, null, counter, incrementBy);
        }
   
        protected void SetRawValue(int counter, long? time)
        {
            SetCounterValue(CounterApi.RawValue, null, counter, time);
        }
        #endregion
       
            

        /// <summary>
        /// Increments the counter by specific value
        /// </summary>
        /// <param name="counterApi">Increment or IncrementBy</param>
        /// <param name="instanceName">Instance Name</param>
        /// <param name="counter">Counter Type</param>
        /// <param name="incrementBy">By what value[In case of counterApi as Increment, it is NULL]</param>
        private void SetCounterValue(CounterApi counterApi, string instanceName, int counter, long? incrementBy)
        {
            try
            {
                if (!OneTimeInit())
                {
                    return;
                }

                if (counterApi != CounterApi.Increment && !incrementBy.HasValue)
                {
                    throw new ArgumentNullException("incrementBy", "incrementBy is null when counterApi is not Increment");
                }

                if (CategoryType == PerformanceCounterCategoryType.MultiInstance && string.IsNullOrEmpty(instanceName))
                {
                    throw new ArgumentNullException("instanceName", "instanceName is null when categoryType is MultiInstance");
                }

                //For some reason if the Init keeps failing then only try for MaxNumberOfInitAttempts number of times. 
                //Init could be expensive and don't want to slow down the app just for getting the perf counter functionality 
                if (NumberOfInitAttempts >= MaxNumberOfInitAttempts)
                {
                    string msg = string.Format("Max attempts:{0} to initialize custom counters failed", NumberOfInitAttempts);
                    Logger.Log(LogLevel.Error, msg);
                    return;
                }

                    
                PerformanceCounter performanceCounter = (CategoryType == PerformanceCounterCategoryType.SingleInstance)
                                ? counterInfos[counter].GetCounter() : counterInfos[counter].GetCounter(instanceName);
                

                switch (counterApi)
                {
                    case CounterApi.Increment:
                        performanceCounter.Increment();
                        break;

                    case CounterApi.IncrementBy:
                        performanceCounter.IncrementBy(incrementBy.HasValue ? incrementBy.Value : 0);
                        break;

                    case CounterApi.RawValue:
                        performanceCounter.RawValue = incrementBy.HasValue ? incrementBy.Value : 0;
                        break;
                }
            }
            catch (Exception ex)
            {
                //Log and eat exception, don't want the caller to fail just because of counter errors
                string msg = string.Format("PerfCounter call failed. counterApi:{0} instanceName:{1} counter:{2} incrementBy:{3} Continuing...",  
                            counterApi,
                            instanceName,
                            counter,
                            incrementBy);
                Logger.Log(LogLevel.Error, msg + ex.Message);                 
            }
        }

        protected void AddCounterInfo<T>(T counter, string counterName, PerformanceCounterType type, string help) where T : struct, IConvertible
        {
#if DEBUG
            if (!typeof(T).IsEnum)
                throw new ArgumentException("T must be an enumerated type");
#endif

            AddCounterInfo(Convert.ToInt32(counter), counterName, type, help);
        }

        protected void AddCounterInfo(int counter, string counterName, PerformanceCounterType type, string help)
        {
            counterInfos[counter] = new CounterInfo(CategoryName, CategoryType, counterName, type, help);
        }

        protected PerformanceCounter GetCounter(string instanceName, int counter)
        {
            return counterInfos[counter].GetCounter(instanceName);
        }

        public abstract void InitCounterInfo();
    }
}