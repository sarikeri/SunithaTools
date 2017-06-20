var moment = require('moment-timezone');
var dbAccess = require('./dbAccess.js');
var dbClient = new dbAccess();
var os = require("os");

class TrackingSubscriptionsRepository {
    constructor() { }

    getTrackingSubscriptions(ClientId, PackageDetail) {

        var params = {};
        params.ClientId = ClientId;
        params.SiteId = PackageDetail.SiteId;
        params.OrderId = PackageDetail.OrderId;
        params.CarrierId = PackageDetail.CarrierId;
        params.TrackingId = PackageDetail.TrackingId;
        //params.ShippingDateTime = moment(PackageDetail.ShippingDateTime.replace(' ', '+'), "YYYY-MM-DDTHH:mm:ss.SSSZ", true).toDate();
        params.ShippingDateTime = PackageDetail.ShippingDateTime.replace(' ', '+');

        return new Promise(function (resolve, reject) {
            var sql = "SELECT PTS_CLIENT_ID, SUBSCRIPTION_STATUS, SITE_ID, ORDER_ID, CARRIER_ID, TRACKING_ID, SHIPPING_DATE, RETRY_COUNT, DESTINATION_ZIP_CODE, LAST_TRACKING_DATE, LAST_TRACKING_STATUS, CREATE_DATE, UPDATE_DATE, CREATED_BY, PROCESSED_BY, ERROR_TEXT FROM PTS_TRACKING_SUBSCRIPTIONS WHERE PTS_CLIENT_ID = :ClientId AND SITE_ID = :SiteId AND ORDER_ID = :OrderId AND CARRIER_ID = :CarrierId AND TRACKING_ID = :TrackingId AND SHIPPING_DATE = CAST(to_timestamp_tz(:ShippingDateTime,'YYYY-MM-DD\"T\"HH24:MI:SS.FF3TZH:TZM') At Local AS DATE)";

            dbClient.getData(sql, params).then(function (result) {
                var finalResult = {};
                finalResult.data = result.rows;
                finalResult.ClientId = ClientId;
                finalResult.PackageDetail = PackageDetail;
                resolve(finalResult);
            })
                .catch(function (err) {
                    var errResult = {};
                    errResult.err = err;
                    errResult.data = params;
                    reject(errResult);
                });
        });
    }

    addTrackingSubscriptions(ClientId, PackageDetail) {

        var params = {};
        params.ClientId = ClientId;
        params.SiteId = PackageDetail.SiteId;
        params.OrderId = PackageDetail.OrderId;
        params.CarrierId = PackageDetail.CarrierId;
        params.TrackingId = PackageDetail.TrackingId;
        //params.ShippingDateTime = moment(PackageDetail.ShippingDateTime.replace(' ', '+'), "YYYY-MM-DDTHH:mm:ss.SSSZ", true).toDate();
        params.ShippingDateTime = PackageDetail.ShippingDateTime.replace(' ', '+');
        params.DestinationZipCode = PackageDetail.DestinationZipCode;
        params.hostname = os.hostname();

        return new Promise(function (resolve, reject) {
            var sql = "INSERT INTO PTS_TRACKING_SUBSCRIPTIONS(PTS_CLIENT_ID, SUBSCRIPTION_STATUS, SITE_ID, ORDER_ID, CARRIER_ID, TRACKING_ID, SHIPPING_DATE, RETRY_COUNT, DESTINATION_ZIP_CODE, LAST_TRACKING_DATE, LAST_TRACKING_STATUS, CREATE_DATE, CREATED_BY, PROCESSED_BY, ERROR_TEXT) VALUES(:ClientId, 1,:SiteId,:OrderId,:CarrierId,:TrackingId, CAST(to_timestamp_tz(:ShippingDateTime,'YYYY-MM-DD\"T\"HH24:MI:SS.FF3TZH:TZM') At Local AS DATE), 0, :DestinationZipCode, NULL, NULL, SYSDATE, :hostname, NULL, NULL)";

            dbClient.addUpdateData(sql, params).then(function (result) {
                resolve(result);
            })
                .catch(function (err) {
                    if (err.message.indexOf("ORA-00001: unique constraint") > -1) {
                        resolve();
                    }
                    else {
                        var errResult = {};
                        errResult.err = err;
                        errResult.data = params;
                        reject(errResult);
                    }
                });
        });
    }
}

module.exports = TrackingSubscriptionsRepository;