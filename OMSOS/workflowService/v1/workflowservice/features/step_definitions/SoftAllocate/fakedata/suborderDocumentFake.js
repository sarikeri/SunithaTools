suborderDocumentFake = module.exports = {};
suborderDocumentFake.suborderDetails = {
  "suborderId": "05289711104101",
  "orderId": "05289711104100",
  "status": "1",
  "location": {
    "id": 10,
    "type": 1
  },
  "primaryLocation": {
    "id": 10,
    "type": 1
  },
  "shippingTypeId": 1,
  "shippingCarrierId": "4",
  "shippingTrackingInfo": "1Z6RA0680335272916",
  "actualShippingCost": "599",
  "numberOfBoxesShipped": "1",
  "shippedDate": "2017/03/16 04:28:37",
  "flags": {
    "isPresell": false,
    "isOutOfStock": false,
    "isAdjTooSoon": false,
    "isOutdropship": false
  },
  "routingStatus": 0,
  "cancellationReason": "Customer cancelled",
  "cancelledBy": "OAP",
  "createdBy": "ORC",
  "updatedBy": "DCCancellationHandler",
  "lineItems": [
    {
      "lineItemId": "1",
      "quantityOrdered": 5,
      "quantitySoftallocated": 5,
      "quantitySoftallocatedDate": "2017/03/14 04:28:37",
      "quantityShipped": 5,
      "quantityShippedDate": "2017/03/16 04:28:37",
      "flags": {
        "isGwp": true,
        "isKnownBO": true,
        "isHazmat": true,
        "isPresell": true
      }
    }
  ],
  "packages": [
    {
      "packageId": null,
      "trackingNumber": "1Z6RA0680335272916",
      "pickupNumber": "2121123",
      "weight": "1.7700",
      "shipCost": 599,
      "receivingBarcode": null,
      "expectedArrivalDate": "",
      "lineItems": [
        {
          "lineItemId": "1",
          "qty": "5",
          "unitCost": "9999",
          "sku": "32321",
          "upcCheckDigit": "12"
        }
      ]
    }
  ]
};