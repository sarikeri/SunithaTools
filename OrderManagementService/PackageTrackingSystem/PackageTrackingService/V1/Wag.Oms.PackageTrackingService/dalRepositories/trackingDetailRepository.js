var dbAccess = require('./dbAccess.js');
var dbClient = new dbAccess();
var os = require("os");

class TrackingDetailRepository {
    constructor() { }

    getTrackingDetail(SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId) {
        return new Promise(function (resolve, reject) {

            var params = {};
            params.SiteId = SiteId;
            params.OrderId = OrderId;
            params.ShippingDateTime = ShippingDateTime;
            params.CarrierId = CarrierId;
            params.TrackingId = TrackingId;

            var sql = "SELECT PTS_CLIENT_IDS, SITE_ID, ORDER_ID, CARRIER_ID, TRACKING_ID, SHIPPING_DATE, TRACKING_STATUS, TRACKING_DATA, TRACKING_DATE, CREATE_DATE, UPDATE_DATE, CREATED_BY, PROCESSED_BY FROM PTS_TRACKING_DETAILS WHERE SITE_ID = :SiteId AND ORDER_ID = :OrderId AND UPPER(CARRIER_ID) = UPPER(:CarrierId) AND TRACKING_ID = :TrackingId AND SHIPPING_DATE = CAST(to_timestamp_tz(:ShippingDateTime,'YYYY-MM-DD\"T\"HH24:MI:SS.FF3TZH:TZM') At Local AS DATE)";

            dbClient.getData(sql, params).then(function (result) {
                resolve(result.rows);
            })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    addTrackingDetail(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, trackResponse, trackingDate) {
        return new Promise(function (resolve, reject) {
            var params = {};
            params.SiteId = SiteId;
            params.OrderId = OrderId;
            params.ShippingDateTime = ShippingDateTime;
            params.CarrierId = CarrierId;
            params.TrackingId = TrackingId;
            params.ClientId = ClientId;
            params.TrackSummaryStatus = trackResponse.TrackSummary.Status;
            params.TrackingData = JSON.stringify(trackResponse);
            params.CreatedBy = os.hostname();
            params.TrackingDate = trackingDate;

            var sql = "INSERT INTO PTS_TRACKING_DETAILS(PTS_CLIENT_IDS, SITE_ID, ORDER_ID, CARRIER_ID, TRACKING_ID, SHIPPING_DATE, TRACKING_STATUS, TRACKING_DATA, TRACKING_DATE, CREATE_DATE, UPDATE_DATE, CREATED_BY, PROCESSED_BY) VALUES(:ClientId, :SiteId, :OrderId, :CarrierId, :TrackingId, CAST(to_timestamp_tz(:ShippingDateTime,'YYYY-MM-DD\"T\"HH24:MI:SS.FF3TZH:TZM') At Local AS DATE), :TrackSummaryStatus, :TrackingData, :TrackingDate, SYSDATE, SYSDATE, :CreatedBy, NULL)";

            dbClient.addUpdateData(sql, params).then(function (result) {
                resolve(result);
            })
                .catch(function (err) {
                    if (err.message.indexOf("ORA-00001: unique constraint") > -1) {
                        resolve();
                    }
                    else {
                        reject(err);
                    }
                });
        });
    }

    updateTrackingDetail(SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, trackResponse, clientIds, trackingDate) {
        return new Promise(function (resolve, reject) {
            var params = {};
            params.SiteId = SiteId;
            params.OrderId = OrderId;
            params.ShippingDateTime = ShippingDateTime;
            params.CarrierId = CarrierId;
            params.TrackingId = TrackingId;
            params.ClientIds = clientIds;
            params.TrackingStatus = trackResponse.TrackSummary.Status;
            params.TrackingData = JSON.stringify(trackResponse);
            params.ProcessedBy = os.hostname();
            params.TrackingDate = trackingDate;

            var sql = "UPDATE PTS_TRACKING_DETAILS SET PTS_CLIENT_IDS = :ClientIds, TRACKING_STATUS = :TrackingStatus, TRACKING_DATA = :TrackingData, TRACKING_DATE = :TrackingDate, UPDATE_DATE = SYSDATE, PROCESSED_BY = :ProcessedBy WHERE SITE_ID = :SiteId AND ORDER_ID = :OrderId AND UPPER(CARRIER_ID) = UPPER(:CarrierId) AND TRACKING_ID = :TrackingId AND SHIPPING_DATE = CAST(to_timestamp_tz(:ShippingDateTime,'YYYY-MM-DD\"T\"HH24:MI:SS.FF3TZH:TZM') At Local AS DATE) ";

            dbClient.addUpdateData(sql, params).then(function (result) {
                resolve(result);
            })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
}

module.exports = TrackingDetailRepository;