var LocationZip = require('../../common/entities/locationZip');
var Location = require('../../common/entities/location');

// get location zip list
exports.get = function (zipCode, flags) 
{
    let locationZips = [];
    if (flags < 1) return locationZips;
    
    let location = new Location(30, 1);
    let locationZip = new LocationZip(location, 0, 0, false, 'US', zipCode);
    locationZips.push(locationZip);
    
    if (flags > 1) {
        location = new Location(10, 1);
        let locationZip = new LocationZip(location, 0, 1, false, 'US', zipCode);
        locationZips.push(locationZip);
    }

    if (flags > 2) {
        location = new Location(17, 1);
        let locationZip = new LocationZip(location, 0, 2, false, 'US', zipCode);
        locationZips.push(locationZip);
    }
    return locationZips;
}
