class LocationZip
{
    constructor(location, locationFlags, locationPriority, inDisaster, countryCode, zipCode )
    {
        this.Location = location;
        this.LocationFlags = locationFlags;
        this.LocationPriority = locationPriority;
        this.InDisaster = inDisaster;
        this.CountryCode = countryCode;
        this.ZipCode = zipCode;
    }
}

module.exports = LocationZip;
