class Inventory
{
    constructor(productId, location, availableQty)
    {
        this.ProductId = productId;
        this.Location = location;
        this.AvailableQty = availableQty;
        this.AssignedQty = 0;  // qty assigned before
        this.InDisaster = false;
    }
}

module.exports = Inventory

