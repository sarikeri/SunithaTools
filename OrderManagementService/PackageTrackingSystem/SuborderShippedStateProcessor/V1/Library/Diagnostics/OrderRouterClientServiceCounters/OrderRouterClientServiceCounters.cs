using System.Diagnostics;
using Wag.Oms.PerformanceCounters;

namespace Wag.Oms.OrderRouterClientService.PerformanceCounters
{
    public class OrderRouterClientServiceCounters : Counters
    {
        private static readonly OrderRouterClientServiceCounters _instance = new OrderRouterClientServiceCounters();
        public static OrderRouterClientServiceCounters Instance { get { return _instance; } }
        private OrderRouterClientServiceCounters()
            : base("OrderRouterClientService", "All OrderRouterClientService counters", PerformanceCounterCategoryType.SingleInstance, (int)OrderRouterClientServiceCounterIndex.Max)
        {
        }      
        public static void SetProcessOrderRouterClientExeTime(long time)
        {
            _instance.SetRawValue((int)OrderRouterClientServiceCounterIndex.ProcessOrderRouterClientExeTime, time);
        }
        public static void IncrementNumOfOrderRouterServiceFailure()
        {
            _instance.Increment((int)OrderRouterClientServiceCounterIndex.NumOfOrderRouterServiceFailure);
        }
        public static void SetOrderRouterRequestExeTime(long time)
        {
            _instance.SetRawValue((int)OrderRouterClientServiceCounterIndex.OrderRoutingExeTime, time);
        }
        public static void SetPostRouterRequestExeTime(long time)
        {
            _instance.SetRawValue((int)OrderRouterClientServiceCounterIndex.PostRouterRequestExeTime, time);
        }

        public override void InitCounterInfo()
        {
            AddCounterInfo((int)OrderRouterClientServiceCounterIndex.ProcessOrderRouterClientExeTime,
                            "Last Execution Time - ProcessOrderRouterClient",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - ProcessOrderRouterClient.");
            AddCounterInfo((int)OrderRouterClientServiceCounterIndex.NumOfOrderRouterServiceFailure,
                           "# Order Routing Failures",
                           PerformanceCounterType.NumberOfItems64,
                           "Total number of orders for which order routing failed");
            AddCounterInfo((int)OrderRouterClientServiceCounterIndex.OrderRoutingExeTime,
                            "Last Execution Time - Order Routing",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - OrderRouting.");
            AddCounterInfo((int)OrderRouterClientServiceCounterIndex.PostRouterRequestExeTime,
                            "Last Execution Time - PostRouter",
                            PerformanceCounterType.NumberOfItems64,
                            "Total number of milliseconds taken to execute last request - PostRouter.");
        }
    }

    internal enum OrderRouterClientServiceCounterIndex
    {      
        ProcessOrderRouterClientExeTime,
        NumOfOrderRouterServiceFailure,
        OrderRoutingExeTime,
        PostRouterRequestExeTime,
        Max,
    }
}
