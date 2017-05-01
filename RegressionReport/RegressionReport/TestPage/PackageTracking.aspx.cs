using RegressionReport.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace RegressionReport.TestPage
{
    public partial class PackageTracking : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void TrackingAPIDDL_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (TrackingAPIDDL.SelectedValue.ToString().Equals("TrackingSubscription", StringComparison.CurrentCultureIgnoreCase))
                RequestTypeTB.Text = "POST";
            else
                RequestTypeTB.Text = "GET";
        }

        protected void TrackingIDDDL_Load(object sender, EventArgs e)
        {
            CommonUtils utils = new CommonUtils();
            switch(CarrierDDL.SelectedValue.ToString().ToLower())
            {
                case "fedex":
                    TrackingIDDDL.DataSource = utils.fedextrackingids;
                    break;
                case "usps":
                    TrackingIDDDL.DataSource = utils.uspstrackingids;
                    break;
                case "ontrac":
                    TrackingIDDDL.DataSource = utils.ontractrackingids;
                    break;
                case"lasership":
                    TrackingIDDDL.DataSource = utils.lasershiptrackingids;
                    break;
            }
            TrackingIDDDL.DataTextField = "Key";
            TrackingIDDDL.DataValueField = "Value";
            TrackingIDDDL.DataBind();
        }
        protected void GetRequestB_Click(object sender, EventArgs e)
        {
            CommonUtils utils = new CommonUtils();
            string getURL = utils.GetURL(EnvironmentDDL.SelectedValue.ToString());
            string querystring =utils.LoadTrackingAPIRequest(TrackingAPIDDL.SelectedValue.ToString());
            switch(TrackingAPIDDL.SelectedValue.ToString())
            {
                case"Heartbeat":
                    RequestTB.Text = getURL + querystring;
                    break;
                case"TrackingDetail":
                    RequestTB.Text = getURL + string.Format(querystring, System.DateTime.Now, CarrierDDL.SelectedValue.ToString().ToLower(), TrackingIDDDL.SelectedValue.ToString());
                    break;
                case"TrackingSubscription":
                    RequestTB.Text = string.Format(querystring, System.DateTime.Now, CarrierDDL.SelectedValue.ToString().ToLower(), TrackingIDDDL.SelectedValue.ToString());
                    break;
            }
             
        }

        protected void SubmitRequestB_Click(object sender, EventArgs e)
        {

        }
    }
}