var constants = require('./../utils/constants');
var enums = require('./../utils/enums');
const util = require('util');

class businessValidations {
    constructor() {
    }

    validateGroups(order, existingGroups) {
        let result = {};
        result.errorFlags = 0;
        result.errorMessage = '';
        if (order.groups == null) {
            return result;
        }
        let groupIds = [];
        order.groups.forEach((group) => {
            if (!this.isValidGroupId(group.clientGroupId, existingGroups)) {
                result.errorFlags |= constants.MODIFY_ORDER_INVALID_CLIENT_GROUP_ID;
                result.errorMessage += util.format(constants.MODIFY_ORDER_INVALID_CLIENT_GROUP_ID_MESSAGE, group.clientGroupId,
                    order.orderId) + constants.ERROR_MESSAGE_SEPARATOR;
            }

            if (groupIds.indexOf(group.clientGroupId) > -1) {
                result.errorFlags |= constants.MODIFY_ORDER_DUPLICATE_GROUP_ID;
                result.errorMessage += util.format(constants.MODIFY_ORDER_DUPLICATE_GROUP_ID_MESSAGE, group.clientGroupId,
                    order.orderId) + constants.ERROR_MESSAGE_SEPARATOR;
            }
            groupIds.push(group.clientGroupId);

            let lineItemIds = [];
            group.lineItems.forEach((lineItem) => {
                if (!this.isValidLineItemId(group.clientGroupId, lineItem.clientLineItemId, existingGroups)) {
                    result.errorFlags |= constants.MODIFY_ORDER_INVALID_CLIENT_LINEITEM_ID;
                    result.errorMessage += util.format(constants.MODIFY_ORDER_INVALID_CLIENT_LINEITEM_ID_MESSAGE, lineItem.clientLineItemId, 
                        group.clientGroupId, order.orderId) + constants.ERROR_MESSAGE_SEPARATOR;
                }

                if (lineItemIds.indexOf(lineItem.clientLineItemId) > -1) {
                    result.errorFlags |= constants.MODIFY_ORDER_DUPLICATE_LINEITEM_ID;
                    result.errorMessage += util.format(constants.MODIFY_ORDER_DUPLICATE_LINEITEM_ID_MESSAGE, lineItem.clientLineItemId,
                        group.clientGroupId, order.clientOrderId) + constants.ERROR_MESSAGE_SEPARATOR;
                };
                lineItemIds.push(lineItem.clientLineItemId);
            });
        });

        this.omsClientSpecificValidations(order, result);
        return result;
    }

    isValidGroupId(clientGroupId, existingGroups) {
        let isValid = false;
        existingGroups.forEach((group) => {
            if (group.clientGroupId == clientGroupId) {
                isValid = true;
            }
        });
        return isValid;
    }

    isValidLineItemId(clientGroupId, clientLineItemId, existingGroups) {
        let isValid = false;
        existingGroups.forEach((group) => {
            if (isValid) {
                return;
            }
            if (group.clientGroupId == clientGroupId) {
                group.lineItems.forEach((lineItem) => {
                    if (lineItem.clientLineItemId == clientLineItemId) {
                        isValid = true;
                        return;
                    }
                });
            }
        });
        return isValid;
    }

    validateOrderStatus(existingOrderStatus, action) {
        let result = {};
        result.errorFlags = 0;
        result.errorMessage = '';
        if (existingOrderStatus == enums.orderStatus.completed) {
            result.errorFlags |= constants.ORDER_COMPLETED;
            result.errorMessage += constants.ORDER_COMPLETED_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
        }
        else if (existingOrderStatus == enums.orderStatus.cancelPending) {
            result.errorFlags |= constants.ORDER_MODIFY_PENDING;
            result.errorMessage += constants.ORDER_MODIFY_PENDING_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
        }
        else if (action == enums.action.release && existingOrderStatus != enums.orderStatus.mus) {
            result.errorFlags |= constants.ORDER_IN_PROGESS_CANNOT_MODIFY;
            result.errorMessage += constants.ORDER_IN_PROGESS_CANNOT_MODIFY_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
        }
        return result;
    }

    omsClientSpecificValidations(order, result) {
        order.groups.forEach((group) => {
            group.lineItems.forEach((lineItem) => {
                if (lineItem.promoItemPriceText != null && lineItem.promoItemPriceText.length > 8) {
                    result.errorFlags |= constants.EXCESS_PROMOITEMPRICETEXT_CHARACTER_LENGTH;
                    result.errorMessage += util.format(constants.EXCESS_PROMOITEMPRICETEXT_CHARACTER_LENGTH_MESSAGE, group.clientGroupId,
                        lineItem.clientLineItemId) + constants.ERROR_MESSAGE_SEPARATOR;
                }
            });
        });
    }
}

module.exports = businessValidations;