var constants = require('./../utils/constants');
const util = require('util');
var siteBehavior = require('./siteBehaviorConfig.json');

class businessValidations {
    constructor() {
    }

    validate(order) {
        let result = {};
        result.errorFlags = 0;
        result.errorMessage = '';
        this.validateClientAndSiteIds(order, result);
        if (result.errorFlags > 0) {
            return result;
        }
        if (order.groups.length == 0) {
            result.errorFlags |= constants.INITIALIZE_ORDER_MISSING_GROUP;
            result.errorMessage += constants.INITIALIZE_ORDER_MISSING_GROUP_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
        }
        let groupIds = [];
        order.groups.forEach((group) => {
            if (group.lineItems.length == 0) {
                result.errorFlags |= constants.INITIALIZE_ORDER_GROUP_MISSING_ITEM;
                result.errorMessage += constants.INITIALIZE_ORDER_GROUP_MISSING_ITEM_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
            }
            if (groupIds.indexOf(group.clientGroupId) > -1) {
                result.errorFlags |= constants.INITIALIZE_ORDER_DUPLICATE_GROUP_ID;
                result.errorMessage += util.format(constants.INITIALIZE_ORDER_DUPLICATE_GROUP_ID_MESSAGE, group.clientGroupId,
                    order.clientOrderId) + constants.ERROR_MESSAGE_SEPARATOR;
            }
            groupIds.push(group.clientGroupId);
            if (group.isGift) {
                if (group.giftMsgInfo == null) {
                    result.errorFlags |= constants.INITIALIZE_ORDER_MISSING_GIFT_MESSAGE_INFO;
                    result.errorMessage += util.format(constants.INITIALIZE_ORDER_MISSING_GIFT_MESSAGE_INFO_MESSAGE, group.clientGroupId)
                        + constants.ERROR_MESSAGE_SEPARATOR;
                }
                else if (group.giftMsgInfo.senderName == null || group.giftMsgInfo.senderName.trim() == '') {
                    result.errorFlags |= constants.INITIALIZE_ORDER_MISSING_GIFT_MESSAGE_INFO_SENDER_NAME;
                    result.errorMessage += util.format(constants.INITIALIZE_ORDER_MISSING_GIFT_MESSAGE_INFO_SENDER_NAME_MESSAGE, group.clientGroupId)
                        + constants.ERROR_MESSAGE_SEPARATOR;
                }
            }

            let lineItemIds = [];
            group.lineItems.forEach((lineItem) => {
                if (lineItemIds.indexOf(lineItem.clientLineItemId) > -1) {
                    result.errorFlags |= constants.INITIALIZE_ORDER_DUPLICATE_LINEITEM_ID;
                    result.errorMessage += util.format(constants.INITIALIZE_ORDER_DUPLICATE_LINEITEM_ID_MESSAGE, lineItem.clientLineItemId,
                        group.clientGroupId, order.clientOrderId) + constants.ERROR_MESSAGE_SEPARATOR;
                };
                lineItemIds.push(lineItem.clientLineItemId);

                // hazmat shipping restrictions
                if (lineItem.flags && lineItem.flags.isHazmat) {
                    siteBehavior.find((s) => {
                        if (s.clientId == order.clientId && s.siteId == lineItem.siteId) {
                            s.hazmatShippingRestrictions.disallowedCities.forEach((city) => {
                                if (group.shipAddr.city == city) {
                                    result.errorFlags |= constants.INITIALIZE_HAZMAT_RESTRICTED_ADDRESS;
                                    result.errorMessage += util.format(constants.INITIALIZE_HAZMAT_RESTRICTED_ADDRESS_MESSAGE, lineItem.productId,
                                        group.shipAddr.city) + constants.ERROR_MESSAGE_SEPARATOR;
                                }
                            });
                            s.hazmatShippingRestrictions.disallowedStates.forEach((state) => {
                                if (group.shipAddr.state == state) {
                                    result.errorFlags |= constants.INITIALIZE_HAZMAT_RESTRICTED_ADDRESS;
                                    result.errorMessage += util.format(constants.INITIALIZE_HAZMAT_RESTRICTED_ADDRESS_MESSAGE, lineItem.productId,
                                        group.shipAddr.state) + constants.ERROR_MESSAGE_SEPARATOR;
                                }
                            });
                        }
                    });
                }
            });
        });

        this.omsClientSpecificValidations(order, result);
        return result;
    }

    validateClientAndSiteIds(order, result) {
        let valid = this.isValidClientIdAndSiteId(order.clientId, order.siteId, result);
        order.groups.forEach((group) => {
            if (!valid) {
                return;
            }
            valid = this.isValidClientIdAndSiteId(order.clientId, group.siteId, result);
            group.lineItems.forEach((lineItem) => {
                if (!valid) {
                    return;
                }
                valid = this.isValidClientIdAndSiteId(order.clientId, lineItem.siteId, result);
            });
        });
    }

    isValidClientIdAndSiteId(clientId, siteId, result) {
        let valid = false;
        siteBehavior.find((s) => {
            if (s.clientId == clientId && s.siteId == siteId) {
                valid = true;
                return;
            }
        });
        if (!valid) {
            result.errorFlags |= constants.INVALID_CLIENT_INFO;
            result.errorMessage += constants.INVALID_CLIENT_INFO_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
        }
        return valid;
    }

    omsClientSpecificValidations(order, result) {
        order.groups.forEach((group) => {
            group.lineItems.forEach((lineItem) => {
                if (lineItem.promoItemPriceText != null && lineItem.promoItemPriceText.length > 8) {
                    result.errorFlags |= constants.EXCESS_PROMOITEMPRICETEXT_CHARACTER_LENGTH;
                    result.errorMessage += util.format(constants.EXCESS_PROMOITEMPRICETEXT_CHARACTER_LENGTH_MESSAGE, group.clientGroupId,
                        lineItem.clientLineItemId) + constants.ERROR_MESSAGE_SEPARATOR;
                }

                // If the GroupFlag is of AutoReOrder type, Requested Arrival Date must be of the form yyyy-mm-dd
                if ((result.errorFlags & constants.INITIALIZE_INVALID_REQUESTED_ARRIVAL_DATE) == 0 &&
                    (group.flags != null && group.flags.isAutoReorder &&
                        (group.reqArrivalDate == null || !(new RegExp(/^\d{4}-((0\d)|(1[012]))-(([012]\d)|3[01])$/).test(group.reqArrivalDate))))) {
                    result.errorFlags |= constants.INITIALIZE_INVALID_REQUESTED_ARRIVAL_DATE;
                    result.errorMessage += constants.INITIALIZE_INVALID_REQUESTED_ARRIVAL_DATE_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
                }
            });
        });
    }
}

module.exports = businessValidations;