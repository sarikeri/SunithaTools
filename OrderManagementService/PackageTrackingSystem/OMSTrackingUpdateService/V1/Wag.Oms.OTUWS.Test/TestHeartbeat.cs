using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Wag.Oms.OTUWS.ApiImplementation;
using Microsoft.QualityTools.Testing.Fakes;
using Wag.Oms.OTUWS.Repositories.Fakes;
using Wag.Oms.OTUWS.Common.Fakes;
using Wag.Oms.OTUWS.Common;

namespace Wag.Oms.OTUWS.Test
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
                    ShimOTUWSLogger.LogItStringOTUWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
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
