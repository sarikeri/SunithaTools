using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wag.Oms.PerformanceCounters;

namespace Wag.Oms.OrderRouterClientService.PerformanceCounters
{
    public class PostRouterServiceCounters : Counters
    {
        private static readonly PostRouterServiceCounters _instance = new PostRouterServiceCounters();
        public static PostRouterServiceCounters Instance { get { return _instance; } }
        private PostRouterServiceCounters()
            : base("PostRouterService", "All PostRouterService Counters", PerformanceCounterCategoryType.SingleInstance, (int)PostRouterServiceCounterIndex.Max)
        {
        }

        public static void SetTaxClientRequestExeTime(long executionTime)
        {
            _instance.SetRawValue((int)PostRouterServiceCounterIndex.TaxClientExeTime, executionTime);
        }
        public static void IncrementNumOfTaxServiceFailure()
        {
            _instance.Increment((int)PostRouterServiceCounterIndex.NumOfOrderTaxClientFailure);
        }

        public override void InitCounterInfo()
        {
            AddCounterInfo((int)PostRouterServiceCounterIndex.TaxClientExeTime,
                          "Last Execution Time - TaxClient",
                          PerformanceCounterType.NumberOfItems64,
                          "Total number of milliseconds taken to execute last request - TaxClient.");
            AddCounterInfo((int)PostRouterServiceCounterIndex.NumOfOrderTaxClientFailure,
                           "# Tax Client Orders Failure",
                           PerformanceCounterType.NumberOfItems64,
                           "Total number of orders for which tax call failed");
        }
    }

    internal enum PostRouterServiceCounterIndex
    {
        TaxClientExeTime,
        NumOfOrderTaxClientFailure,
        Max,
    }
}
