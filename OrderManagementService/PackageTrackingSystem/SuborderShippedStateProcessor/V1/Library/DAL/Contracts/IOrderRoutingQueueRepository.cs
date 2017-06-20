using System.Collections.Generic;
using Wag.Oms.NewOrder.DAL.Contracts.Entities;

namespace Wag.Oms.NewOrder.DAL.Contracts
{
    public interface IOrderRoutingQueueRepository
    {
        string ConnectionString { get; set; }

        List<OrderRoutingQueue> GetOrderRoutingQueue(int statusId, int maxRowCount);
    }
}
