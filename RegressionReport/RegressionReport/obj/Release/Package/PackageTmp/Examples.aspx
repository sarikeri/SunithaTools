<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Examples.aspx.cs" Inherits="RegressionReport.Examples" %>

    <form id="form1" runat="server">
       <%-- <asp:GridView ID="ReleaseGV" runat="server" AutoGenerateColumns="false" CssClass="Grid" DataKeyNames="ReleaseName" DataSourceID="Release" >
            <Columns>
                <asp:TemplateField>
                    <ItemTemplate>
                        <asp:ImageButton ID="ImageButton1" runat="server" OnClick="Show_Hide_ChildGrid" ImageUrl="~/images/right_arrow.png"
                            CommandArgument="Show" />
                        <asp:Panel ID="pnlOrders" runat="server" Visible="false" Style="position: relative">
                            <asp:GridView ID="ApplicationGV" runat="server" AllowPaging="True" AutoGenerateColumns="False" SkinID="Professional" Font-Name="Verdana" Font-Size="10pt" Cellpadding="4"
                                  HeaderStyle-BackColor="#444444" HeaderStyle-ForeColor="White" AlternatingRowStyle-BackColor="#dddddd" DataSourceID="ReportObject" >
                                <Columns>
                                    <asp:BoundField DataField="ApplicationName" HeaderText="ApplicationName" SortExpression="ApplicationName" />
                                    <asp:BoundField DataField="TotalTCCount" HeaderText="TotalTCCount" SortExpression="TotalTCCount" />
                                    <asp:BoundField DataField="PassTCCount" HeaderText="PassTCCount" SortExpression="PassTCCount" />
                                    <asp:BoundField DataField="FailTCCount" HeaderText="FailTCCount" SortExpression="FailTCCount" />
                                </Columns>
                            </asp:GridView>
                        </asp:Panel>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:BoundField  DataField="ReleaseName" HeaderText="ReleaseName" SortExpression="ReleaseName"   />
            </Columns>
        </asp:GridView>
        <asp:ObjectDataSource ID="Release" runat="server" SelectMethod="GetLastTestCaseInfo" TypeName="RegressionReport.BL.Report"></asp:ObjectDataSource>
        <asp:ObjectDataSource ID="ReportObject" runat="server" SelectMethod="GetLastApplicationTestCaseInfo" TypeName="RegressionReport.BL.Report">
            <SelectParameters>
                <asp:Parameter Type="String" Name="releaseName" DefaultValue="Mar152016" />
            </SelectParameters>
        </asp:ObjectDataSource>--%>
        <asp:GridView ID="GridView1" runat="server" DataSourceID="Coverage" AutoGenerateColumns="False">
            <Columns>
                <asp:BoundField DataField="ModuleName" HeaderText="ModuleName" SortExpression="ModuleName" />
                <asp:BoundField DataField="ModuleLC" HeaderText="ModuleLC" SortExpression="ModuleLC" />
                <asp:BoundField DataField="ModuleLPC" HeaderText="ModuleLPC" SortExpression="ModuleLPC" />
                <asp:BoundField DataField="ModuleLNC" HeaderText="ModuleLNC" SortExpression="ModuleLNC" />
                <asp:BoundField DataField="ModuleBC" HeaderText="ModuleBC" SortExpression="ModuleBC" />
                <asp:BoundField DataField="ModuleBNC" HeaderText="ModuleBNC" SortExpression="ModuleBNC" />
            </Columns>
        </asp:GridView>
        <asp:ObjectDataSource ID="Coverage" runat="server" SelectMethod="CoverageReport" TypeName="RegressionReport.BL.CodeCoverage"></asp:ObjectDataSource>
    </form>
