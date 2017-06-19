class ResponseLineitem
{
    constructor(line)
    {
        this.LineitemId = line.LineitemId;
        this.ReferenceId = line.ReferenceId;
        this.SplitConditionText = line.SplitConditionText;
        this.ErrorFlags = line.ErrorFlags;
        this.DiscrepancyInfo = line.Discrepancy;
        this.InventoryInfo = line.Inventory;
    }
}

module.exports = ResponseLineitem
