var LocationZip = require('../../common/entities/locationZip');
var Location = require('../../common/entities/location');
var Mongorepository = require('./mongoRepository');

// get locations information
exports.get = function (locationsValue) 
{
    //let locationZips = [];
    let repository = new Mongorepository();
    let query = {
        countryCode: countryCodeValue,
        zipCode: zipCodeValue
    };
    let projection = {};

    let locationZips = Mongorepository.find('zipLocationMap', query, projection).sort({ locationPriority: -1 })

    return locationZips;
}
