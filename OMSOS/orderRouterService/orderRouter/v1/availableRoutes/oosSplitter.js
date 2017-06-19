var common = require('../common/common');
var Route = require('../common/entities/route');
var ExecutedProcessor = require('../common/entities/executedProcessor');


class oosSplitter {
constructor(context, metadata, parameters) {
    this.context = context;
    this.metadata = metadata;
    this.parameters = parameters;
}

execute() {
    //process: function (context, groupContext, processor)   
    for (let group of this.metadata.Groups)
    {
        for (let route of group.Routes)
        {
            for (let line of route.Lineitems)
            {
                for (let inventory of group.Inventories)
                {
                    if (inventory.ProductId != line.ProductId) continue;
                    if (inventory.InDisaster == 1) continue;
                    line.Flags.IsOOS = true;
                    if (inventory.AvailableQty > 0 && inventory.AvailableQty - inventory.AssignedQty > 0)
                    {
                        line.Flags.IsOOS = false;
                        break;
                    }
                }
            }
        }
    }
    let splitLineitems = [];
    for (let route of groupContext.Routes)
        {
            for (let i = 0; i < route.Lineitems.length; i++)
            {
                if (route.Lineitems[i].Flags.IsOOS == true)
                {
                    splitLineitems.push(route.Lineitems[i]);
                    common.removeRouteLine(route, route.Lineitems[i], i);
                }
            }
        }
    
    if (splitLineitems.length == 0) return false;
    
    // remove route with 0 lineitems
    for (let i = 0; i < groupContext.Routes.length; i++) {
        if (groupContext.Routes[i].Lineitems.length == 0)
            groupContext.Routes.splice(i, 1);
    }
    
    let splitRoute = {};
    for (let route of groupContext.Routes)
        {
            if (route.RouteName == processor.AreaTag)
            {
                splitRoute = route;
                common.addRouteLines(splitRoute, splitLineitems);
                break;
            }
        }
    if (splitRoute.RouteId == undefined) {
        splitRoute = new Route(groupContext.Routes.length + 1, processor.AreaTag, splitLineitems, processor.AreaTag);
        groupContext.Routes.push(splitRoute);
    }
    
    executedProcessor = new ExecutedProcessor(processor.Name, true);
    splitRoute.ExecutedProcessors.push(executedProcessor);
    
    splitRoute.Splitted = true;
    
    //this.isExecutedSuccesfully = true;
    //console.log('task ' + processor.Name + ' end. ');
    return false;
}
}


module.exports = oosSplitter;
