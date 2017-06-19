var path = require("path");
var config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: 4000
};

config.workFlowDir = path.join(__dirname, "orderRouter");

config.taskJson = 'task.json';
