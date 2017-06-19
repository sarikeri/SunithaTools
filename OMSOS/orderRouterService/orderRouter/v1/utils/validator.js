//exporting a namespace
module.exports = {
    validateRequestData: function (context) 
    {

        if (context.IdType < 1 || context.IdType > 6) {
            return 'Request.IdType is supposed to be 1 (new order), 2 (Presell), 3 (BackOrder), 4 (HeldOrder), 5 (Cart), 6 (SearchList), but the input IdType is ' + context.IdType;
        }
        
        // at least one group
        if (context.Groups.length == 0) {
            return 'No input group found.';
        }
        
        // group with at least one item in it
        for (let group of context.Groups) 
        {
            if (group.Routes[0].Lineitems.length == 0) return 'No line item found in group ' + group.GroupId;
        }
        return '';
    },

    // one group with one line item validation
    validateMvpRequestData: function (context) {
        if (context.Groups.length > 1)
            return 'More than one group found.';
        
        if (context.Groups[0].Routes[0].Lineitems.length > 1)
            return 'More than one items found in Group 1.';        

        return '';
    }
} 
