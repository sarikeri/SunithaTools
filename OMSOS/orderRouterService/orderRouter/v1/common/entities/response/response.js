var ResponseGroup = require('./responseGroup');
var moment = require('moment');
var uuid = require('uuid');

class Response
{
    constructor(context)
    {
        this.Timestamp = new moment;
        this.Id = context.Id;
        this.IdType = context.IdType;
        this.ReferenceId = context.ReferenceId;
        this.OrderPlacedDate = context.OrderPlacedDate;
        this.ResultId = uuid.v4().replace(/-/g, '');
        this.ErrorFlags = context.ErrorFlags;
        this.ErrorMessage = context.ErrorMessage;
        this.ServiceCallDurationInMs = new moment().diff(context.StartTime, 'milliseconds');
        this.Groups = [];

        for (let group of context.Groups)
        {
            let responseGroup = new ResponseGroup(group);
            this.Groups.push(responseGroup);
        }
    }
}

module.exports = Response

