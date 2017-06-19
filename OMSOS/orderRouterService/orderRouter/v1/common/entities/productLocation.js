class ProductLocation
{
    constructor(location, reservedQty, stockedErrorMessage, inventoryErrorMessage)
    {
        this.Location = {};
        this.Location.LocationId = location.LocationId;
        this.Location.LocationType = location.LocationType;
        this.ReservedQty = reservedQty;
        this.StockedErrorMessage = stockedErrorMessage;
        this.InventoryErrorMessage = inventoryErrorMessage;
    }
}
module.exports = ProductLocation;