using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using RegressionReport.BL;
using RestSharp;

namespace Services
{
    public partial class ServiceRequest : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void RequestURL_SelectedIndexChanged(object sender, EventArgs e)
        {
            RequestData rd = new RequestData();
            TB_ResponseObject.Text = "";
            TB_RequestObject.Text = rd.GetRequestObject(DDL_RequestURL.SelectedValue.Substring(DDL_RequestURL.SelectedValue.LastIndexOf('/')+1));
        }

        protected void Submit_Click(object sender, EventArgs e)
        {
            RequestData rd = new RequestData();
            IRestResponse _response = null;
            if (DDL_RequestOption.SelectedValue.Equals("POST"))
                _response = rd.SubmitRequest(DDL_RequestURL.SelectedItem.Text, TB_RequestObject.Text, Method.POST);
            else
                _response = rd.SubmitRequest(DDL_RequestURL.SelectedItem.Text + TB_RequestObject.Text, null, Method.GET);

            TB_ResponseObject.Text = _response != null ? _response.Content : "null response";
        }

        protected void DDL_Environment_SelectedIndexChanged(object sender, EventArgs e)
        {
            string url = "";
            DDL_RequestURL.Enabled = true;
            switch(DDL_Environment.SelectedValue)
            {
                case "T1A":
                    url = "http://webservices-t1a.dstest.drugstore.com/";
                    break;
                case "T1B":
                    url = "http://webservices-t1b.dstest.drugstore.com/";
                    break;
                case "T2":
                    url = "http://webservices-t2.corp.drugstore.com/";
                    break;
                case "T3":
                    url = "http://webservices-stage.dsstage.drugstore.com/";
                    break;
                //case "W2":
                //    url = "http://webservices-t1a.dstest.drugstore.com/";
                //    break;
            }
            foreach (ListItem item in DDL_RequestURL.Items)
            {
                if (!item.Text.Equals("Select"))
                    item.Text = url + item.Value;
            }
        }

       
    }
}