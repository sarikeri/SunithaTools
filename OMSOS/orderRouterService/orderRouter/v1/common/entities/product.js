class Product
{
    constructor(inLine)
    {
        this.ProductId = inLine.ProductId;
        this.ProductFlags = inLine.ProductFlags;
        this.AvailableDate = inLine.AvailableDate;
        this.OrderedQty = inLine.OrderedQty;
        this.AssignedQtyOnLocation = 0;;
        this.AssignedQtyOnLine = 0;

        this.RoutedLocation = {};
        this.RoutedLocation.LocationId = 0;
        this.RoutedLocation.LocationType = 0;

        this.AvailableQtyInNetwork = 0;
        this.AssignQtyBeforeCurrentRoute = 0;

        this.ProductLocations = [];
    }
}

module.exports = Product

