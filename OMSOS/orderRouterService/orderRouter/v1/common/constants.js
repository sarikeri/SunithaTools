module.exports = {
    LineitemFlags:
    {
        Hazmat: 1,	
        BenefitItem: 4,	        // this flag tells us if the item is a free item given by a promo
        Presell: 256,
        Outdropship: 16777216,	//bit 25. shipship item
        OutOfStock: 536870912,  //bit 29. line item was all OOS (out of stock) when did multi-dc routing
    }, 

    InputIdType:
    {
        NewOrder: 1,
        Presell: 2,
        BackOrder: 3,
        HeldOrder: 4,
        Cart: 5,
        SearchList: 6,
    },


    ErrorCode: {
        Ok: 0,
        Error: 1
    },

    RouteStatus: {
        Success: 0,
        SuccessWithDiscrepancy: 1,
        SuccessToCancel: 2,
        SuccessToHold: 3,
        SuccessToBackOrder: 4,
        SuccessToPresell: 5,
        Failed: -1,
        Pending: 100,
    },

    ErrorFlag: {
        // Order Level Error
        InvalidInputParameter = 1,

        // Group Level Error
        NoSkuStocked = 2,
        NoPrimaryDc = 4,
        NoLocationZipRowsFound = 8,

        // Routing Level Error
        NoPipeLineFound = 16,
        NoProcessorFound = 32,
        DcInDisaster = 64,
    },

    DiscrepancyReason: {
        NotToPrimaryNotStocked = 1,
        NotToPrimaryNoEnoughQty = 2,
        NotToPrimaryInDisaster = 4,
        ToPrimaryNetworkQtyZero = 8,
        ToPrimaryNetworkQtyLow = 16,
        ToPrimaryDcQtyLow = 32,
        Splitted = 64,
    },

    NoLocationIdOrTypeMsg: 'Missing either location Type or location Id, no promised date will return.'
}

