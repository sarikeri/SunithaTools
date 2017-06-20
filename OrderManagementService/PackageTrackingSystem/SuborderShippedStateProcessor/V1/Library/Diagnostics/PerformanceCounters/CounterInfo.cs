using System;
using System.Collections.Concurrent;
using System.Diagnostics;

namespace Wag.Oms.PerformanceCounters
{
    public class CounterInfo
    {
        private readonly PerformanceCounter performanceCounter = new PerformanceCounter();

        private readonly ConcurrentDictionary<string, PerformanceCounter> performanceCounters =
            new ConcurrentDictionary<string, PerformanceCounter>();

        public CounterInfo(string categoryName,
                           PerformanceCounterCategoryType categoryType,
                           string counterName,
                           PerformanceCounterType type,
                           string help)
        {
            CategoryName = categoryName;
            CategoryType = categoryType;
            CounterName = counterName;
            Help = help;
            Type = type;
        }

        public string CategoryName { get; set; }
        public string CounterName { get; set; }
        public string Help { get; set; }

        public PerformanceCounterType Type { get; set; }
        public PerformanceCounterCategoryType CategoryType { get; set; }

        public PerformanceCounter GetCounter(string instanceName)
        {
            PerformanceCounter thisCounter;

            if (!performanceCounters.TryGetValue(instanceName, out thisCounter))
            {
                thisCounter = new PerformanceCounter(CategoryName, CounterName, instanceName, false);
                performanceCounters.TryAdd(instanceName, thisCounter);
            }

            return thisCounter;
        }

        public PerformanceCounter GetCounter()
        {
            if (CategoryType != PerformanceCounterCategoryType.SingleInstance)
            {
                throw new Exception(
                    "This performance counter is MultiInstance counter, call GetCounter(string instanceName) method instead");
            }

            if (string.IsNullOrEmpty(performanceCounter.CategoryName))
            {
                performanceCounter.CategoryName = CategoryName;
                performanceCounter.CounterName = CounterName;
                performanceCounter.ReadOnly = false;
            }

            return performanceCounter;
        }
    }
}