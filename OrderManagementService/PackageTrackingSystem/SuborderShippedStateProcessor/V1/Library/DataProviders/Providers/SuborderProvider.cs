using System;
using System.Collections.Generic;
using System.Linq;
using Wag.Oms.SOS.DataProviders.Contracts;
using Wag.Oms.SOS.DataProviders.Contracts.BusinessObjects;
using Wag.Oms.SOS.Logging;
using Dal = Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.Providers
{
    public class SuborderProvider : ISuborderProvider
    {
        private string _conString;
        #region Properties
        public Dal.ISuborderLoader SuborderLoader { get; set; }

        public string ConnectionString
        {
            get { return _conString; }
            set { _conString = value; }
        }
        #endregion

        #region Public Methods
        public List<Suborder> GetShippedSuborders()
        {
            var suborders = new List<Suborder>();
            try
            {
                SuborderLoader.ConnectionString = _conString;
                var suborderList = SuborderLoader.GetShippedSuborders();

                suborders.AddRange(ConstructSuborder(suborderList));
            }
            catch (Exception ex)
            {
                Logger.LogAndThrow(ex, LogLevel.Error, new LogBag(), "Caught exception in SuborderProvider.GetShippedSuborders..{0}", ex.Message);
            }

            return suborders;
        }
        #endregion

        #region Private Methods
        private IEnumerable<Suborder> ConstructSuborder(IEnumerable<Dal.Suborder> suborderGroup)
        {
            return suborderGroup.Select(row => new Suborder
            {
                SiteId = row.SiteId,
                ShippedDate = row.ShippedDate,
                ShippingCarrierId = row.ShippingCarrierId,
                ShippingTrackingInfo = row.ShippingTrackingInfo,
                OrderId = row.OrderId,
                SuborderId = row.SuborderId,
                ShipZip = row.ShipZip,
                SecondarySubscribingClientids = row.SecondarySubscribingClientids
            }).ToList();
        }

        #endregion
    }
}
