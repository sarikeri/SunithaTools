var enums = module.exports = {};

enums.resultCodes = {
    success: 0,
    partialSuccess: 1,
    failure: 2
};

enums.result = {
    success: "Success",
    failure: "Failure"
};

enums.orderStatus = {
    mus: "Mus",
    musExpired: "MusExpired",
    cancelPending: "CancelPending",
    completed: "Completed"
}

enums.action = {
    cancelAll: "CancelAll",
    release: "Release"
}

enums.orderFulfillmentStatus = {
    cancelPending: "Cancel Pending",
    completed: "Completed",
    held: "Held",
    pendingDemandCreation: "PendingDemandCreation"
}

enums.orderBillingStatus = {
    completed: "Completed",
    processing: "Processing",
    failed: "Failed",
    notApplicable: "NotApplicable"
}

enums.suborderStatus = {
    new: "New",
    submitted: "Submitted",
    backordered: "Backordered",
    cancelPending: "CancelPending",
    cancelled: "Cancelled",
    shipped: "Shipped",
    presell: "Presell",
    shipReqSent: "ShipReqSent",
    deleted: "Deleted",
    softAllocRecv: "SoftAllocRecv"
}

enums.subGroupFulfillmentStatus = {
    backordered: "Backordered",
    held: "Held",
    cancelPending: "Cancel Pending",
    cancelled: "Cancelled",
    shipped: "Shipped",
    shipRequestSent: "Ship Request Sent",
    deleted: "Deleted"
}

enums.targetedFulfillmentCenter = {
    30: "EDDC",
    17: "NVDC",
    10: "NJDC"
}

enums.units = {
    dimensional:"Dimensional",
    lbs:"lbs",
    kgs:"Kgs"
}