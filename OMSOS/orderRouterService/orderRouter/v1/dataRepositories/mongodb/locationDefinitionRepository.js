var LocationDef = require('../../common/entities/locationDef');
var Mongorepository = require('./mongoRepository');

// get location definition list
exports.get = function (location, zipCodeValue) 
{
    let repository = new Mongorepository();
    let query = {};
    let projection = {};

    let locationDefs = Mongorepository.find('locationDefinition', query, projection)

    return locationDefs;
}
