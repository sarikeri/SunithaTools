var resourceLogger = require('./logger').logger;
var constants = require('./constants.js');
var _this;
var tasks = {};
tasks.task1 = require('./shipHandler');
tasks.task2 = require('./backorderHandler');
tasks.task3 = require('./addWorkflow');

class master {
    constructor(ctx, metadata) {
        this.context = ctx;
        this.metadata = metadata;
        _this = this;
    }

    execute() {
        return new Promise((resolve, reject) => {
            let context = _this.context;
            let metadata = _this.metadata;
            let tasksObjects = [];
            Object.keys(tasks).forEach(function (key) {
                var obj = tasks[key];
                tasksObjects.push(new obj(context, metadata));
            });

            _this.executeTasks(tasksObjects).then((result) => {
                resolve(result);
            })

        });
    }

    executeTasks(tasks) {
        //sequential execution of promises, only last resolve is sent back to client
        return tasks.reduce((promise, task) => {
            return promise
                .then((result) => {
                    if (result != null && result != undefined) {
                        if (result.result != constants.results.Success) {
                            return result;
                        }
                        else {
                            return task.execute();
                        }
                    }
                    else {
                        return task.execute();
                    }
                })
                .catch((err) => {
                    let message = `Cancel.master.execute(): reject ${JSON.stringify(err)}`;
                    resourceLogger.error(message);
                    var response = {};
                    response.result = constants.results.Failed;
                    response.errorMessage = message;
                    resolve(response);

                });
        }, Promise.resolve());
    }
}

module.exports = master;