
namespace Wag.Oms.EGWS.Models
{
    public class Heartbeat
    {
        public string ServiceStatus { set; get; }
        public string ServerTime { set; get; }
        public bool IsDBReachable { set; get; }
        public string ErrorMessage { set; get; }
    }
}