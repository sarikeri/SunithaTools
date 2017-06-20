var config = require('../config.js');

module.exports = {
    readFromFile: function (value) {
        var options = [0, 2];
        if (options.indexOf(config.document.source) != -1) {
            return true;
        }
        else {
            return false;
        }
    },

    shouldWriteToFile: function (value) {
        var options = [0, 2];
        if (options.indexOf(config.document.source) != -1) {
            return true;
        }
        else {
            return false;
        }
    },
    shouldWriteToES: function (value) {
        var options = [1, 2];
        if (options.indexOf(config.document.source) != -1) {
            return true;
        }
        else {
            return false;
        }
    },
    get5DigitZipCode: function (zipcode) {
        if (zipcode) {
            return zipcode.substring(0, 5);
        }
        else {
            return zipcode;
        }
    },
    isJson: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
};