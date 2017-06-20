var _this;

class validator {
    constructor() {
        _this = this;
    }
    doBusinessValidation(message, suborder) {
        let validate = {};
        let isValid = true;
        let messages = [];
        let msg = {};

        //If lineitem is present means suborder is either partially shipped or backordared
        if (suborder.lineItems != null && suborder.lineItems != undefined && suborder.lineItems.length > 0) {
            //if packageInfo is prestnt then suborder is partially shipped
            if (message.packageInfo != null && message.packageInfo != undefined && message.packageInfo.length > 0) {
                for (let packageObj of message.packageInfo) {
                    let ValidationError = {};
                    if (packageObj.hasOwnProperty("trackingNumber")) {
                        if (packageObj.trackingNumber == null || packageObj.trackingNumber == undefined || packageObj.trackingNumber == "") {
                            isValid = false;
                            msg = "Tracking Number is null";
                            messages.push(msg);
                        }
                    }
                }
            }

            for (let suborderlineItem of suborder.lineItems) {
                let suborderLineItemId = suborderlineItem.lineItemId;
                let validatePackageInfo = true;
                if (message.lineItemInfo != null && message.lineItemInfo != undefined) {
                    for (let lineItem of message.lineItemInfo) {
                        if (lineItem.lineItemId == suborderLineItemId) {
                            let packageInfoQtyShipped = _this.getlineItemQtyShippedFromPackageInfo(message.packageInfo, lineItem.lineItemId);
                            if (lineItem.qtyShipped > 0) {
                                if (packageInfoQtyShipped > 0) {
                                    if (Number(packageInfoQtyShipped) == Number(lineItem.qtyShipped) && Number(packageInfoQtyShipped) + Number(lineItem.qtyNotShipped) == Number(suborderlineItem.qtySoftallocated)) {
                                        validatePackageInfo = false;
                                        isValid = true;
                                        break;
                                    } else {
                                        isValid = false;
                                        msg = `Failed  for SuborderID = ${suborder.suborderId}, lineItemId =  ${lineItem.lineItemId}, SKU =  ${lineItem.sku} as PackageInfoQtyShipped ${packageInfoQtyShipped} !=  LineItemInfoQtyShipped ${lineItem.qtyShipped} or  PackageInfoQtyShipped ${packageInfoQtyShipped} + LineItemInfoQtyNotShipped ${lineItem.qtyNotShipped} !=  qtySoftallocated ${suborderlineItem.qtySoftallocated}`;
                                        messages.push(msg);
                                    }
                                } else {
                                    isValid = false;
                                    msg = `Failed for SuborderID = ${suborder.suborderId}, lineItemId = ${lineItem.lineItemId}, SKU ${lineItem.sku} as PackageInfoQtyShipped ${packageInfoQtyShipped} !=  LineItemInfoQtyShipped ${lineItem.qtyShipped} or  PackageInfoQtyShipped ${packageInfoQtyShipped} + LineItemInfoQtyNotShipped ${lineItem.qtyNotShipped} !=  qtySoftallocated ${suborderlineItem.qtySoftallocated}`;
                                }
                            } else if (Number(lineItem.qtyNotShipped) == Number(suborderlineItem.qtySoftallocated)) {
                                if (packageInfoQtyShipped == 0) {
                                    validatePackageInfo = false;
                                    break;
                                } else {
                                    isValid = false;
                                    msg = `Failed for SuborderID = ${suborder.suborderId} as lineItemId = ${lineItem.lineItemId} and SKU ${lineItem.sku} present in PackageInfo`;
                                    messages.push(msg);
                                }
                            } else {
                                isValid = false;
                                msg = `Failed for SuborderID = ${suborder.suborderId} , lineItemId = ${lineItem.lineItemId}, SKU ${lineItem.sku} as lineItemInfoQtyNotShipped ${lineItem.qtyNotShipped} !=  qtySoftallocated ${suborderlineItem.qtySoftallocated}`;
                                messages.push(msg);
                            }
                        }
                    }
                }

                //If not found in the LineItems then all the items should be shipped.
                //Verify in the package info.
                if (validatePackageInfo) {
                    let packageInfoQtyShipped = _this.getlineItemQtyShippedFromPackageInfo(message.packageInfo, suborderlineItem.lineItemId);
                    if (packageInfoQtyShipped > 0) {
                        if (Number(packageInfoQtyShipped) != Number(suborderlineItem.qtySoftallocated)) {
                            isValid = false;
                            msg = `Failed for SuborderID = ${suborder.suborderId} PackageInfoQtyShipped ${packageInfoQtyShipped} != qtySoftallocated ${suborderlineItem.qtySoftallocated}`;
                            messages.push(msg);
                        }

                    } else {
                        isValid = false;
                        msg = `Failed for SuborderID = ${suborder.suborderId} as lineItemId =  ${suborderlineItem.lineItemId} missing`;
                        messages.push(msg);
                    }
                }
            }
        }
        validate.isValid = isValid;
        if (isValid == false) {
            if (messages.length > 0) {
                validate.message = JSON.stringify(messages).replace(new RegExp(/[ { } "\[\]']/, 'g'), " ");
            }
        }
        return validate;
    }


    getlineItemQtyShippedFromPackageInfo(packages, lineItemId) {
        let quanityShipped = 0;
        if (packages != null && packages != undefined && packages.length > 0) {
            for (let packageInfo of packages) {
                if (packageInfo.lineItemInfo != null && packageInfo.lineItemInfo != undefined) {
                    for (let lineItem of packageInfo.lineItemInfo) {
                        if (lineItemId == lineItem.lineItemId) {
                            quanityShipped = Number(quanityShipped) + Number(lineItem.qtyShipped);
                        }
                    }
                }
            }
        }
        return quanityShipped;
    }

    validateSuborderStatus(suborderId, status) {
        let validate = {};
        validate.isValid = true;
        if (status == "Deleted") {

            validate.isValid = false;
            validate.message = `validateSuborderStatus: Cannot ship suborder when status is ${status} for suborder = ${suborderId}`;
        }

        if (status == "Cancelled") {
            validate.isValid = false;
            validate.message = `validateSuborderStatus: Cannot ship suborder when status is ${status} for suborder = ${suborderId}`;
        }

        return validate;
    }
}

module.exports = validator;