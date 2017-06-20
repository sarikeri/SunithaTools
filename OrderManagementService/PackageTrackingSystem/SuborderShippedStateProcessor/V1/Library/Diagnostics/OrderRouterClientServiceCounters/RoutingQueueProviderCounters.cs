using System.Diagnostics;
using Wag.Oms.PerformanceCounters;

namespace Wag.Oms.OrderRouterClientService.PerformanceCounters
{
    public class RoutingQueueProviderCounters : Counters
    {
        private static readonly RoutingQueueProviderCounters _instance = new RoutingQueueProviderCounters();

        public static RoutingQueueProviderCounters Instance { get { return _instance; } }

        private RoutingQueueProviderCounters()
            : base("RoutingQueueProvider", "All RoutingQueueProvider counters", PerformanceCounterCategoryType.SingleInstance, (int)RoutingQueueProviderCountersIndex.Max)
        {
        }
        public static void SetGetRoutingQueueExeTime(long time)
        {
            _instance.SetRawValue((int)RoutingQueueProviderCountersIndex.GetRoutingQueueExeTime, time);
        }

        public static void SetUpdateRoutingQueueExeTime(long time)
        {
            _instance.SetRawValue((int)RoutingQueueProviderCountersIndex.UpdateRoutingQueueExeTime, time);
        }

        public static void SetLockingExeTime(long time)
        {
            _instance.SetRawValue((int)RoutingQueueProviderCountersIndex.LockingExeTime, time);
        }

        public override void InitCounterInfo()
        {
            AddCounterInfo((int)RoutingQueueProviderCountersIndex.GetRoutingQueueExeTime,
                            "Last Execution Time - GetRoutingQueue",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - GetRoutingQueue.");

            AddCounterInfo((int)RoutingQueueProviderCountersIndex.UpdateRoutingQueueExeTime,
                            "Last Execution Time - UpdateRoutingQueue",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - UpdateRoutingQueue.");

            AddCounterInfo((int)RoutingQueueProviderCountersIndex.LockingExeTime,
                            "Last Execution Time - Locking",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - Locking.");
        }
    }

    internal enum RoutingQueueProviderCountersIndex
    {
        GetRoutingQueueExeTime,
        UpdateRoutingQueueExeTime,
        LockingExeTime,
        Max,
    }
}
