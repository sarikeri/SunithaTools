var Route = require('./route');
var ErrorFlags = require('./errorFlags');

class GroupContext
{
    constructor(requestGroup)
    {
        this.GroupId = requestGroup.GroupId;
        this.SiteId = requestGroup.SiteId;
        this.Location = requestGroup.Location
        this.ShippingMethodId = requestGroup.ShippingMethodId;
        this.CountryCode = requestGroup.CountryCode;
        this.State = requestGroup.State;
        this.ZipCode = requestGroup.ZipCode;
        this.Routes = [];

        let route = new Route(1, "Base", requestGroup.Lineitems);
        this.Routes.push(route);

        this.LocationZips = [];
        this.Inventories = [];
        this.ErrorFlags = new ErrorFlags();
        this.ErrorMessage = '';
    }
}

module.exports = GroupContext

