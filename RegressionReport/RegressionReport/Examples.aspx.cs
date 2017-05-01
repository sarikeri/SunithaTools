using RegressionReport.BL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace RegressionReport
{
    public partial class Examples : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                //Report report = new Report();
                //ReleaseFolderDDL.DataSource = report.GetReleaseFolders();
                //ReleaseFolderDDL.DataBind();
                //gvCustomers.DataSource = GetData("select top 10 * from Customers");
                //gvCustomers.DataBind();
            }
        }

        //private static DataTable GetData(string query)
        //{
        //    DataTable dt = new DataTable();
        //    return dt;
        //    //string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
        //    //using (SqlConnection con = new SqlConnection(constr))
        //    //{
        //    //    using (SqlCommand cmd = new SqlCommand())
        //    //    {
        //    //        cmd.CommandText = query;
        //    //        using (SqlDataAdapter sda = new SqlDataAdapter())
        //    //        {
        //    //            cmd.Connection = con;
        //    //            sda.SelectCommand = cmd;
        //    //            using (DataSet ds = new DataSet())
        //    //            {
        //    //                DataTable dt = new DataTable();
        //    //                sda.Fill(dt);
        //    //                return dt;
        //    //            }
        //    //        }
        //    //    }
        //    //}
        //}

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

        //private void BindOrders(string customerId, GridView gvOrders)
        //{
        //    gvOrders.ToolTip = customerId;
        //    gvOrders.DataSource = GetData(string.Format("select * from Orders where CustomerId='{0}'", customerId));
        //    gvOrders.DataBind();
        //}
        //protected void OnChildGrid_PageIndexChanging(object sender, GridViewPageEventArgs e)
        //{
        //    GridView gvOrders = (sender as GridView);
        //    gvOrders.PageIndex = e.NewPageIndex;
        //    BindOrders(gvOrders.ToolTip, gvOrders);
        //}
       
    }
}