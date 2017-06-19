class DiscrepancyReasonCodes {
    constructor() {
        this.NotToPrimaryBecauseNotStocked = false;
        this.NotToPrimaryBecauseNoEnoughQty = false;
        this.NotToPrimaryBecauseInDisaster = false;
        this.ToPrimaryButNetworkQtyZero = false;
        this.ToPrimaryButNetworkQtyLow = false;
        this.ToPrimaryButLocationQtyLow = false;
        this.Splitted = false;
    }

    hasDiscrepancy() {
        return this.NotToPrimaryBecauseNotStocked ||
        this.NotToPrimaryBecauseNoEnoughQty ||
        this.NotToPrimaryBecauseInDisaster ||
        this.ToPrimaryButNetworkQtyZero ||
        this.ToPrimaryButNetworkQtyLow ||
        this.ToPrimaryButLocationQtyLow ||
        this.Splitted;
    }
}

module.exports = DiscrepancyReasonCodes

