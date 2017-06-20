using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wag.Oms.SOS.DataProviders.Contracts;
using Wag.Oms.SOS.Logging;
using Dal = Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.Providers
{
    public class ShippedSuborderProvider : IShippedSuborderProvider
    {
        private string _conString;
        #region Properties
        public Dal.IShippedSuborderRepository ShippedSuborderRepository { get; set; }

        public string ConnectionString
        {
            get { return _conString; }
            set { _conString = value; }
        }
        #endregion

        #region Public Methods
        public int UpdateStatus(string suborderId, int ptsStatusId)
        {
            int retVal = 0;
            try
            {
                ShippedSuborderRepository.ConnectionString = _conString;
                retVal = ShippedSuborderRepository.UpdateStatus(suborderId, ptsStatusId);
            }
            catch (Exception ex)
            {
                Logger.LogAndThrow(ex, LogLevel.Error, new LogBag(), "Caught exception in SuborderProvider.UpdateStatus for suborderId {0}..{1}", suborderId, ex.Message);
            }

            return retVal;
        }

        public int UpdatePtsNextRetryDate(string suborderId, DateTime ptsNextRetryDate)
        {
            int retVal = 0;
            try
            {
                ShippedSuborderRepository.ConnectionString = _conString;
                retVal = ShippedSuborderRepository.UpdatePtsNextRetryDate(suborderId, ptsNextRetryDate);
            }
            catch (Exception ex)
            {
                Logger.LogAndThrow(ex, LogLevel.Error, new LogBag(), "Caught exception in SuborderProvider.UpdatePtsNextRetryDate for suborderId {0}..{1}", suborderId, ex.Message);
            }

            return retVal;
        }

        public bool TryLocking(string id, int ptsStatusId)
        {
            try
            {
                ShippedSuborderRepository.ConnectionString = _conString;
                var result = ShippedSuborderRepository.TryLocking(id, ptsStatusId);
                return result;
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, new LogBag(), "Caught exception in SuborderProvider.TryLocking for suborder id {0}..{1}", id, ex.Message);
                return false;
            }
        }
        #endregion
    }
}
