class ErrorFlags
{
    constructor() {
        this.InvalidInputData = false;
        this.NoLocationZipFound = false;
        this.NoPrimaryLocation = false;
        this.SkuNotSetYet = false;
        this.LocationInDisaster = false;
    }

    addFlags(flags) {
        if (flags.InvalidInputData == true) this.InvalidInputData = true;
        if (flags.NoLocationZipFound == true) this.NoLocationZipFound = true;
        if (flags.NoPrimaryLocation == true) this.NoPrimaryLocation = true;
        if (flags.SkuNotSetYet == true) this.SkuNotSetYet = true;
        if (flags.LocationInDisaster == true) this.LocationInDisaster = true;
    }

}

module.exports = ErrorFlags
