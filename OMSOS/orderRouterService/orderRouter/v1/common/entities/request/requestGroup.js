var RequestLineitem = require('./requestLineitem');

class RequestGroup
{
    constructor(reqGroup)
    {
        this.GroupId = reqGroup.GroupId;
        this.SiteId = reqGroup.SiteId;
        this.Location = reqGroup.Location;
        this.ShippingMethodId = reqGroup.ShippingMethodId;
        this.CountryCode = reqGroup.CountryCode;
        this.State = reqGroup.State;
        this.ZipCode = reqGroup.ZipCode;
        this.Lineitems = [];

        for (let line of reqGroup.Lineitems)
        {
            let requestLineitem = new RequestLineitem(line);
            this.Lineitems.push(requestLineitem);
        }
    }
}

module.exports =  RequestGroup
