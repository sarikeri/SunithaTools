var express = require('express');
var router = express.Router();
var logger = require('../utils/logger.js');
var trackingDetailHandler = require('../handlers/trackingDetailHandler.js');
var trackingDetailHandlerObj = new trackingDetailHandler();

router.get('/', function (req, res) {

    var params = req.query;

    var ClientId = params.ClientId;
    var SiteId = params.SiteId;
    var OrderId = params.OrderId;
    var ShippingDateTime = params.ShippingDateTime;
    var CarrierId = params.CarrierId;
    var TrackingId = params.TrackingId;
    var ClientRequestReferenceId = params.ClientRequestReferenceId;

    trackingDetailHandlerObj.getTrackingStatus(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            logger.error(err.FailureDescription);
            res.send(err);
        });
});

module.exports = router;