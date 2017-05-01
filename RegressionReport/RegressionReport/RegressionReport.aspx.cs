using RegressionReport.BL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace RegressionReport
{
    public partial class RegressionReport : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            
            //if (!IsPostBack)
            //{
            //}
        }
        [WebMethod]
        protected void GetApplicationData()
        {
            Report report = new Report();
            //report.GetLastApplicationTestCaseInfo();
        }
        protected void Show_Hide_ChildGrid(object sender, EventArgs e)
        {
            for (var i = 0; i < ReleaseGV.Rows.Count; i++)
            {
                ReleaseGV.Rows[i].Cells[0].FindControl("Applicationpnl").Visible = false;
            }
            ImageButton imgShowHide = (sender as ImageButton);
            GridViewRow row = (imgShowHide.NamingContainer as GridViewRow);
            if (imgShowHide.CommandArgument == "Show")
            {
                row.FindControl("Applicationpnl").Visible = true;
                imgShowHide.CommandArgument = "Hide";
                imgShowHide.ImageUrl = "~/images/minus.png";
                string releaseName = ReleaseGV.DataKeys[row.RowIndex].Value.ToString();
                GridView applicationGV = row.FindControl("ApplicationGV") as GridView;
                ReportObject.SelectParameters.Clear();
                ReportObject.SelectParameters.Add("releaseName", releaseName);
                applicationGV.DataBind();
            }
            else
            {
                row.FindControl("Applicationpnl").Visible = false;
                imgShowHide.CommandArgument = "Show";
                imgShowHide.ImageUrl = "~/images/plus.png";
            }
        }


    }
}