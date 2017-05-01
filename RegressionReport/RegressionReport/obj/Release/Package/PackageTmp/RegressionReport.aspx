<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RegressionReport.aspx.cs" Inherits="RegressionReport.RegressionReport"  %>


   <form id="form1" runat="server">
        <asp:GridView ID="ReleaseGV" runat="server" AutoGenerateColumns="false" CssClass="Grid" DataKeyNames="ReleaseName" DataSourceID="Release" >
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
                <%--<asp:FormParameter DefaultValue="Mar152016" FormField="ReleaseName" Name="ReleaseName" Type="String" />--%>
                <asp:Parameter Type="String" Name="releaseName" DefaultValue="Mar152016" />
            </SelectParameters>
        </asp:ObjectDataSource>
    </form>



