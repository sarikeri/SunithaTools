using System.Diagnostics;
using Wag.Oms.PerformanceCounters;

namespace Wag.Oms.OrderRouterClientService.PerformanceCounters
{
    public class OrderProviderCounters : Counters
    {
        private static readonly OrderProviderCounters _instance = new OrderProviderCounters();
        public static OrderProviderCounters Instance { get { return _instance; } }
        private OrderProviderCounters()
            : base("OrderProvider", "All OrderProvider counters", PerformanceCounterCategoryType.SingleInstance, (int)OrderProviderCountersIndex.Max)
        {
        }
        public static void SetGetOrderByStatusExeTime(long time)
        {
            _instance.SetRawValue((int)OrderProviderCountersIndex.OrderByStatusExeTime, time);
        }

        public static void SetGetOrderByOrderIdExeTime(long time)
        {
            _instance.SetRawValue((int)OrderProviderCountersIndex.OrderByOrderIdExeTime, time);
        }

        public override void InitCounterInfo()
        {
            AddCounterInfo((int)OrderProviderCountersIndex.OrderByStatusExeTime,
                            "Last Execution Time - GetOrderByStatus",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - GetOrderByStatus.");

            AddCounterInfo((int)OrderProviderCountersIndex.OrderByOrderIdExeTime,
                            "Last Execution Time - GetOrderByOrderId",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - GetOrderByOrderId.");
        }
    }

    internal enum OrderProviderCountersIndex
    {
        OrderByStatusExeTime,
        OrderByOrderIdExeTime,
        Max,
    }
}
