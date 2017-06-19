var RequestGroup = require('./requestGroup');
var RequestFlags = require('./requestFlags');

class Request
{
    constructor(reqBody)
    {
        this.Timestamp = reqBody.Timestamp;
        this.Id = reqBody.Id;
        this.IdType = reqBody.IdType;
        this.ReferenceId = reqBody.ReferenceId;
        this.OrderPlacedDate = reqBody.OrderPlacedDate;
        this.Flags = new RequestFlags(reqBody.Flags);
        this.Total = reqBody.Total;
        this.Groups = [];

        for (let group of reqBody.Groups)
        {
            let requestGroup = new RequestGroup(group);
            this.Groups.push(requestGroup);
        }
    }
}

module.exports = Request
