<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Sample.aspx.cs" Inherits="RegressionReport.Sample" %>

<script type="text/javascript">

    function gvrowtoggle(row) {
        try {
            row_num = row; //row to be hidden
            ctl_row = row - 1; //row where show/hide button was clicked
            rows = document.getElementById('<%= grdOverLimitList.ClientID %>').rows;
      rowElement = rows[ctl_row]; //elements in row where show/hide button was clicked
      img = rowElement.cells[0].firstChild; //the show/hide button

      if (rows[row_num].className !== 'hidden') //if the row is not currently hidden 
          //(default)...
      {
          rows[row_num].className = 'hidden'; //hide the row
          img.src = '../Images/detail.gif'; //change the image for the show/hide button
      }
      else {
          rows[row_num].className = ''; //set the css class of the row to default 
          //(to make it visible)
          img.src = '../Images/close.gif'; //change the image for the show/hide button
      }
  }
    catch (ex) { alert(ex) }
}
</script>

<asp:GridView ID="grdOverLimitList" runat="server" AutoGenerateColumns="False" 
  DataSourceID="SQLOverLimitList" CssClass="gridview" AllowSorting="True" 
  AlternatingRowStyle-CssClass="alternating" 
  SortedAscendingHeaderStyle-CssClass="sortedasc" 
  SortedDescendingHeaderStyle-CssClass="sorteddesc" 
  FooterStyle-CssClass="footer" >
  <AlternatingRowStyle CssClass="alternating"></AlternatingRowStyle>
  <Columns>
    <asp:TemplateField>
      <ItemTemplate>
        <%--This is a placeholder for the details GridView--%>
      </ItemTemplate> 
    </asp:TemplateField>
    <asp:BoundField DataField="PetID" HeaderText="Pet ID" SortExpression="Pet ID" />
    <asp:BoundField DataField="AppointmentID" HeaderText="Appointment ID" 
		SortExpression="AppointmentID" />
    <asp:BoundField DataField="Horse Name" HeaderText="Horse Name" 
		SortExpression="Horse Name" />
    <asp:BoundField DataField="Client Surname" HeaderText="Client Surname" 
		SortExpression="Client Surname" />
    <asp:BoundField DataField="Senior Clinician" HeaderText="Senior Clinician" 
		SortExpression="Senior Clinician" />
    <asp:BoundField DataField="Warning Limit" 
	DataFormatString="{0:£#,##0.00;(£#,##0.00);''}" 
	HeaderText="Warning Limit" SortExpression="Warning Limit" />
    <asp:BoundField DataField="Cost" 
	DataFormatString="{0:£#,##0.00;(£#,##0.00);''}" 
	HeaderText="Cost" SortExpression="Cost" />
  </Columns>
  <EmptyDataTemplate>
    No data to display
  </EmptyDataTemplate>
  <FooterStyle CssClass="footer"></FooterStyle>
  <SortedAscendingHeaderStyle CssClass="sortedasc"></SortedAscendingHeaderStyle>
  <SortedDescendingHeaderStyle CssClass="sorteddesc"></SortedDescendingHeaderStyle>
</asp:GridView>

<%--<asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
</asp:ToolkitScriptManager>--%>
