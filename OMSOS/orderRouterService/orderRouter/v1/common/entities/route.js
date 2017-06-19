var RouteFlags = require('./routeFlags');
//var ProcessorFlag = require('./processorFlag');
var Lineitem = require('./lineitem');
var Product = require('./product');

class Route
{
    constructor(routeId, routeName, lineitems, bundleTag)
    {
        this.RouteId = routeId;
        this.RouteName = routeName;
        this.RoutedLocation = {};
        this.RoutedLocation.LocationId = 0;
        this.RoutedLocation.LocationType = 0;
        this.RoutedLocationPriority = 0;
        this.PrimaryLocation = {};
        this.PrimaryLocation.LocationId = 0;
        this.PrimaryLocation.LocationType = 0;
        this.PrimaryLocationPriority = 0;
        this.RouteStatus = 100;
        this.Flags = new RouteFlags();
        this.ExecutedProcessors = [];
        this.BundleTag = bundleTag;
        this.DataReadyForRouting = false;
        this.ErrorCode = 0;
        this.ErrorMessage = "";
        this.Splitted = false;

        this.Lineitems = [];
        this.Products = [];

        //Lineitems, Products
        for (let line of lineitems)
        {
            let routeLine = new Lineitem(line);
            let product = {};
            for (let p of this.Products)
            {
                if (p.ProductId == line.ProductId)
                {
                    product = p;
                    product.OrderedQty = product.OrderedQty + line.product.OrderedQty;
                    break;
                }
            }

            if (product.ProductId == undefined)
            {
                product = new Product(line);
                this.Products.push(product);
            }
            this.Lineitems.push(routeLine);
        }

    }
}

module.exports = Route

