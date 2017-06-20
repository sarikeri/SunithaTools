var path = require('path');
var constant = require('./constants'),
    config =require('../config');

module.exports = {

    mapWorkDirectory: function (service, version, resource) {
        //todo: validate input parameters?
        let shortPath = `\services\\${service}\\${version}\\${resource}\\`;      
        return `${config.rootpath}\\${shortPath}`;
    }
}

