<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RegressionReport.aspx.cs" Inherits="RegressionReport.RegressionReport" MasterPageFile="~/Main.Master"  %>
  <%-- <form id="form1" runat="server">--%>
        <asp:content id="Regression" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
            <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
            <script type="text/javascript">
                $("[src*=plus]").live("click", function () {

                    $(this).closest("tr").after("<tr><td></td><td colspan = '999'>" + $(this).next().html() + "</td></tr>")
                    $(this).attr("src", "images/minus.png");
                });
                $("[src*=minus]").live("click", function () {
                    $(this).attr("src", "images/plus.png");
                    $(this).closest("tr").next().remove();
                });
              </script>

            <h3>Order Management System Regression Automation Report!</h3>
<%--&nbsp; --%> 
            <asp:Label ID="ReleaseFolderLB" runat="server" Text="ReleaseName"></asp:Label>
            <asp:DropDownList ID="ReleaseFolderDDL" runat="server" AutoPostBack="True" DataSourceID="ReleaseName"></asp:DropDownList>
            <asp:ObjectDataSource ID="ReleaseName" runat="server" SelectMethod="GetReleaseFolders" TypeName="RegressionReport.BL.Report"></asp:ObjectDataSource>
            <br />
            <br />
            <asp:GridView ID="ReleaseGV" runat="server" AutoGenerateColumns="False" DataSourceID="Release" Width="766px"  CssClass="gridview" HeaderStyle-BackColor="#444444" HeaderStyle-ForeColor="White">
                <%--<AlternatingRowStyle BackColor="#DDDDDD"></AlternatingRowStyle>--%>
                <Columns>
                <asp:BoundField  DataField="ReleaseName" HeaderText="ReleaseName" SortExpression="ReleaseName"   />
                <asp:BoundField DataField="TotalTCCount" HeaderText="TotalTCCount" SortExpression="TotalTCCount" />
                <asp:BoundField DataField="PassTCCount" HeaderText="PassTCCount" SortExpression="PassTCCount" />
                <asp:BoundField DataField="FailTCCount" HeaderText="FailTCCount" SortExpression="FailTCCount" />
                <asp:BoundField DataField="PassPercent" HeaderText="PassPercent" SortExpression="PassPercent" />
            </Columns>
            <HeaderStyle BackColor="#444444" ForeColor="White"></HeaderStyle>
        </asp:GridView>
            <asp:ObjectDataSource ID="Release" runat="server" SelectMethod="GetLastTestCaseInfo" TypeName="RegressionReport.BL.Report">
                <SelectParameters>
                    <asp:ControlParameter ControlID="ReleaseFolderDDL" DefaultValue="R2016-06-27" Name="releaseFolder" PropertyName="SelectedValue" Type="String" />
                </SelectParameters>
                </asp:ObjectDataSource>
            <asp:ObjectDataSource ID="ReportObject" runat="server" SelectMethod="GetLastApplicationTestCaseInfo" TypeName="RegressionReport.BL.Report">
            <SelectParameters>
                <asp:ControlParameter ControlID="ReleaseFolderDDL" DefaultValue="R2016-06-27" Name="releaseFolder" PropertyName="SelectedValue" Type="String" />
                <asp:Parameter Type="String" Name="releaseName" DefaultValue="Catalog" />
            </SelectParameters>
        </asp:ObjectDataSource>
         <br />
         <br />

        <h3>Order Management System Functional Automation Report!</h3>
<%--&nbsp; --%> 
            <asp:Label ID="FunctionalL" runat="server" Text="ReleaseName"></asp:Label>
            <asp:DropDownList ID="FunctionalDDL" runat="server" AutoPostBack="True" DataSourceID="FunctionalOBS"></asp:DropDownList>
            <asp:ObjectDataSource ID="FunctionalOBS" runat="server" SelectMethod="GetFuncationalFolders" TypeName="RegressionReport.BL.Report"></asp:ObjectDataSource>
            <br />
            <br />
            <asp:GridView ID="FuncationalGV" runat="server" AutoGenerateColumns="False" DataSourceID="FunctionalTCInfo" Width="766px"  
                CssClass="gridview" HeaderStyle-BackColor="#444444" HeaderStyle-ForeColor="White" AlternatingRowStyle-BackColor="#dddddd" DataKeyNames="ReleaseName">
                <AlternatingRowStyle BackColor="#DDDDDD"></AlternatingRowStyle>
               <Columns>
                   <asp:TemplateField>
                    <ItemTemplate>
                        <img alt = "" style="cursor: pointer" src="images/plus.png" />
                        <asp:Panel ID="Applicationpnl" runat="server" Style="display: none">
                            <asp:GridView ID="Applicationgv" runat="server" AutoGenerateColumns="false" DataSourceID="FunctionalAppTCInfo"  Width="766px"  
                                CssClass="gridview" HeaderStyle-BackColor="#444444" HeaderStyle-ForeColor="White" AlternatingRowStyle-BackColor="#dddddd" >
                                <Columns>
                                    <asp:BoundField  DataField="ApplicationName" HeaderText="ApplicationName" SortExpression="ApplicationName"   />
                                    <asp:BoundField DataField="TotalTCCount" HeaderText="TotalTCCount" SortExpression="TotalTCCount" />
                                    <asp:BoundField DataField="PassTCCount" HeaderText="PassTCCount" SortExpression="PassTCCount" />
                                    <asp:BoundField DataField="FailTCCount" HeaderText="FailTCCount" SortExpression="FailTCCount" />
                                    <asp:BoundField DataField="PassPercent" HeaderText="PassPercent" SortExpression="PassPercent" />
                                </Columns>
                            </asp:GridView>
                        </asp:Panel>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:BoundField  DataField="ReleaseName" HeaderText="ExecutionDate" SortExpression="ReleaseName"   />
                <asp:BoundField DataField="TotalTCCount" HeaderText="TotalTCCount" SortExpression="TotalTCCount" />
                <asp:BoundField DataField="PassTCCount" HeaderText="PassTCCount" SortExpression="PassTCCount" />
                <asp:BoundField DataField="FailTCCount" HeaderText="FailTCCount" SortExpression="FailTCCount" />
                <asp:BoundField DataField="PassPercent" HeaderText="PassPercent" SortExpression="PassPercent" />
            </Columns>
            <HeaderStyle BackColor="#444444" ForeColor="White"></HeaderStyle>
        </asp:GridView>
        <asp:ObjectDataSource ID="FunctionalTCInfo" runat="server" SelectMethod="GetFunctionalTCInfo" TypeName="RegressionReport.BL.Report">
            <SelectParameters>
                <asp:ControlParameter ControlID="FunctionalDDL" DefaultValue="R2016-06-27" Name="funFolder" PropertyName="SelectedValue" Type="String" />
            </SelectParameters>
            </asp:ObjectDataSource>
        <asp:ObjectDataSource ID="FunctionalAppTCInfo" runat="server" SelectMethod="GetLastApplicationTestCaseInfo" TypeName="RegressionReport.BL.Report">
            <SelectParameters>
                <asp:ControlParameter ControlID="FunctionalDDL" DefaultValue="R2016-08-10" Name="releaseFolder" PropertyName="SelectedValue" Type="String" />
                <asp:ControlParameter ControlID="FuncationalGV"  DefaultValue="Functional" Name="releaseName" PropertyName="SelectedValue" Type="String" />
            </SelectParameters>
        </asp:ObjectDataSource>
         <br />
         <br />

         <h3>Order Management Code Coverage Report!</h3>
        <asp:GridView ID="CoverageGV" runat="server" DataSourceID="CodeCoverage" AutoGenerateColumns="False" SkinID="Professional" Font-Name="Verdana" Font-Size="10pt" Cellpadding="4"
                                  HeaderStyle-BackColor="#444444" HeaderStyle-ForeColor="White" AlternatingRowStyle-BackColor="#dddddd" CssClass="subgridview">
            <Columns>
                <%--<asp:BoundField DataField="ModuleName" HeaderText="ModuleName" SortExpression="ModuleName" />--%>
                <asp:BoundField DataField="ApplicationName" HeaderText="ApplicationName" SortExpression="ApplicationName" />
                <asp:BoundField DataField="LinesCovered" HeaderText="LinesCovered" SortExpression="LinesCovered" />
                <asp:BoundField DataField="LinesPartiallyCovered" HeaderText="LinesPartiallyCovered" SortExpression="LinesPartiallyCovered" />
                <asp:BoundField DataField="LinesNotCovered" HeaderText="LinesNotCovered" SortExpression="LinesNotCovered" />
                <asp:BoundField DataField="BlocksCovered" HeaderText="BlocksCovered" SortExpression="BlocksCovered" />
                <asp:BoundField DataField="BlocksNotCovered" HeaderText="BlocksNotCovered" SortExpression="BlocksNotCovered" />
                <asp:BoundField DataField="CoveragePercent" HeaderText="Coverage(%)" SortExpression="CoveragePercent" />
                <asp:BoundField DataField="BlockCoveragePercent" HeaderText="BlockCoverage(%)" SortExpression="BlockCoveragePercent" />
            </Columns>
        </asp:GridView>
        <asp:ObjectDataSource ID="CodeCoverage" runat="server" SelectMethod="CoverageReport" TypeName="RegressionReport.BL.CodeCoverage"></asp:ObjectDataSource>
        <%--</asp:content>--%>
 <%--   </form>--%>

        <%--<asp:content id="Functional" ContentPlaceHolderID="FunctionalCPH" runat="server">--%>
            
        </asp:content>

<asp:Content ID="Content2" runat="server" contentplaceholderid="head">
    <style type="text/css">
        .Grid {
            margin-left: 64px;
        }
    </style>
</asp:Content>