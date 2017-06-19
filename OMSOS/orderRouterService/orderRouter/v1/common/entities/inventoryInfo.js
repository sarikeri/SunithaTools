class InventoryInfo
{
    constructor()
    {
        this.AvailableQtyInDemandLocation = 0;
        this.AssignedQtyInDemandLocation = 0;
        this.AvailableQtyInPrimaryLocation = 0;
        this.AssignedQtyInPrimaryLocation = 0;
        this.AvailableQtyInRoutedLocation = 0;
        this.AssignedQtyInRoutedLocation = 0;
    }
}

module.exports = InventoryInfo
