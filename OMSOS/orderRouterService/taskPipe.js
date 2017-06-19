class TaskPipe {
    constructor(metadata, context) {
        if (!context || context.length === 0) 
        {
            this.Context = {};
            this.Context.Errors = [];
        }
        else 
        {
            this.Context = context;
        }
        this.Metadata = metadata;
        this.tasks = new Map();
    }

    execute(taskList, filepath) 
    {
        //that is a normal variable so it is lexically scoped and can be used in inner functions
        var that = this;
        return new Promise(function (resolve, reject) {
            for (var task of taskList.tasks) {
                var fullTaskName = filepath + "\\" + task.fileName;
                // TODO: Try catch was added to display why task initialization failed. Refine this as required.
                try {
                    var Cls = require(fullTaskName);
                }
                catch (err) {
                    console.log(err.toString());
                }
                task.taskObj = new Cls(that.Context, that.Metadata, task.parameters);
                task.processed = false;
                that.tasks.set(task.fileName, task);
            }

            //kick off all the top level tasks i.e. taks with dependsOn[] empty
            that.tasks.forEach(task => {
                if (task.dependsOn.length == 0) {
                    task.processed = true;
                    task.promise = task.taskObj.execute();
                }
            });

            //Kick off the next level tasks recursively
            that.executeNextLevelTasks();

            var promises = [];
            that.tasks.forEach(task => {
                promises.push(task.promise);
            });

            //resolve only when all are completed
            Promise.all(promises).then(function (results) {
                // TODO: This is a hack. I don't understand why the results of all promises should be sent to the client!
                // In my opinion the client should only be interested in the overall result and not the results of each task
                resolve(results[0]);
            }).catch(function (err) {
                reject(err);
            });

        });

    }

    executeNextLevelTasks() {
        for (let [key, task] of this.tasks) {

            if (task.processed == true)
                continue;

            //Try to gather all parent's promises for the current task being evaluated for the launch
            var parentPromises = [];

            for (var parent of task.dependsOn) {
                var parentTask = this.tasks.get(parent);
                if (parentTask.promise != undefined)
                    parentPromises.push(parentTask.promise);
            }

            //if all parent promise objects available then wait on them
            if (parentPromises.length == task.dependsOn.length) {
                task.processed = true;
                Promise.all(parentPromises).then(values => {
                    task.promise = task.taskObj.execute();

                    //recursive call to setup next level of tasks
                    this.executeNextLevelTasks();

                }).catch(reason => {
                    // TODO add logging
                    console.log("in catch: " + reason);
                });
            }
        }
    }
}


module.exports = TaskPipe;

