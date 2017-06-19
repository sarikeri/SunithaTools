orderDocumentFake = module.exports={};

orderDocumentFake.OrderDetails =
{
    "_id" : "593e92084b32ff1c1b8f7e5a",
    "clientId" : "1",
    "clientOrderId" : "07727473363100",
    "orderId" : "05289711104100",
    "clientOrderRefId" : "a0b58c29a4a14adbac2",
    "initialStatus" : "pendingForInstruction",
    "memberInfo" : {
        "clientMemberId" : "a0b58c29a4a14a54aea22e3bfd0dbac2",
        "fName" : "beautomation",
        "lName" : "user",
        "email" : "pradeep@test.com",
        "phones" : [ 
            {
                "type" : "residential",
                "num" : "4253723568"
            }
        ]
    },
    "siteId" : "1",
    "orderPlacedDate" : "2017-02-24T20:19:19.849Z",
    "status" : "New",
    "total" : {
        "summary" : {
            "subtotal" : 100,
            "shipping" : 100,
            "credits" : 0.0,
            "total" : 14.22,
            "tax" : 1.14,
            "discount" : 100,
            "currency" : "usCents"
        },
        "details" : {
            "fsa" : {
                "subtotal" : 100,
                "shipping" : 100,
                "credits" : 100,
                "total" : 0.0,
                "tax" : 100,
                "discount" : 100,
                "currency" : "usCents"
            },
            "nonFsa" : {
                "subtotal" : 100,
                "shipping" : 100,
                "credits" : 100,
                "total" : 100,
                "tax" : 100,
                "discount" : 100,
                "currency" : "usCents"
            }
        }
    },
    "notifyPkgTrackingEvents" : true,
    "modificationsByClient" : [ 
        {
            "action" : "cancelAll",
            "reason" : "Client-request",
            "source" : "order-modificationsByClient-source",
            "date" : "2017-02-24T20:19:19.849Z"
        }
    ],
    "groups" : [ 
        {
            "clientGroupId" : "8gid34007209004",
            "groupId" : "34007209004",
            "clientGroupRefId" : "633216542214",
            "type" : "Regular",
            "siteId" : "1",
            "lineItems" : [ 
                {
                    "lineitemId" : "1",
                    "productDesc" : "good quality",
                    "orderedQty" : 1,
                    "unitPrice" : 100,
                    "adjustedUnitPrice" : 100,
                    "unitCost" : 3.59,
                    "unitShipCost" : 100,
                    "tax" : 100,
                    "siteId" : "1",
                    "productId" : "345372",
                    "clientLineItemId" : "2",
                    "flags" : {
                        "isGwp" : true,
                        "isKnownBO" : true,
                        "isHazmat" : true,
                        "isPresell" : true
                    },
                    "clientLineItemRefId" : "334007209004",
                    "upc" : "501287402688",
                    "clientProductId" : "34007209004pid",
                    "promoItemPriceText" : "null",
                    "brandId" : "64414",
                    "brandName" : "Rimmel Professional",
                    "manufacturerId" : "320",
                    "manufacturerName" : "Coty, Incorporated (Cosm",
                    "vendorProductId" : "34007209004",
                    "upcCheckDigit" : "3",
                    "productFlags" : "12345",
                    "availableDate" : "2017-02-24T20:19:19.849Z"
                }
            ],
            "shipMethodId" : "1",
            "shipAddr" : {
                "clientAddrId" : "34007209004abc",
                "fullName" : "Albert Einstein",
                "type" : "other",
                "isPOBox" : true,
                "addr1" : "411, 108th Ave NE",
                "addr2" : "1400",
                "city" : "Bellevue",
                "state" : "WA",
                "postalCode" : "98353",
                "countryCode" : "US",
                "phones" : [ 
                    {
                        "type" : "residential",
                        "num" : "4253723568"
                    }
                ]
            },
            "billAddr" : {
                "clientAddrId" : "34007209004abc",
                "fullName" : "Albert Einstein",
                "type" : "other",
                "isPOBox" : true,
                "addr1" : "411, 108th Ave NE",
                "addr2" : "1400",
                "city" : "Bellevue",
                "state" : "WA",
                "postalCode" : "98353",
                "countryCode" : "US",
                "phones" : [ 
                    {
                        "type" : "residential",
                        "num" : "4253723568"
                    }
                ]
            },
            "extraPackingSlipInfo" : {
                "balanceRewardsRedeemedAmt" : null,
                "accNumLast4" : "3847",
                "paymentType" : "Visa",
                "ccType" : "AmericanExpress"
            },
            "pickupInfo" : {
                "fName" : "Albert",
                "lName" : "Einstein",
                "email" : "flarp@drugstore.com",
                "phones" : [ 
                    {
                        "type" : "residential",
                        "num" : "987-654-3210"
                    }
                ],
                "locnType" : "1",
                "locnNum" : "30"
            },
            "currency" : "usCents",
            "reqArrivalDate" : "2017-02-24T20:19:19.849Z",
            "flags" : {
                "isAutoReorder" : true
            },
            "isGift" : true,
            "giftMsgInfo" : {
                "senderName" : "null",
                "msg" : "null"
            }
        }
    ],
    "createDate" : "2017-02-24T20:19:19.849Z",
    "updateDate" : "2017-02-24T20:19:19.849Z",
    "createdServer" : "Machine1",
    "updatedServer" : "Machine2"
};