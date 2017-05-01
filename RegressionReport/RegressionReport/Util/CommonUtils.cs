using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Xml.Linq;

namespace RegressionReport.Util
{
    public class CommonUtils
    {
        #region tracking events
        public Dictionary<string, string> fedextrackingids = new Dictionary<string, string>()
        {
            {"shipment information sent to fedex","449044304137821"},
            //At Pickup
            {"tendered", "149331877648230"},
            {"picked up", "020207021381215"},
            {"arrived at fedex location","403934084723025"},
            //At FedEx destination facility
            {"at local fedex facility", "920241085725456"},
            {"at destination sort facility","568838414941"},
            {"departed fedex location", "039813852990618"},
            {"on fedex vehicle for delivery","231300687629630"},
            {"international shipment release","797806677146"},
            //Delivery exception
            {"customer not available or business closed","377101283611590"},
            //Delivery exception
            {"local delivery restriction","852426136339213"},
            //Delivery exception
            {"incorrect address","797615467620"},
            //Shipment exception
            {"unable to deliver","957794015041323"},
            //Delivery exception
            {"returned to sender shipper","076288115212522"},
            {"clearance delay","581190049992"},
            //Delivered
            {"express delivered","122816215025810"},
            //Held for pickup
            {"hold at location","843119172384577"},
            //Shipment cancelled by sender
            {"shipment canceled","070358180009382"},
            //--smartposst--
            {"smartpost shipment information sent to fedex","02394653001023698293"},
            {"in transit","61292701078443410536"},
            {"out for delivery","61292700726653585070"},
            //Delivered
            {"smartpost delivered","02394653018047202719"}
        };
        public Dictionary<string, string> uspstrackingids = new Dictionary<string, string>()
        {
            {"picked up", "020207021381215"},
            {"delivered","122816215025810"},
            {"hold at location","843119172384577"},
            {"shipment canceled","070358180009382"},
            //smartposst
            {"in transit","61292701078443410536"},
            {"out for delivery","61292700726653585070"}
        };
        public Dictionary<string, string> ontractrackingids = new Dictionary<string, string>()
        {
            {"picked up", "020207021381215"},
            {"delivered","122816215025810"},
            {"hold at location","843119172384577"},
            {"shipment canceled","070358180009382"},
            //smartposst
            {"in transit","61292701078443410536"},
            {"out for delivery","61292700726653585070"}
        };
        public Dictionary<string, string> lasershiptrackingids = new Dictionary<string, string>()
        {
            {"picked up", "020207021381215"},
            {"delivered","122816215025810"},
            {"hold at location","843119172384577"},
            {"shipment canceled","070358180009382"},
            //smartposst
            {"in transit","61292701078443410536"},
            {"out for delivery","61292700726653585070"}
        };
        #endregion


        public string LoadTrackingAPIRequest(string trackingAPI)
        {
            string path = @"C:\Automation\Examples\RegressionReport\RegressionReport\Data\PackageTracking.xml";
            XDocument xdoc = XDocument.Load(path);
            if (trackingAPI.Equals("TrackingSubscription"))
            {
                IEnumerable<XElement> rootCategory = xdoc.Descendants(trackingAPI);
                string str = string.Empty;
                // I want to get ONLY the achievements in the root category
                foreach (XElement achieve in rootCategory.Elements())
                {
                    str+=achieve.ToString() + "\n";
                }
                return str;
                //return xdoc.Element("PackageTracking").Element("APIs").Element(trackingAPI).Descendants().ToString();
            }
            else
            {
                return xdoc.Element("PackageTracking").Element("APIs").Element(trackingAPI).Attribute("querystring").Value;
            }
        }

        public string GetURL(string environment)
        {
            string path = @"C:\Automation\Examples\RegressionReport\RegressionReport\Data\PackageTracking.xml";
            XDocument xdoc = XDocument.Load(path);
            return xdoc.Element("PackageTracking").Elements("Environment").Where(x => x.Attribute("Name").Value == environment).FirstOrDefault().Element("ServiceName").Attribute("EnvUrlFormat").Value;
        }

        public string SubmitRequest()
        {
            return "";
        }
        private string Submit(object requestObject,string _webAPIUrl, string urn, string action)
        {
            //Contract.Requires(!String.IsNullOrEmpty(urn), "The urn cannot be null or empty");
            //Contract.EndContractBlock();
            IRestRequest _request = null;
            IRestResponse _response = null;
            RestClient _restClient = null;
            bool networkError = false;
            int numOfRetries = 0;
            Stopwatch stopWatch = new Stopwatch();
            Uri uri = new Uri(_webAPIUrl + urn);
            //Logger.Info("API : " + uri.AbsoluteUri);
            //Logger.Info("API Operation Type: " + action.ToString());
            if (requestObject != null)
            {
                //Logger.Info("Request Object : " + JsonHelper.Serialize(requestObject));
            }

            var credential = new System.Net.CredentialCache();
            credential.Add(uri, "NTLM", System.Net.CredentialCache.DefaultNetworkCredentials);

            switch (action)
            {
                case "GET":
                    {
                        _request = new RestRequest(Method.GET);
                        _request.Resource = urn;
                        _request.RequestFormat = DataFormat.Json;
                        _request.AddHeader("Content-Type", "application/json");
                        _request.AddHeader("Accept", "application/json");
                        //// _request.AddBody(requestObject); //GET does not require a payload
                        _request.Credentials = credential;
                    }
                    break;

                case "POST":
                    {
                        _request = new RestRequest(Method.POST);
                        _request.Resource = urn;
                        //if (!String.IsNullOrEmpty(filePath))
                        //{
                        //    _request.AddFile("FacetDetail", File.ReadAllBytes(filePath), Path.GetFileName(filePath), null);
                        //}
                        //else
                        //{
                        _request.RequestFormat = DataFormat.Json; ;
                            _request.AddHeader("Content-Type", "application/json");
                            _request.AddHeader("Accept", "application/json");
                            _request.AddBody(requestObject);
                        //}
                        _request.Credentials = credential;
                    }
                    break;
            }

            //if (headers != null)
            //{
            //    foreach (DictionaryEntry de in headers)
            //    {
            //        _request.AddHeader(de.Key.ToString(), de.Value.ToString());
            //    }
            //}

            _request.Timeout = 600000;
            ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;
            do
            {
                // In case of network error due to bigIp url, we can try again!
                try
                {
                    
                    stopWatch.Start();
                    _response = _restClient.Execute(_request);
                    stopWatch.Stop();
                    //_textLogger.Info("Request time in Milliseconds:{0}", stopWatch.ElapsedMilliseconds);
                }
                catch (Exception ex)
                {
                    //if (numOfRetries == 2) Logger.Warn("The request was retried due to error:{0}", ex.Message);
                    //networkError = true;
                    //Thread.Sleep(2000);
                }

                if ((_response.Content != null) && _response.Content.Contains("The service is unavailable")) networkError = true;
            } while (networkError && numOfRetries++ < 3);

            //Logger.Info("Response Status : " + _response.StatusCode);

            //if (logResponse)
            //{
            //    if (!string.IsNullOrEmpty(_response.Content) && !_response.ContentType.ToLower().Contains("image"))
            //        Logger.Info("Response.Content : " + _response.Content);
            //    if (!string.IsNullOrEmpty(_response.ErrorMessage))
            //        Logger.Info("Response ErrorMessage: " + _response.ErrorMessage);

            //    // Get the elapsed time as a TimeSpan value.
            //    _totalExecutionTime = stopWatch.Elapsed;

            //    // Format and display the TimeSpan value. 
            //    //string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
            //    //    _totalExecutionTime.Hours, _totalExecutionTime.Minutes, _totalExecutionTime.Seconds,
            //    //    _totalExecutionTime.Milliseconds / 10);

            //    Logger.Info("Total {1} Request Time: {0} ms", _totalExecutionTime.TotalMilliseconds, urn);
            //}

            return _response.Content;
        }

        //public static String Serialize<T>(T obj, bool ignoreNullValues = false)
        //{
        //    //if (ignoreNullValues)
        //    //    return JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
        //    //else
        //    //    return JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Include });
        //}
    }
}