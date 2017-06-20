var moment = require('moment');
var Ajv = require('ajv');

class validateSchema {
    constructor() {
    }

    validate(suborder, schema) {
        var ajv = new Ajv({ allErrors: true, jsonPointers: true, removeAdditional: true });
        require('ajv-errors')(ajv);
        var validate = ajv.compile(schema);
        validate(suborder);
        return JSON.stringify(validate.errors).replace(new RegExp(/[ { } "\[\]']/, 'g'), " ");
    }
}

module.exports = validateSchema;