
let cluster = require('cluster');
let log = require('./utils/logger').logger,
    config = require('./config');

if (!config.clusterOn) {
    console.log("Service is on debugMode.")
    log.verbose(`start service and service debug set ${config.isDebug}`);
    require("./app.js");
}
else {
    if (cluster.isMaster) {
        console.log("Service is on cluster mode.")
        log.verbose(`start service and service debug set ${config.isDebug}`);

        //check server core number
        let numCPUs = require('os').cpus().length;

        // Create a worker for each CPU
        for (var i = 0; i < numCPUs; i++) {
            //fork will call app.js once again with existing parameters but cluster.isMaster will be false 
            //thus else part will execute which contains server 
            cluster.fork();
        }

        //Events- online, exit, disconnect etc will be fired if worker fires any event
        cluster.on('online', function (worker) {
            let msg = `Master Cluster: Worker ${worker.process.pid} is online.`;
            console.log(msg);
            log.verbose(msg);
        });

        //Listen for dying workers
        cluster.on('exit', function (worker) {
            let msg = `Master claster: worker ${worker.process.pid} died.`; 
            console.log(msg);
            log.verbose(msg);
            console.log('starting a new worker.');
            log.verbose('starting a new worker.');
            cluster.fork();
        });
    }
    else { //workers
        let msg = `Cluster: service is called from worker ${cluster.worker.id}`;
        log.verbose(msg);
        console.log(msg);
        require('./app.js');  
    }
}