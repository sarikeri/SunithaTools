using System;
using System.Configuration;
using System.ServiceProcess;
using System.Threading;
using Wag.Oms.SOS.Handler;
using Wag.Oms.SOS.Logging;

namespace Wag.Oms.SOS.SuborderShippedStateProcessorService
{
    public partial class SuborderShippedStateProcessorService : ServiceBase
    {
        private readonly int _pollInterval;
        private readonly int _waitIntervalBeforeTerminate;
        private Thread _workerThread;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();

        /// <summary>
        /// This timeSpan specifies how long the poller waits between polls. Default is 2 minute.
        /// </summary>
        private TimeSpan PollInterval { get; set; }

        /// <summary>
        /// Manual reset event that will soft kill this process.
        /// </summary>
        private static readonly ManualResetEventSlim Terminate = new ManualResetEventSlim(false);

        /// <summary>
        /// AutoReset Event that will wake up the worker thread if it is asleep.
        /// </summary>
        private static readonly AutoResetEvent WakeWorker = new AutoResetEvent(false);

        public SuborderShippedStateProcessorService()
        {
            InitializeComponent();

            _pollInterval = ConfigurationManager.AppSettings[Common.Constants.PollInterval] != null
                ? Convert.ToInt32(ConfigurationManager.AppSettings[Common.Constants.PollInterval])
                : Common.Constants.DefaultPollInterval;

            _waitIntervalBeforeTerminate = ConfigurationManager.AppSettings[Common.Constants.WaitIntervalBeforeTerminate] != null
                ? Convert.ToInt32(ConfigurationManager.AppSettings[Common.Constants.WaitIntervalBeforeTerminate])
                : Common.Constants.DefaultWaitIntervalBeforeTerminate;
        }

        /// <summary>
        /// Wrapper for OnStart for debugging
        /// </summary>
        /// <param name="args"></param>
        public void StartService(string[] args)
        {
            OnStart(args);
        }

        /// <summary>
        /// Wrapper for OnStop for debugging
        /// </summary>
        public void StopService()
        {
            OnStop();
        }

        #region Protected Methods

        /// <summary>
        /// OnStart for service
        /// When the service starts it will creating a timer.
        /// </summary>
        /// <param name="args"></param>
        protected override void OnStart(string[] args)
        {
            try
            {
                base.OnStart(args);
                Logger.Log(LogLevel.Information, new LogBag(), "SuborderShippedStateProcessorService.OnStart: Service started");

                PollInterval = new TimeSpan(0, 0, 0, 0, _pollInterval);
                _workerThread = new Thread(WorkerThread);
                _workerThread.Start();

                Logger.Log(LogLevel.Verbose, new LogBag(), "SuborderShippedStateProcessorService.OnStart: Worker Starts");
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Critical, new LogBag().AddToBag(ex),
                           string.Format("SuborderShippedStateProcessorService.OnStart: Unhandled Exception {0}", ex.Message));
            }
        }

        /// <summary>
        /// Stops the Service and logs it
        /// </summary>
        protected override void OnStop()
        {
            try
            {
                SuborderShippedStateProcessorHandler.StopProcessingFurtherOrders();
                WakeWorker.Set();
                try
                {
                    // Wait for a specified interval to allow the service to complete the current order processing
                    Terminate.Wait(_waitIntervalBeforeTerminate, _cancellationTokenSource.Token);
                }
                catch (OperationCanceledException oce)
                {
                    // Do nothing. If the control reaches here, it means the cancelation token was set before the timeout
                }
                Terminate.Set();
                base.OnStop();
                Logger.Log(LogLevel.Information, new LogBag(), "SuborderShippedStateProcessorService.OnStop..... at: {0}", DateTime.Now);
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, new LogBag().AddToBag(ex), string.Format("SuborderShippedStateProcessorSerice.OnStop: Unhandled Exception {0}", ex.Message));
            }
        }

        private void WorkerThread()
        {
            Logger.Log(LogLevel.Verbose, new LogBag(), "SuborderShippedStateProcessorService.WorkerThread: Worker Thread Starts at : {0}", DateTime.Now);

            var suborderShippedStateProcessorHandler = new SuborderShippedStateProcessorHandler();

            try
            {
                while (!Terminate.IsSet)
                {
                    bool hasRecords = true;

                    while (hasRecords && !Terminate.IsSet)
                    {
                        Logger.Log(LogLevel.Verbose, new LogBag(), "SuborderShippedStateProcessorService.WorkerThread: Worker Thread Inside while loop at : {0}", DateTime.Now);
                        suborderShippedStateProcessorHandler.ProcessShippedOrders(_cancellationTokenSource);
                        hasRecords = !suborderShippedStateProcessorHandler.HasNoNewRecords;
                    }

                    Logger.Log(LogLevel.Verbose, new LogBag(), "SuborderShippedStateProcessorService.WorkerThread: Waiting on WakeWorker");

                    WakeWorker.WaitOne(PollInterval);

                    Logger.Log(LogLevel.Verbose, new LogBag(), "SuborderShippedStateProcessorService.WorkerThread: End Wait on WakeWorker");
                }
                Logger.Log(LogLevel.Verbose, new LogBag(), "SuborderShippedStateProcessorService.WorkerThread: Terminate Called. Worker Thread ends");
            }
            catch (Exception e)
            {
                Logger.Log(LogLevel.Critical, new LogBag().AddToBag(e), string.Format("SuborderShippedStateProcessorService.WorkerThread: Unhandled Exception Caught: {0}", e.Message));
            }
            Logger.Log(LogLevel.Verbose, new LogBag(), "SuborderShippedStateProcessorService.WorkerThread: Worker Thread ends");
        }

        #endregion
    }
}