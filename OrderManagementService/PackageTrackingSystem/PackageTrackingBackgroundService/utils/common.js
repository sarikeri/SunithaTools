module.exports = {
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