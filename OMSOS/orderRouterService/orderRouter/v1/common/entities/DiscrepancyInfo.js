var DiscrepancyReasonCodes = require('./discrepancyReasonCodes');

class DiscrepancyInfo
{
    constructor()
    {
        this.DiscrepancyReasons = new DiscrepancyReasonCodes();
        this.DemandLocation = {};
        this.DemandLocation.LocationId = 0;
        this.DemandLocation.LocationType = 0;
        this.DemandLocationPriority = 0;
    }
}

module.exports = DiscrepancyInfo
