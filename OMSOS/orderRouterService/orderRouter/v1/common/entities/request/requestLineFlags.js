class RequestLineFlags
{
    constructor(flags)
    {
        this.Hazmat = false;
        this.Presell = false;
        this.OutDropship = false;
        this.IsOOS = false;
    }
}

module.exports = RequestLineFlags
