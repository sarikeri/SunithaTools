var oracleDataProvider = require('./oracleDataProvider');
var trackingSubscription = require('../entities/trackingSubscription');
var replaceall = require('replaceall');
var config = require('./../config');
var common = require('../utils/common.js');
var logger = require('./../utils/logger');

class trackingSubscriptionsProvider {
    constructor() {
        this.oracle = new oracleDataProvider();
    }

    getSubscriptions(carrierId, maxTrackingDays, lockedByServer) {
        var query = `select PTS_CLIENT_ID, CARRIER_ID, TRACKING_ID, SITE_ID, ORDER_ID, SHIPPING_DATE, LAST_TRACKING_STATUS, LAST_TRACKING_DATE, 
            RETRY_COUNT, DESTINATION_ZIP_CODE, TRUNC((SYSDATE - NVL(UPDATE_DATE, SYSDATE + 1))*24*60) MINS_AFTER_PREVIOUS_ATTEMPT 
            from webstore.pts_tracking_Subscriptions 
            where subscription_status = 1 and carrier_id = :carrier_id and retry_count < :retry_count and shipping_date >= sysdate - :max_tracking_days 
            and (locked_by is null or locked_by = :server_name)`;
        var bindParams = {
            carrier_id: carrierId,
            max_tracking_days: maxTrackingDays,
            server_name: lockedByServer,
            retry_count: config.maxRetryCount
        };
        var trackingSubscriptions = [];
        return new Promise((resolve, reject) => {
            this.oracle.getData(query, bindParams)
                .then((result) => {
                    if (result.rows.length > 0) {
                        result.rows.forEach((value) => {
                            trackingSubscriptions.push(new trackingSubscription(value.PTS_CLIENT_ID, value.CARRIER_ID, value.TRACKING_ID, 
                                value.SITE_ID, value.ORDER_ID, value.SHIPPING_DATE, value.LAST_TRACKING_STATUS, value.LAST_TRACKING_DATE,
                                value.RETRY_COUNT, common.get5DigitZipCode(value.DESTINATION_ZIP_CODE), value.MINS_AFTER_PREVIOUS_ATTEMPT));
                        });
                    }
                    resolve(trackingSubscriptions);
                })
                .catch((err) => {
                    logger.debug(err);
                    reject(err);
                });
        });
    }

    updateSubscription(subscription, subscriptionStatus, shouldUpdateTrackingDate, processedBy, errorText) {
        errorText = replaceall('\'', '\'\'', errorText);
        errorText = errorText.substring(0, config.errorTextLimit);
        var sql = `update webstore.pts_tracking_subscriptions set subscription_status = :subscription_status, retry_count = :retry_count,
                 last_tracking_status=:tracking_status, update_date=sysdate, processed_by=:processed_by, error_text=:error_text, locked_by = null`;
        if (shouldUpdateTrackingDate) {
            sql = `${sql}, last_tracking_date=sysdate `;
        }
        sql = `${sql} where pts_client_id = :pts_client_id and carrier_id = :carrier_id and tracking_id = :tracking_id and site_id = :site_id and order_id = :order_id
        and shipping_date = :shipping_date`;
        var bindParams = {
            subscription_status: subscriptionStatus,
            retry_count: subscription.retryCount,
            tracking_status: subscription.lastTrackingStatus,
            processed_by: processedBy,
            error_text: errorText,
            pts_client_id: subscription.ptsClientId,
            carrier_id: subscription.carrierId,
            tracking_id: subscription.trackingId,
            site_id: subscription.siteId,
            order_id: subscription.orderId,
            shipping_date: new Date(subscription.shippingDate)
        };
        logger.debug(`Updating tracking subscription for ${subscription.carrierId} ${subscription.trackingId}`);
        return new Promise((resolve, reject) => {
            this.oracle.updateData(sql, bindParams)
                .then((rowsAffected) => {
                    resolve(rowsAffected);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    lockSubscription(subscription, lockedBy) {
        var sql = `update webstore.pts_tracking_subscriptions set locked_by = :locked_by, update_date = sysdate 
            where pts_client_id = :pts_client_id and carrier_id = :carrier_id and tracking_id = :tracking_id and site_id = :site_id and order_id = :order_id
            and shipping_date = :shipping_date and (locked_by is null OR locked_by = :locked_by) and subscription_status = 1`;
        var bindParams = {
            locked_by: lockedBy,
            pts_client_id: subscription.ptsClientId,
            carrier_id: subscription.carrierId,
            tracking_id: subscription.trackingId,
            site_id: subscription.siteId,
            order_id: subscription.orderId,
            shipping_date: new Date(subscription.shippingDate)
        };
        return new Promise((resolve, reject) => {
            this.oracle.updateData(sql, bindParams)
                .then((rowsAffected) => {
                    if (rowsAffected == 1) {
                        resolve(true);
                    } else {
                        var err = { "lockedByOtherProcess": true };
                        reject(err);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = trackingSubscriptionsProvider;