using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
namespace RegressionReport.BL
{
    public class RequestData
    {
        public string GetRequestObject(string filename)
        {
            try
            {
                return File.ReadAllText(@"C:\Automation\Examples\RegressionReport\RegressionReport\Data\" + filename + ".txt");
            }
            catch (Exception e)
            {
                return "Something wrong with the request template";
            }
        }

        public IRestResponse SubmitRequest(string urn, string requestObject, Method method)
        {
             IRestResponse _response = null;
             IRestRequest _request = null;
             RestClient _restClient = null;
            //// ***************************************************************
            //// NOTE: If this to be tested to a specific server, set the value 
            //// for _webAPIUrl to the desired server url by uncommenting the next line
            // _webAPIUrl = "<server fqdn with url>.

            Uri uri = new Uri(urn);
            var credential = new CredentialCache();
            _restClient = new RestClient();

            try
            {
                credential.Add(uri, "NTLM", CredentialCache.DefaultNetworkCredentials);
                _request = new RestRequest(method);
                _request.Resource = urn;
                _request.RequestFormat = DataFormat.Json;
                _request.AddHeader("Content-Type", "application/json");
                _request.AddHeader("Accept", "application/json");
                _request.Credentials = credential;
                JavaScriptSerializer j = new JavaScriptSerializer();
                if (!string.IsNullOrEmpty(requestObject))
                    _request.AddBody(j.Deserialize(requestObject, typeof(object)));

                // Send the request
                _response = _restClient.Execute(_request);
               
            }
            catch (Exception) { }

            return _response;
        }
    }
}