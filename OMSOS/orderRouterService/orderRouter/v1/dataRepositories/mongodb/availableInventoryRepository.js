var Inventory = require('../../common/entities/inventory');
var Location = require('../../common/entities/location');

// get available inventory
exports.get = function (products, availableQty) 
{
    let inventories = [];
    if (availableQty < 0) return inventories;
    location = new Location(30, 1);
    for (let product of products)
    {
        let inventory = new Inventory(product.ProductId, location, availableQty);
        inventories.push(inventory);
    }
    return inventories;
}
