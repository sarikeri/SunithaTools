var ErrorFlags = require('./errorFlags');
var DiscrepancyInfo = require('./discrepancyInfo');
var InventoryInfo = require('./inventoryInfo');

class Lineitem
{
    constructor(requestLineitem)
    {
        this.LineitemId = requestLineitem.LineitemId;
        this.ReferenceId = requestLineitem.ReferenceId;
        this.Flags = requestLineitem.Flags;
        this.OpsFlags = requestLineitem.OpsFlags;
        this.SiteId = requestLineitem.SiteId;
        this.ProductId = requestLineitem.ProductId;
        this.ProductFlags = requestLineitem.ProductFlags;
        this.AvailableDate = requestLineitem.AvailableDate;
        this.OrderedQty = requestLineitem.OrderedQty;
        this.ReservedQty = requestLineitem.ReservedQty;

        this.RoutedLocation = {};
        this.RoutedLocation.LocationId = 0;
        this.RoutedLocation.LocationType = 0;
        this.RoutedLocationPriority = 0;

        this.Discrepancy = new DiscrepancyInfo();
        this.Inventory = new InventoryInfo();

        this.ErrorFlags = new ErrorFlags();;
        this.ErrorMessage = "";
    }
}


module.exports = Lineitem

