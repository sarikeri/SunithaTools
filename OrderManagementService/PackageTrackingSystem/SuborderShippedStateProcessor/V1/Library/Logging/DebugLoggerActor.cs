using System.Diagnostics;


namespace Wag.Oms.SOS.Logging
{
    public class DebugLoggerActor : LoggerActor
    {
        protected override void DoLog(LogLevel level, string msg)
        {
            Debug.WriteLine("SL [" + level + "] >> " + msg);
        }
    }
}
