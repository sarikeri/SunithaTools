<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PackageTracking.aspx.cs" Inherits="RegressionReport.TestPage.PackageTracking" MasterPageFile="~/Main.Master" %>

<%-- <form id="form1" runat="server">--%>
<asp:Content ID="Regression" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <h3>Package Tracking Test Page!</h3>
    <asp:Label ID="EnvironmentLB" runat="server" Text="Environment:"></asp:Label>
    <asp:DropDownList ID="EnvironmentDDL" runat="server" AutoPostBack="True" Height="18px" style="margin-left: 16px" Width="204px">
        <asp:ListItem Text="T1A Test environment" Value="T1A" />
        <asp:ListItem Text="T1B Test environment" Value="T1B" />
        <asp:ListItem Text="T2 Test environment" Value="T2" />
        <asp:ListItem Text="T3(Stage) Test environment" Value="T3" />
        <asp:ListItem Text="Integration environment" Value="Integration" />
        <asp:ListItem Text="Development environment" Value="X1A" />
        <asp:ListItem Text="WAG2 PreProd environment" Value="W2" />
    </asp:DropDownList>
    <br />
    <br />
    <asp:Label ID="TrackingAPILB" runat="server" Text="Traking API:"></asp:Label>
    <asp:DropDownList ID="TrackingAPIDDL" runat="server" AutoPostBack="True" OnSelectedIndexChanged="TrackingAPIDDL_SelectedIndexChanged" Height="16px" Width="204px" style="margin-left: 18px">
        <asp:ListItem Text="Heartbeat" Value="Heartbeat" />
        <asp:ListItem Text="Tracking Detail" Value="TrackingDetail" />
        <asp:ListItem Text="Tracking Subscription" Value="TrackingSubscription" />
    </asp:DropDownList>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<asp:Label ID="RequestTypeLB" runat="server" Text="Request Type :"></asp:Label>
    <asp:TextBox ID="RequestTypeTB" runat="server" Text="GET" ReadOnly="true" BackColor="#CCCCCC" Height="20px" Width="83px"></asp:TextBox>
    <br />
    <br />
    <asp:Label ID="CarrierLB" runat="server" Text="Carrier ID:"></asp:Label>
    <asp:DropDownList ID="CarrierDDL" runat="server" AutoPostBack="True" Height="16px" Width="204px" OnSelectedIndexChanged="TrackingIDDDL_Load" style="margin-left: 31px">
        <asp:ListItem Text="FedEx" Value="FedEx" />
        <asp:ListItem Text="USPS" Value="USPS" />
        <asp:ListItem Text="OnTrac" Value="OnTrac" />
        <asp:ListItem Text="Lasership" Value="Lasership" />
    </asp:DropDownList>

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

    <asp:Label ID="TrackingIDLB" runat="server" Text="Tracking ID:"></asp:Label>
    <asp:DropDownList ID="TrackingIDDDL" runat="server" AutoPostBack="false" Height="16px" Width="379px"  OnLoad="TrackingIDDDL_Load">
    </asp:DropDownList>
    <br />
    <br />
    <asp:Label ID="RequestLB" runat="server" Text="Request:"></asp:Label>
    <asp:TextBox ID="RequestTB" runat="server" TextMode="MultiLine" Height="212px" Width="576px" style="margin-left: 12px"></asp:TextBox>
    <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <asp:Button ID="GetRequestB" runat="server" Text="Generate Request"  OnClick="GetRequestB_Click"/>
    <asp:Button ID="SubmitRequestB" runat="server" Text="Submit Request" OnClick="SubmitRequestB_Click" />
    <br />
    <br />
    <asp:Label ID="ResponseLB" runat="server" Text="Response:"></asp:Label>
    <asp:TextBox ID="ResponseTB" runat="server" TextMode="MultiLine" Height="247px" Width="576px"></asp:TextBox>
</asp:Content>
