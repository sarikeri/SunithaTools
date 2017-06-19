//constant = require('../common/constant');
var common = require('../common/common');
var ExecutedProcessor = require('../common/entities/executedProcessor');


class fullInventoryRouter {
constructor(context, metadata, parameters) {
    this.context = context;
    this.metadata = metadata;
    this.parameters = parameters;
}

execute() {
   for (let group of this.Context.Groups)
   {
    for (let route of group.Routes) {
            for (let locationZip of group.LocationZips) {
                let executedProcessor = new ExecutedProcessor(processor.Name, false);
                executedProcessor.Success = common.fullRouter(group, route, locationZip, true);
                route.ExecutedProcessors.push(executedProcessor)
                if (executedProcessor.Success == true) break;
            }
        }
    for (let route of group.Routes) {
            if (route.RouteStatus == 100 || route.RouteStatus == -1) return false;
        }
   }
    
    return true;
}
}


module.exports = fullInventoryRouter;
