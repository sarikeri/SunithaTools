using System;

namespace Wag.Oms.NewOrder.DAL.Contracts.Entities
{
    public class OrderRoutingQueue : IDalEntity
    {
        public string Id { get; set; }

        public OrderEntity Order { get; set; }
    }
}