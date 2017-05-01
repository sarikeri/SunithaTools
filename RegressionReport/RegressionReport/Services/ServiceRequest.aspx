<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ServiceRequest.aspx.cs" Inherits="Services.ServiceRequest" MasterPageFile="~/Main.Master" %>

<asp:Content ID="Services" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <h3>Service Request Page..</h3>
    <asp:Label ID="L_Environment" runat="server" Text="Environment:"></asp:Label>
    <asp:DropDownList ID="DDL_Environment" runat="server" AutoPostBack="true" OnSelectedIndexChanged="DDL_Environment_SelectedIndexChanged" >
        <asp:ListItem Enabled="true" Text="Select" Value="Select"  Selected="True"/>
        <asp:ListItem Enabled="true"  Text="T1A" Value="T1A" Selected="False"  />
        <asp:ListItem Enabled="true" Text="T1B" Value="T1B" Selected="False" />
        <asp:ListItem Enabled="true" Text="T2" Value="T2" Selected="False" />
        <asp:ListItem Enabled="true" Text="T3" Value="T3" Selected="False" />
        <asp:ListItem Enabled="true" Text="W2" Value="W2" Selected="False" />
    </asp:DropDownList>
    <br />
    <br />
    <asp:Label ID="L_RequestURL" runat="server" Text="RequestURL:"></asp:Label>
    <asp:DropDownList ID="DDL_RequestURL" runat="server" OnSelectedIndexChanged="RequestURL_SelectedIndexChanged" AutoPostBack="true" Enabled="false" >
        <asp:ListItem Enabled="true" Text="Select" Value="Select"  Selected="True"/>
        <asp:ListItem Enabled="true"  Text="http://packagetrackingservice-t1b.dstest.drugstore.com/PackageTrackingService/v1/TrackingDetail" Value="PackageTrackingService/v1/TrackingDetail" Selected="False"  />
        <asp:ListItem Enabled="true" Text="http://packagetrackingservice-t1b.dstest.drugstore.com/PackageTrackingService/v1/TrackingSubscriptions" Value="PackageTrackingService/v1/TrackingSubscriptions" Selected="False" />
        <asp:ListItem Enabled="true" Text="http://webservices-t1b.dstest.drugstore.com/InventoryService/v1/inventory/inventorypost" Value="InventoryService/v1/inventory/inventorypost" Selected="False" />
        <asp:ListItem Enabled="true" Text="http://webservices-stage.dsstage.drugstore.com/PromisedDateReceivingService/v1/promiseddate" Value="PromisedDateReceivingService/v1/promiseddate" Selected="False" />
        <asp:ListItem Enabled="true" Text="http://getitbydateservice-t1b.dstest.drugstore.com/getitbydateservice/v1/promisedates" Value="getitbydateservice/v1/promisedates" Selected="False" />
        <asp:ListItem Enabled="true" Text="http://webservices-t1b.dstest.drugstore.com/eventgenerator/v1/event" Value="eventgenerator/v1/event" Selected="False" />
        
    </asp:DropDownList>
    <asp:Label ID="L_RequestOption" runat="server" Text="RequestOption:"></asp:Label>
    <asp:DropDownList ID="DDL_RequestOption" runat="server" AutoPostBack="true">
        <asp:ListItem Enabled="true" Text="POST" Value="POST" Selected="True" />
        <asp:ListItem Enabled="true" Text="GET" Value="GET" Selected="False" />
    </asp:DropDownList>
    <br />
    <br />
    <asp:Label ID="L_RequestObject" runat="server" Text="Request:"></asp:Label>
    <asp:TextBox ID="TB_RequestObject" runat="server" TextMode="MultiLine" Width="600" Height="400"></asp:TextBox>
    <asp:TextBox ID="TB_ResponseObject" runat="server" TextMode="MultiLine" Width="600" Height="400" ReadOnly="true"></asp:TextBox>
    <br />
    <br />
    <asp:Button ID="Submit" runat="server" Text="Submit"  OnClick="Submit_Click"/>
    
</asp:Content>
