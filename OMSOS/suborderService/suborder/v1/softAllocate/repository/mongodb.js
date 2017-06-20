var Promise = require('bluebird');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var config = require('../config');

class mongoDataAccess {
  constructor() {}
}

var option = {
  'poolSize': 5,
  'connectTimeoutMS': 500,
  'autoReconnect': true
};

function MongoPool() {}

var getInstance = function (connection) {
  if (!pool) {
    initPool(connection)
  } else {
    if (connection && typeof (connection) == 'function')
      connection(pool);
  }
}

MongoPool.initPool = initPool;

var initPool = function (connection) {
  return new Promise((resolve, reject) => {
    mongoClient.connect(config.databaseConnection.url, option, function (err, db) {
      if (err) throw err;

      pool = db;
      if (cb && typeof (connection) == 'function')
        connection(pool);
    });

    return MongoPool;
  });
}
MongoPool.getInstance = getInstance;

var pool;

module.exports = {
  mongoDataAccess,
  initPool,
  getInstance
}