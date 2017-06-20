using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Wag.Oms.EGWS.ApiImplementation;
using Microsoft.QualityTools.Testing.Fakes;
using Wag.Oms.EGWS.Repositories.Fakes;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.Common.Fakes;

namespace Wag.Oms.EGWS.Test
{
    [TestClass]
    public class TestHeartbeat
    {
        [TestMethod]
        public void TestGetHeartbeat_HappyPath()
        {
            var mgr = new HeartbeatManager();
            
            try
            {
                using (ShimsContext.Create())
                {
                    ShimDBStatusRepository.AllInstances.GetCurrentDBDate = (a) => DateTime.Today;
                    var heartbeat = mgr.Get();
                    Assert.IsTrue(heartbeat.IsDBReachable);
                }
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestGetHeartbeat_DBException()
        {
            var mgr = new HeartbeatManager();

            try
            {
                using (ShimsContext.Create())
                {
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimDBStatusRepository.AllInstances.GetCurrentDBDate = (a) => { throw new Exception("DB Exception"); };
                    var heartbeat = mgr.Get();
                    Assert.IsFalse(heartbeat.IsDBReachable);
                    Assert.AreEqual(Constants.SERVICE_COULD_NOT_CONNECT_TO_DATABASE, heartbeat.ErrorMessage);
                }
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }
    }
}
