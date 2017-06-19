var GroupContext = require('./groupContext');
var ErrorFlags = require('./errorFlags');
var moment = require('moment');

class Context
{
    // construct Context object from request object
    constructor(request)
    {
        this.Timestamp = request.Timestamp;
        this.Id = request.Id;
        this.IdType = request.IdType;
        this.ReferenceId = request.ReferenceId;
        this.OrderPlacedDate = request.OrderPlacedDate;
        this.Flags = request.Flags;
        this.Total = request.Total;
        this.Groups = [];

        for (let group of request.Groups)
        {
            let groupConext = new GroupContext(group);
            this.Groups.push(groupConext);
        }

        this.ErrorFlags = new ErrorFlags();
        this.ErrorMessage = '';

        this.StartTime = new moment();
    }
}


module.exports = Context

