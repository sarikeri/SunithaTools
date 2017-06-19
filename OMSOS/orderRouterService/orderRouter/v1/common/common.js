var moment = require('moment');
var Response = require('./entities/response/response');
var Product = require('./entities/product');
var ProductLocation = require('./entities/productLocation');
var Request = require('./entities/request/request');
var Context = require('./entities/context');
var Validator = require('../utils/validator');
var moment = require('moment');
var Response = require('./entities/response/response');
var TaskPipeline = require('./entities/taskPipeline');
var OosSplitter = require('../availableRoutes/oosSplitter');
var FullInventoryRouter = require('../availableRoutes/fullInventoryRouter');
var LocationZipRepository = require('../dataProviders/mongodb/locationZipRepository');
var config = require('../orderRouterconfig');
var rp = require('request-promise'),


//exporting a namespace
module.exports =
{
    getAvailableInventory: function (input)  
    {
        let options = {};
        options.method = 'POST';
        options.uri = config.serviceSettings.inventoryService.availableUri;
        options.body = input;
        options.json = true;
        options.timeout = config.serviceSettings.inventoryService.timeout;
        return rp(options).then(function (response) {return response;})
    },   

    createContext: function (reqbody)    
    {
        let context = {};

        // 1: create Request object
        let request = new Request(reqbody);

        // 2: create Context object and initialize the input value
        //    create a base route under the group and assign all line items to this base route
        context = new Context(request);

        // 3: do validation
        let result = Validator.validateRequestData(context);
        if (result != '') {
            context.ErrorFlags.InvalidInputData = true;
            context.ErrorMessage = result;
            let response = new Response(context);
            res.send(response);
            return context;
        }

        // 4: do mvp validation, one group with one item check
        result = Validator.validateMvpRequestData(context);
        if (result != '') {
            context.ErrorFlags.InvalidInputData = true;
            context.ErrorMessage = result;
            let response = new Response(context);
            res.send(response);
            return context;
        }

        //5: mongodb
        context.Groups[0].LocationZips = LocationZipRepository.get(context.Groups[0].CountryCode, context.Groups[0].ZipCode);
/*    context.Groups[0].Inventories = 
        
    AvailableInventoryRepository.get(context.Groups[0].Routes[0].Products, 100);*/
            invRequest = {},
            productIds = [];
            invRequest.ClientId = context.Id;
                let itemGroup = data.ItemGroups.find(x=> x.GroupSource ==
                data.SourceType > constant.SourceType.ProductDetail ? constant.GroupSource.CartOrOrder : constant.GroupSource.Others)    ;
    validItemGroup = itemGroup;
    for (const lt of itemGroup.Lineitems) {
                if (lt.ProductId != undefined && typeof lt.ProductId == "number" && lt.ProductId > 0 && productIds.indexOf(lt.ProductId) == -1) {
                    productIds.push(lt.ProductId);
                }              
            }
    if (productIds.length > 0) {
        irsRequest.ProductIds = productIds;
    }
    else {
        validatedResult.status = false;
        validatedResult.message = constant.IrsWithoutValidProductId
    }
}

        //6: set inventories disaster based on locationzips
        this.assignInDisaster(context.Groups[0].Inventories, context.Groups[0].LocationZips);

        return context;
    },

    createResponse: function (context)
    {
        for(let group of context.Groups)
        {
            context.ErrorFlags.addFlags(group.ErrorFlags);
            context.ErrorMessage += group.ErrorMessage;
        }
        var response = new Response(context);
        return response;
    },

    assignInDisaster: function (inventories, locationZips)
    {
        for (let inventory of inventories)
        {
            for (let locationZip of locationZips)
            {
                if (locationZip.Location.LocationId == inventory.Location.LocationId &&
                    locationZip.Location.LocationType == inventory.Location.LocationType)
                {
                    inventory.InDisaster = locationZip.InDisaster;
                    break;
                }
            }
        }
    },

    addRouteLines: function (route, lines)
    {
        for (let line of lines)
        {
            route.Lineitems.push(line);
            let product = {};
            for (let p of route.Products)
            {
                if (p.ProductId == line.ProductId)
                {
                    product = p;
                    product.OrderedQty = product.OrderedQty + line.OrderedQty;
                    break;
                }
            }
            if (product.ProductId == undefined)
            {
                product = new Product(line);
                route.Products.push(product);
            }
        }
        return route;
    },

    removeRouteLine: function (route, line, index)
    {
        route.Lineitems.splice(index, 1);
        for (let i = 0; i < route.Products.length; i++)
        {
            if (route.Products[i].ProductId == line.ProductId)
            {
                route.Products[i].OrderedQty = route.Products[i].OrderedQty - line.OrderedQty;
                if (route.Products[i].OrderedQty == 0) route.Products.splice(i, 1);
                break;
            }
        }
        return route;
    },

    collectDataBeforeRouting: function (groupContext, route)
    {
        if (route.DataReadyForRouting == true) return;

        // 1) set primary location
        route.PrimaryLocation.LocationId = groupContext.Inventories[0].Location.LocationId;
        route.PrimaryLocation.LocationType = groupContext.Inventories[0].Location.LocationType;
        route.Products = [];

        // 2) construct routGroup.Products (including order qty, qty reserved from request)
        for (let line of route.Lineitems)
        {
            if (line.RoutedLocation.LocationId > 0) continue;

            let found = false;
            let product = {};
            for (let i = 0; i < route.Products.length; i++)
            {
                if (route.Products[i].ProductId == line.ProductId)
                {
                    product = route.Products[i];
                    product.OrderedQty += line.OrderedQty;
                    found = true;
                }
            }
            if (found == false)
            {
                product = new Product(line);
                route.Products.push(product);
            }

            found = false;
            if (line.ReservedQty > 0)
            {
                for (let pl of product.ProductLocations)
                {
                    if (pl.Location.LocationId == groupContext.Location.LocationId &&
                        pl.Location.LocationType == groupContext.Location.LocationType)
                    {
                        pl.ReservedQty += line.ReservedQty;
                        found = true;
                        break;
                    }
                }
                if (found == false) product.ProductLocations.push(new ProductLocation(groupContext.Location, line.ReservedQty));
            }
        }

        // 3: collect network qtys
        for( let product of route.Products)
        {
            // do not count quantities for Dc which is in disaster or site disallowed
            for (let inventory of groupContext.Inventories)
            {
                if (inventory.InDisaster) continue;
                let availableQty = inventory.AvailableQty;
                if (availableQty < 0) availableQty = 0;
                product.AvailableQtyInNetwork += availableQty;
                product.AssignedQty += inventory.AssignedQty;
            }
        }

        // 4: check stocked and inventory from all Dcs
        for(let locationZip of groupContext.LocationZips)
        {
            for (let product of route.Products)
            {
                this.stockedInventoryCheck(groupContext, product, locationZip.Location);
            }
        }

        route.DataReadyForRouting = true;
    },

    stockedInventoryCheck: function (groupContext, product, location)
    {
        let stockedErrorMsg = '';
        let inventoryErrorMsg = '';
        let inventory = {};
        let productLocation = {};
        for (let inv of groupContext.Inventories)
        {
            if (inv.ProductId == product.ProductId && inv.Location.LocationId == location.LocationId &&
                inv.Location.LocationType == location.LocationType)
            {
                inventory = inv;
                break;
            }
        }
        for (let pl of product.ProductLocations)
        {
            if (pl.Location.LocationId == location.LocationId &&
                pl.Location.LocationType == location.LocationType)
            {
                productLocation = pl;
                break;
            }
        }

        if (productLocation.ProductId == undefined)
        {
            productLocation = new ProductLocation(location, 0, '', '');
            product.ProductLocations.push(productLocation);
        }

        if (inventory.ProductId == undefined) stockedErrorMsg = 'Sku ' + product.ProductId + ' not stocked. ';
        else
        {
            if (inventory.InDisaster == true) stockedErrorMsg = '(LocationId, LocationType) = (' + location.LocationId + ','
                + location.LocationType + ') in disaster.'

            if (inventory.AvailableQty < 0 ||
                inventory.AvailableQty + productLocation.ReservedQty - inventory.AssignedQty < product.OrderedQty)
            {
                if (inventory.AvailableQty < 0) {
                    inventoryErrorMsg = '(locationId, locationType) = (' + location.LocationId + ',' + location.LocationType + ') for product = ' +
                        product.ProductId + ' with negative available quantity = ' + inventory.AvailableQty + '.';
                }
                else {
                    inventoryErrorMsg = 'No full invengtory at (locationId, locationType) = (' + location.LocationId + ',' + location.LocationType + ') for product = ' +
                        product.ProductId + ' with available quantity = ' + inventory.AvailableQty + ', reservedQty = ' +
                        productLocation.ReservedQty + ', AssignedQty = ' + inventory.AssignedQty + ', OrderedQty = ' + product.OrderedQty;
                }
            }
        }
        productLocation.StockedErrorMessage = stockedErrorMsg;
        productLocation.InventoryErrorMessage = inventoryErrorMsg;
    },

    fullRouter: function(groupContext, route, locationZip, fullInventory)
    {
        let errorMessage = '';

        if (route.RouteStatus != 100 && route.RouteStatus != -1) return false;

        this.collectDataBeforeRouting(groupContext, route);

        let products = [];
        for (let product of route.Products)
        {
            if (product.RoutedLocation.LocationId <= 0) products.push(product);
        }
        if (products.length == 0) return false;

        for (let product of products)
        {
            for (let pl of product.ProductLocations)
            {
                if (pl.Location.LocationId == locationZip.Location.LocationId && pl.Location.LocationType == locationZip.Location.LocationType)
                {
                    if (fullInventory == true) errorMessage += (pl.StockedErrorMessage + pl.InventoryErrorMessage);
                    else errorMessage += pl.StockedErrorMessage;
                }
            }
        }
        if (errorMessage == '')
        {
            //Route products in this route to locationZip
            this.routingToLocation(groupContext, route, products, locationZip);
            return true;
        }
        else // failed to route
        {
            route.RoutedStatus = -1;
            return false;
        }
    },

    routingToLocation: function(groupContext, route, products, locationZip)
    {
        route.RoutedLocation.LocationId = locationZip.Location.LocationId;
        route.RoutedLocation.LocationType = locationZip.Location.LocationType;
        route.RoutedLocationPriority = locationZip.LocationPriority;

        route.PrimaryLocation.LocationId = groupContext.LocationZips[0].Location.LocationId;
        route.PrimaryLocation.LocationType = groupContext.LocationZips[0].Location.LocationType;
        route.PrimaryLocationPriority = groupContext.LocationZips[0].LocationPriority;

        let hasDiscrepancy = false;

        //routing products of route to locationZip at product level
        for(let product of products)
        {
            for (let inventory of groupContext.Inventories)
            {
                if (inventory.InDisaster == true ||
                    inventory.Location.LocationId != locationZip.Location.LocationId ||
                    inventory.Location.LocationType != locationZip.Location.LocationType
                    || inventory.ProductId != product.ProductId) continue;
                
                let productLocation = {};
                for (let pl of product.ProductLocations)
                {
                    if (pl.Location.LocationId == locationZip.Location.LocationId &&
                        pl.Location.LocationType == locationZip.Location.LocationType)
                    {
                        productLocation = pl;
                        break;
                    }
                }
                let availableQty = inventory.AvailableQty - inventory.AssignedQty;
                let reservedQty = (productLocation.ProductId == undefined) ? 0 : productLocation.ReservedQty;
                let assignQtyOnProduct = product.OrderedQty - reservedQty;
                if (availableQty < assignQtyOnProduct) assignQtyOnProduct = availableQty;

                product.RoutedLocation.LocationId = locationZip.Location.LocationId;
                product.RoutedLocation.LocationType = locationZip.Location.LocationType;
                product.AssignedQtyOnLocation = assignQtyOnProduct;
                inventory.AssignQtyBeforeCurrentRoute = inventory.AssignedQty;
                inventory.AssignedQty += assignQtyOnProduct;

                // distribute assigned qty to line item level and assign discrepancy
                for (let line of route.Lineitems)
                {
                    if (line.ProductId != product.ProductId || line.RoutedLocation.LocationId > 0) continue;
                    
                    if (route.Splitted == true) line.Discrepancy.DiscrepancyReasons.Splitted = true;

                    let reservedQty = 0;
                    if (product.RoutedLocation.LocationId == groupContext.Location.LocationId && 
                        product.RoutedLocation.LocationType == groupContext.Location.LocationType)
                        reservedQty = line.ReservedQty;
                    let assignQtyOnLine = line.OrderedQty - reservedQty;
                    if (product.AssignedQtyOnLocation - product.AssignedQtyOnLine < assignQtyOnLine)
                        assignQtyOnLine = product.AssignedQtyOnLocation - product.AssignedQtyOnLine;

                    line.AssignedQty = assignQtyOnLine;
                    line.RoutedLocation.LocationId = locationZip.Location.LocationId;
                    line.RoutedLocation.LocationType = locationZip.Location.LocationType;
                    line.RoutedLocationPriority = locationZip.LocationPriority;

                    line.Inventory.AvailableQtyInRoutedLocation = inventory.AvailableQty;
                    line.Inventory.AssignedQtyInRoutedLocation = inventory.AssignQtyBeforeCurrentRoute + product.AssignedQtyOnLine;
                    product.AssignedQtyOnLine += assignQtyOnLine;

                    if (line.RoutedLocation.LocationId == route.PrimaryLocation.LocationId &&
                        line.RoutedLocation.LocationType == route.PrimaryLocation.LocationType) // to primary
                    {
                        line.Discrepancy.DemandLocation.LocationId = line.RoutedLocation.LocationId;
                        line.Discrepancy.DemandLocation.LocationType = line.RoutedLocation.LocationType;
                        line.Discrepancy.DemandLocationPriority = line.RoutedLocationPriority;
                        line.Inventory.AvailableQtyInDemandLocation = line.Inventory.AvailableQtyInRoutedLocation;
                        line.Inventory.AssignedQtyInDemandLocation = line.Inventory.AssignedQtyInRoutedLocation;
                        line.Inventory.AvailableQtyInPrimaryLocation = line.Inventory.AvailableQtyInRoutedLocation;
                        line.Inventory.AssignedQtyInPrimaryLocation = line.Inventory.AssignedQtyInRoutedLocation;

                        // not enough inventory at primary location
                        if (inventory.AvailableQty - inventory.AssignedQty < product.OrderedQty - reservedQty)
                        {
                            if (product.AvailableQtyInNetwork + reservedQty - product.QtyAssignBeforeCurrentRoute <= 0)
                            {
                                line.Discrepancy.DiscrepancyReasons.ToPrimaryButNetworkQtyZero = true;
                            }
                            else if (product.AvailableQtyInNetwork + reservedQty - product.QtyAssignBeforeCurrentRoute < product.QtyOrdered)
                            {
                                line.Discrepancy.DiscrepancyReasons.ToPrimaryButNetworkQtyLow = true;
                            }
                            else
                            {
                                line.Discrepancy.DiscrepancyReasons.ToPrimaryButLocationQtyLow = true;
                            }
                        }
                    }
                    else 
                    {
                        // get primary location inventory info
                        let primaryLocationInventory = {};
                        for (let inventory of groupContext.Inventories) {
                            if (inventory.Location.LocationId == route.PrimaryLocation.LocationId &&
                                inventory.Location.LocationType == route.PrimaryLocation.LocationType &&
                                inventory.ProductId == product.ProductId) {
                                primaryLocationInventory = inventory;
                                break;
                            }
                        }

                        if (primaryLocationInventory.ProductId == undefined)
                        {
                            // sku not setup yet
                            line.Inventory.AvailableQtyInPrimaryLocation = 0;
                            line.Inventory.AssignedQtyInPrimaryLocation = 0;
                            line.Discrepancy.DiscrepancyReasons.NotToPrimaryBecauseNotStocked = true;
                        }
                        else
                        {
                            line.Inventory.AvailableQtyInPrimaryLocation = primaryLocationInventory.AvailableQty;
                            line.Inventory.AssignedQtyInPrimaryLocation = primaryLocationInventory.AssignedQty;
                            if (primaryLocationInventory.InDisaster == true)
                                line.Discrepancy.DiscrepancyReasons.NotToPrimaryBecauseInDisaster = true;

                            let reservedQtyInPrimary = 0;
                            for (let pl of product.ProductLocations)
                            {
                                if (pl.Location.LocationId == primaryLocationInventory.Location.LocationId &&
                                    pl.Location.LocationType == primaryLocationInventory.Location.LocationType)
                                {
                                    reservedQtyInPrimary = pl.ReservedQty;
                                    break;
                                }
                            } 
                            if (primaryLocationInventory.AvailableQty < 0 ||
                                primaryLocationInventory.AvailableQty + reservedQtyInPrimary -
                                primaryLocationInventory.AssignQtyBeforeCurrentRoute < product.QtyOrdered)
                            {
                                line.Discrepancy.DiscrepancyReasons.NotToPrimaryBecauseNoEnoughQty = true;
                            }
                        }

                        // get demand location inventory info
                        for (let locationZip of groupContext.LocationZips) {
                            for (let inventory of groupContext.Inventories) {
                                if (inventory.Location.LocationId == locationZip.Location.LocationId &&
                                    inventory.Location.LocationType == locationZip.Location.LocationType &&
                                    inventory.ProductId == line.ProductId) {
                                    line.Discrepancy.DemandLocation.LocationId = inventory.Location.LocationId;
                                    line.Discrepancy.DemandLocation.LocationType = inventory.Location.LocationType;
                                    line.Discrepancy.DemandLocationPriority = locationZip.LocationPriority;
                                    if (inventory.Location.LocationId == line.RoutedLocation.LocationId &&
                                        inventory.Location.LocationType == line.RoutedLocation.LocationType) {
                                        line.Inventory.AvailableQtyInDemandLocation = line.Inventory.AvailableQtyInRoutedLocation;
                                        line.Inventory.AssignedQtyInDemandLocation = line.Inventory.AssignedQtyInRoutedLocation;
                                    }
                                    else {
                                        line.Inventory.AvailableQtyInDemandLocation = inventory.AvailableQty;
                                        line.Inventory.AssignedQtyInDemandLocation = inventory.AssignedQty;
                                    }
                                    break;
                                }
                            }
                        }
                    } // for primary and demand location

                    if (hasDiscrepancy == false) hasDiscrepancy = line.Discrepancy.DiscrepancyReasons.hasDiscrepancy();
                } // for each line
            }// for each inventory
        } // for each product

        if (hasDiscrepancy == true) route.RouteStatus = 1;
        else route.RouteStatus = 0;
    }
}