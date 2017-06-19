let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let wfManagerSchema = new Schema({
    name: { type: String, required: true, trim: true},
    version: { type: String, required: true, trim: true },
    resource: String,     //TODO: takeaway
    tags: {type: Array, default: []}, 
    metadata:   {type: Object, required: true},
    status: { type: String, enum: ['New','Success','Failed', 'Processing', 'Retry', 'PutAway'], default: "New"},
    error: {type: Array, default: []},
    createDate: {type: Date, default:  Date.now},
    updateDate: {type: Date, default:  Date.now},
    nextProcessDate: {type: Date, default: Date.now},
    retryCount: {type: Number, default: 0},
    logHistory: {type: Array, default: []},
    instance: {type: String, default: null},
    context:  {type: Object, default: {}}
},
    { collection: 'wfOrchestration' })

module.exports = mongoose.model('workflow', wfManagerSchema)