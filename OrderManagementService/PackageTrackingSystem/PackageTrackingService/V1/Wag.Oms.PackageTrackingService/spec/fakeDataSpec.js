var fakeDataSpec = module.exports = {};

fakeDataSpec.TrackingDetailRequest = {
    "ClientId": "1",
    "SiteId": "100",
    "OrderId": "123456",
    "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
    "CarrierId": "FedEx",
    "TrackingId": "784845844971",
    "ClientRequestReferenceId": "90648AB95D00487EBE6482972FC73BFB"
};

fakeDataSpec.TrackingDetailResponseFedEx = {
    "ClientId": "1",
    "ClientRequestReferenceId": "90648AB95D00487EBE6482972FC73BFB",
    //"ResponseTimestamp": "2016-12-07T04:25:04.4-08:00",
    "ResultCode": 0,
    "TrackResponse": {
        "TrackSummary": {
            "SiteId": "100",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T11:20:45.450-07:00",
            "CarrierId": "FEDEX",
            "TrackingId": "784845844971",
            //"EstimatedDeliveryDateTime": "2016-12-08T23:12:36.36-08:00",
            "Status": "Delivered",
            "CarrierStatus": "Delivered",
            "DateTime": "2016-12-02T16:00:00.0-08:00",
            "Location": {
                "City": "Henderson",
                "State": "KY",
                "Country": "US"
            }
        },
        "TrackEvents": [
            {
                "Event": "Delivered",
                "DateTime": "2016-12-03T11:14:00.0-08:00",
                "Location": {
                    "City": "Henderson",
                    "State": "KY",
                    "Country": "US",
                    "ZipCode": "42420"
                }
            },
            {
                "Event": "On FedEx vehicle for delivery",
                "DateTime": "2016-12-03T08:33:00.0-08:00",
                "Location": {
                    "City": "Evansville",
                    "State": "IN",
                    "Country": "US",
                    "ZipCode": "47715"
                }
            },
            {
                "Event": "At local FedEx facility",
                "DateTime": "2016-12-03T08:32:00.0-08:00",
                "Location": {
                    "City": "Evansville",
                    "State": "IN",
                    "Country": "US",
                    "ZipCode": "47715"
                }
            },
            {
                "Event": "At destination sort facility",
                "DateTime": "2016-12-03T06:27:00.0-08:00",
                "Location": {
                    "City": "Louisville",
                    "State": "KY",
                    "Country": "US",
                    "ZipCode": "40209"
                }
            },
            {
                "Event": "Departed FedEx location",
                "DateTime": "2016-12-03T04:29:00.0-08:00",
                "Location": {
                    "City": "Memphis",
                    "State": "TN",
                    "Country": "US",
                    "ZipCode": "38118"
                }
            },
            {
                "Event": "Left FedEx origin facility",
                "DateTime": "2016-12-02T17:00:00.0-08:00",
                "Location": {
                    "City": "Olympia",
                    "State": "WA",
                    "Country": "US",
                    "ZipCode": "98516"
                }
            },
            {
                "Event": "Picked up",
                "DateTime": "2016-12-02T13:33:00.0-08:00",
                "Location": {
                    "City": "Olympia",
                    "State": "WA",
                    "Country": "US",
                    "ZipCode": "98516"
                }
            },
            {
                "Event": "Shipment information sent to FedEx",
                "DateTime": "2016-12-02T13:53:16.16-08:00",
                "Location": {}
            }
        ]
    }
};

fakeDataSpec.TrackingDetailResponseMock = {
    "ClientId": "1",
    "ClientRequestReferenceId": "90648AB95D00487EBE6482972FC73BFB",
    //"ResponseTimestamp": "2016-12-09T01:25:22.22-08:00",
    "ResultCode": 0,
    "TrackResponse": {
        "TrackSummary": {
            "SiteId": "100",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T11:20:45.450-07:00",
            "CarrierId": "USPS",
            "TrackingId": "784845844971",
            //"EstimatedDeliveryDateTime": "2016-12-08T23:12:37.37-08:00",
            "Status": "Delivered",
            "CarrierStatus": "DeliveryCompleted",
            //"DateTime": "2016-12-08T23: 12: 37.37-08: 00",
            "Location": {
                "City": "DELMAR",
                "State": "DE",
                "ZipCode": "19940",
                "Country": "USA"
            }
        },
        "TrackEvents": [
            {
                "Event": "OutforDelivery",
                //"DateTime": "2016-12-08T23: 12: 37.37-08: 00",
                "Location": {
                    "City": "DELMAR",
                    "State": "DE",
                    "ZipCode": "19940",
                    "Country": "USA"
                }
            },
            {
                "Event": "Received",
                //"DateTime": "2016-12-08T23: 12: 37.37-08: 00",
                "Location": {
                    "City": "BELLEVUE",
                    "State": "WA",
                    "ZipCode": "98004",
                    "Country": "USA"
                }
            },
            {
                "Event": "OrderCreated",
                //"DateTime": "2016-12-08T23: 12: 37.37-08: 00",
                "Location": {
                    "City": "BELLEVUE",
                    "State": "WA",
                    "ZipCode": "98004",
                    "Country": "USA"
                }
            }
        ]
    }
};

fakeDataSpec.TrackingDetailDBResultFedEx = [
    {
        "PTS_CLIENT_IDS": "1",
        "SITE_ID": "100",
        "ORDER_ID": "123456",
        "CARRIER_ID": "FedEx",
        "TRACKING_ID": "784845844971",
        "SHIPPING_DATE": "1997-07-16T11:20:45.45-07:00",
        "TRACKING_STATUS": "Delivered",
        "TRACKING_DATA": "{ \"TrackSummary\": { \"SiteId\": \"100\", \"OrderId\": \"123456\", \"ShippingDateTime\": \"1997-07-16T11:20:45.450-07:00\", \"CarrierId\": \"FEDEX\", \"TrackingId\": \"784845844971\", \"EstimatedDeliveryDateTime\": \"2016-12-09T03:29:31.31-08:00\", \"Status\": \"Delivered\", \"CarrierStatus\": \"Delivered\", \"DateTime\": \"2016-12-02T16:00:00.0-08:00\", \"Location\": { \"City\": \"Henderson\", \"State\": \"KY\", \"Country\": \"US\" } }, \"TrackEvents\": [{ \"Event\": \"Delivered\", \"DateTime\": \"2016-12-03T11:14:00.0-08:00\", \"Location\": { \"City\": \"Henderson\", \"State\": \"KY\", \"Country\": \"US\", \"ZipCode\": \"42420\" } }, { \"Event\": \"On FedEx vehicle for delivery\", \"DateTime\": \"2016-12-03T08:33:00.0-08:00\", \"Location\": { \"City\": \"Evansville\", \"State\": \"IN\", \"Country\": \"US\", \"ZipCode\": \"47715\" } }, { \"Event\": \"At local FedEx facility\", \"DateTime\": \"2016-12-03T08:32:00.0-08:00\", \"Location\": { \"City\": \"Evansville\", \"State\": \"IN\", \"Country\": \"US\", \"ZipCode\": \"47715\" } }, { \"Event\": \"At destination sort facility\", \"DateTime\": \"2016-12-03T06:27:00.0-08:00\", \"Location\": { \"City\": \"Louisville\", \"State\": \"KY\", \"Country\": \"US\", \"ZipCode\": \"40209\" } }, { \"Event\": \"Departed FedEx location\", \"DateTime\": \"2016-12-03T04:29:00.0-08:00\", \"Location\": { \"City\": \"Memphis\", \"State\": \"TN\", \"Country\": \"US\", \"ZipCode\": \"38118\" } }, { \"Event\": \"Left FedEx origin facility\", \"DateTime\": \"2016-12-02T17:00:00.0-08:00\", \"Location\": { \"City\": \"Olympia\", \"State\": \"WA\", \"Country\": \"US\", \"ZipCode\": \"98516\" } }, { \"Event\": \"Picked up\", \"DateTime\": \"2016-12-02T13:33:00.0-08:00\", \"Location\": { \"City\": \"Olympia\", \"State\": \"WA\", \"Country\": \"US\", \"ZipCode\": \"98516\" } }, { \"Event\": \"Shipment information sent to FedEx\", \"DateTime\": \"2016-12-02T13:53:16.16-08:00\", \"Location\": {} }] }",
        TRACKING_DATE: "1997-07-16T11:20:45.45-07:00",
        CREATE_DATE: "1997-07-16T11:20:45.45-07:00",
        UPDATE_DATE: "1997-07-16T11:20:45.45-07:00",
        CREATED_BY: "HQDEVOFF110X1A",
        PROCESSED_BY: ""
    }
];

fakeDataSpec.TrackingSubscriptionRequest = {
    "ClientId": 0,
    "ClientRequestReferenceId": "90648AB95D00487EBE6482972FC73BFB",
    "PackageDetails": [
        {
            "SiteId": "100",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "FedEx",
            "TrackingId": "711899316479",
            "SecondarySubscribingClientIds": ["1", "a", "b", "3", "4"],
            "DestinationZipCode": "98004"
        },
        {
            "SiteId": "0",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "USPS",
            "TrackingId": "9205590100067734965846",
            "DestinationZipCode": "98004"
        },
        {
            "SiteId": "101",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "USPS",
            "TrackingId": "9205590100067734965846",
            "SecondarySubscribingClientIds": [],
            "DestinationZipCode": "98004"
        },
        {
            "SiteId": "101",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "USPS",
            "TrackingId": "9205590100067734965846",
            "SecondarySubscribingClientIds": [],
            "DestinationZipCode": "98004"
        }
    ]
};

fakeDataSpec.TrackingSubscriptionRequestForRepositoryTest = {
    "ClientId": 1,
    "ClientRequestReferenceId": "90648AB95D00487EBE6482972FC73BFB",
    "PackageDetails": [
        {
            "SiteId": "100",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "FedEx",
            "TrackingId": "711899316479",
            "SecondarySubscribingClientIds": ["2"],
            "DestinationZipCode": "98004"
        }
    ]
};

fakeDataSpec.TrackingSubscriptionRequestInvalidPckg = {
    "ClientId": 0,
    "ClientRequestReferenceId": "90648AB95D00487EBE6482972FC73BFB",
    "PackageDetails": [
        {
            "SecondarySubscribingClientIds": ["10000", "a"]
        },
        {
            "SiteId": "a",
            "OrderId": "",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00l",
            "CarrierId": "",
            "TrackingId": "",
            "DestinationZipCode": ""
        },
        {
            "SiteId": "10101",
            "OrderId": "123456",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "USPS",
            "TrackingId": "9205590100067734965846",
            "SecondarySubscribingClientIds": [],
            "DestinationZipCode": "98004"
        }
    ]
};

fakeDataSpec.ValidationFailureDescription = {
    FailureDescription: 'Some validation failed in packageDetails',
    isValid: false,
    message: [{
        ClientId: 0,
        SiteId: undefined,
		ShippingDateTime: undefined,
		CarrierId: undefined,
		TrackingId: undefined,
		OrderId: undefined,
        FailureDescription: 'SiteId is required,OrderId is required,ShippingDateTime is required,CarrierId is required,TrackingId is required,DestinationZipCode is required,SecondarySubscribingClientId(s) [a] should be valid integer and [10000] is/are not authorized'
    },
    {
        ClientId: 0,
        SiteId: 'a',
        ShippingDateTime: '1997-07-16T19:20:30.450+01:00l',
        CarrierId: '',
        TrackingId: '',
        OrderId: '',
        FailureDescription: 'SiteId should be valid integer,OrderId is required,ShippingDateTime should be valid date,CarrierId is required,TrackingId is required,DestinationZipCode is required'
    },
    {
        ClientId: 0,
        SiteId: '10101',
        ShippingDateTime: '1997-07-16T19:20:30.450+01:00',
        CarrierId: 'USPS',
        TrackingId: '9205590100067734965846',
        OrderId: '123456',
        FailureDescription: 'Unauthorized access'
    }],
    ValidPackateDetails: []
};

fakeDataSpec.TrackingSubscriptionResponse = {
    "ClientId": 0,
    "ClientRequestReferenceId": "90648AB95D00487EBE6482972FC73BFB",
    //"ResponseTimestamp": "2016-12-07T02:56:04.4-08:00",
    "ResultCode": 0,
    "FailureDescription": [
        {
            "ClientId": 0,
            "SiteId": "100",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "FedEx",
            "TrackingId": "711899316479",
            "OrderId": "123456",
            "ErrorMessages": [
                "SecondarySubscribingClientId(s) [a,b] should be valid integer and [3,4] is/are not authorized"
            ]
        },
        {
            "ClientId": "a",
            "SiteId": "100",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "FedEx",
            "TrackingId": "711899316479",
            "OrderId": "123456",
            "ErrorMessages": [
                "Unauthorized access"
            ]
        },
        {
            "ClientId": "b",
            "SiteId": "100",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "FedEx",
            "TrackingId": "711899316479",
            "OrderId": "123456",
            "ErrorMessages": [
                "Unauthorized access"
            ]
        },
        {
            "ClientId": "3",
            "SiteId": "100",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "FedEx",
            "TrackingId": "711899316479",
            "OrderId": "123456",
            "ErrorMessages": [
                "Unauthorized access"
            ]
        },
        {
            "ClientId": "4",
            "SiteId": "100",
            "ShippingDateTime": "1997-07-16T19:20:30.450+01:00",
            "CarrierId": "FedEx",
            "TrackingId": "711899316479",
            "OrderId": "123456",
            "ErrorMessages": [
                "Unauthorized access"
            ]
        }
    ]
};

fakeDataSpec.TrackingSubscriptionDBResult = [
    {
        "PTS_CLIENT_ID": "0",
        "SUBSCRIPTION_STATUS": "1",
        "SITE_ID": "101",
        "ORDER_ID": "123456",
        "CARRIER_ID": "USPS",
        "TRACKING_ID": "9205590100067734965846",
        "SHIPPING_DATE": "1997-07-16T19:20:30.45+01:00",
        "RETRY_COUNT": "",
        "DESTINATION_ZIP_CODE": "98004",
        "LAST_TRACKING_DATE": "",
        "LAST_TRACKING_STATUS": "",
        "CREATE_DATE": "",
        "UPDATE_DATE": "",
        "CREATED_BY": "1997-07-16T19:20:30.45+01:00",
        "PROCESSED_BY": "HQDEVOFF110X1A",
        "ERROR_TEXT": ""
    },
    {
        "PTS_CLIENT_ID": "0",
        "SUBSCRIPTION_STATUS": "1",
        "SITE_ID": "0",
        "ORDER_ID": "123456",
        "CARRIER_ID": "USPS",
        "TRACKING_ID": "9205590100067734965846",
        "SHIPPING_DATE": "1997-07-16T19:20:30.45+01:00",
        "RETRY_COUNT": "",
        "DESTINATION_ZIP_CODE": "98004",
        "LAST_TRACKING_DATE": "",
        "LAST_TRACKING_STATUS": "",
        "CREATE_DATE": "",
        "UPDATE_DATE": "",
        "CREATED_BY": "1997-07-16T19:20:30.45+01:00",
        "PROCESSED_BY": "HQDEVOFF110X1A",
        "ERROR_TEXT": ""
    },
    {
        "PTS_CLIENT_ID": "0",
        "SUBSCRIPTION_STATUS": "1",
        "SITE_ID": "100",
        "ORDER_ID": "123456",
        "CARRIER_ID": "FedEx",
        "TRACKING_ID": "711899316479",
        "SHIPPING_DATE": "1997-07-16T19:20:30.45+01:00",
        "RETRY_COUNT": "",
        "DESTINATION_ZIP_CODE": "98004",
        "LAST_TRACKING_DATE": "",
        "LAST_TRACKING_STATUS": "",
        "CREATE_DATE": "",
        "UPDATE_DATE": "",
        "CREATED_BY": "1997-07-16T19:20:30.45+01:00",
        "PROCESSED_BY": "HQDEVOFF110X1A",
        "ERROR_TEXT": ""
    },
    {
        "PTS_CLIENT_ID": "1",
        "SUBSCRIPTION_STATUS": "1",
        "SITE_ID": "100",
        "ORDER_ID": "123456",
        "CARRIER_ID": "FedEx",
        "TRACKING_ID": "711899316479",
        "SHIPPING_DATE": "1997-07-16T19:20:30.45+01:00",
        "RETRY_COUNT": "",
        "DESTINATION_ZIP_CODE": "98004",
        "LAST_TRACKING_DATE": "",
        "LAST_TRACKING_STATUS": "",
        "CREATE_DATE": "",
        "UPDATE_DATE": "",
        "CREATED_BY": "1997-07-16T19:20:30.45+01:00",
        "PROCESSED_BY": "HQDEVOFF110X1A",
        "ERROR_TEXT": ""
    }
];