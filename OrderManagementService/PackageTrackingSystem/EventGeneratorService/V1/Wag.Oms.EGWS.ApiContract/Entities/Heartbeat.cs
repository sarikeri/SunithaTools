﻿
namespace Wag.Oms.EGWS.ApiContract.Entities
{
    public class Heartbeat
    {
        public string ServerTime { set; get; }
        public bool IsDBReachable { set; get; }
        public string ErrorMessage { set; get; }
    }
}