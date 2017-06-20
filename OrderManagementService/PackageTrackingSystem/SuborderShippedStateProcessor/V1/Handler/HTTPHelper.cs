using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace Wag.Oms.SOS.Handler
{
    public class HTTPHelper
    {
        public static HttpResponseMessage Post(string uri, string bodyString, string contentType, string acceptType, int timeout)
        {
            var client = new HttpClient { Timeout = TimeSpan.FromMilliseconds(timeout) };
            //create the content from the body
            var content = new StringContent(bodyString, Encoding.UTF8, contentType);

            //setup the header
            SetupHttpHeaders(client, acceptType);

            HttpResponseMessage response = client.PostAsync(uri, content).Result;
            return response;
        }

        public static HttpResponseMessage Put(string uri, string bodyString, string contentType, string acceptType, int timeout)
        {
            var client = new HttpClient { Timeout = TimeSpan.FromMilliseconds(timeout) };
            //create the content from the body
            StringContent content = new StringContent(bodyString, Encoding.UTF8, contentType);

            //setup the header
            SetupHttpHeaders(client, acceptType);

            HttpResponseMessage response = client.PutAsync(uri, content).Result;

            return response;
        }

        public static HttpResponseMessage Get(string uri, string acceptType, int timeout)
        {
            var client = new HttpClient { Timeout = TimeSpan.FromMilliseconds(timeout) };
            //setup the header
            SetupHttpHeaders(client, acceptType);

            HttpResponseMessage response = client.GetAsync(uri).Result;

            return response;
        }

        public static void SetupHttpHeaders(HttpClient client, string acceptType)
        {
            if (client.DefaultRequestHeaders.Accept == null || client.DefaultRequestHeaders.Accept.Count <= 0)
            {
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(acceptType));
            }
        }
    }
}
