var ResponseRoute = require('./responseRoute');

class ResponseGroup
{
    constructor(group)
    {
        this.GroupId = group.GroupId;
        this.ErrorFlags = group.ErrorFlags;
        this.ErrorMessage = group.ErrorMessage;
        this.Routes = [];

        for (let route of group.Routes)
        {
            let responseRoute = new ResponseRoute(route);
            this.Routes.push(responseRoute);
        }
    }
}

module.exports =  ResponseGroup
