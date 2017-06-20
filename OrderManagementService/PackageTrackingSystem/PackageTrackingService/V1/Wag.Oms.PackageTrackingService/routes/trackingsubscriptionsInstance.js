var express = require('express');
var router = express.Router();
var logger = require('../utils/logger.js');
var trackingsubscriptionsHandler = require('../handlers/trackingsubscriptionsHandler.js');
var trackingsubscriptionsHandlerObj = new trackingsubscriptionsHandler();

router.post('/', function (req, res) {

    var params = req.body;

    var ClientId = params.ClientId;
    var ClientRequestReferenceId = params.ClientRequestReferenceId;
    var PackageDetails = params.PackageDetails;

    trackingsubscriptionsHandlerObj.setTrackingSubscriptions(ClientId, ClientRequestReferenceId, PackageDetails)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            logger.error(err.FailureDescription);
            res.send(err);
        });
});

module.exports = router;