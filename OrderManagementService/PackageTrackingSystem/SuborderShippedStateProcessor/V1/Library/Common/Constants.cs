namespace Wag.Oms.SOS.Common
{
    public static class Constants
    {
        public const string OdsDb = "ODS_DB";
        public const string PollInterval = "POLL_INTERVAL";
        public const string WaitIntervalBeforeTerminate = "WAIT_INTERVAL_BEFORE_TERMINATE";
        public const string UrlWebApi = "URL_WEBAPI";
        public const string ServerConnectionTimeout = "ServerConnectionTimeout";
        public const string SubscribingClientId = "SubscribingClientId";
        public const string RetryDelay = "RETRY_DELAY";
        public const string AllowedPTSCarrierIds = "AllowedPTSCarrierIds";
        public const string DisAllowedPTSSiteIds = "DisAllowedPTSSiteIds";

        public const int DefaultPollInterval = 120000;
        public const int DefaultWaitIntervalBeforeTerminate = 60000;
        public const int DefaultServerConnectionTimeout = 90000;
        public const int DefaultSubscribingClientId = 1;
        public const int DefaultRetryDelay = 15;

        public const string ContentType = "application/json";
        public const string AcceptType = "application/json";
    }
}


