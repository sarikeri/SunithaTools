var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let taskSchema = new Schema({
    fileName: { type: String, required: true },
    dependsOn: [String]
});

let workflowSchema = new Schema({
    _id: { type: Number, required: true, unique: true },
    serviceName: { type: String, required: true },
    version: { type: String, required: true },
    resource: String,
    creator: {type: String, default: 'service interface'},
    createdOn: {
        type: Date, default: Date.now
    },
    creator: String,
    isActive: { type: Boolean, default: true },
    tasks: [taskSchema]
},
    {collection: 'workflowTasks'})

module.exports = mongoose.model('workflow', workflowSchema)