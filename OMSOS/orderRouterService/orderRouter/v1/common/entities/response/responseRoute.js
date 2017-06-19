var ResponseLineitem = require('./responseLineitem');
var ResponseRouteFlags = require('./responseRouteFlags');

class ResponseRoute
{
    constructor(route)
    {
        this.RouteId = route.RouteId;
        this.RoutedStatus = route.RoutedStatus;
        this.RoutedLocation = route.RoutedLocation;
        this.RoutedLocationPriority = route.RoutedLocationPriority;
        this.PrimaryLocation= route.PrimaryLocation;
        this.PrimaryLocationPriority = route.PrimaryLocationPriority;
        this.Flags = route.Flags;
        this.ExecutedProcessors = route.ExecutedProcessors;
        this.Lineitems = [];

        for (let line of route.Lineitems)
        {
            let responsLineitem = new ResponseLineitem(line);
            this.Lineitems.push(responsLineitem);
        }
    }
}

module.exports = ResponseRoute
