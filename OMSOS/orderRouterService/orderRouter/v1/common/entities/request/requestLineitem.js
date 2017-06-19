var RequestLineFlags = require('./requestLineFlags');
var RequestLineOpsFlags = require('./requestLineOpsFlags');

class RequestLineitem
{
    constructor(reqLineitem)
    {
        this.LineitemId = reqLineitem.LineitemId;
        this.ReferenceId = reqLineitem.ReferenceId;
        this.Flags = reqLineitem.Flags;
        this.SiteId = reqLineitem.SiteId;
        this.OpsFlags = reqLineitem.OpsFlags;
        this.ProductId = reqLineitem.ProductId;
        this.ProductFlags = reqLineitem.ProductFlags;
        this.AvailableDate = reqLineitem.AvailableDate;
        this.OrderedQty = reqLineitem.OrderedQty;
        this.ReservedQty = reqLineitem.ReservedQty;
    }
}

module.exports =  RequestLineitem
