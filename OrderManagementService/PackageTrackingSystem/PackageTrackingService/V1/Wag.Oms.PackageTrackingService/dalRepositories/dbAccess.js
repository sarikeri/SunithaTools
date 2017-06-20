var _this;
var oracledb = require('oracledb');
var config = require('../config.js'),
    logger = logger = require('../utils/logger.js');

class dbAccess {
    constructor() {
        _this = this;
        oracledb.fetchAsString = [oracledb.CLOB];
     }

    //retrive data method using a connection retrieved from pool in pool cache.
    getData(sql, paramsArr = []) {
        return new Promise(function (resolve, reject) {
            _this.createConnection()
                .then(function (connection) {
                    connection.execute(sql, paramsArr, { outFormat: oracledb.OBJECT }, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        _this.releaseConnection(connection);
                        resolve(result);
                    })
                }).catch(function (err) {
                    reject(err);
                });
        });
    }

    //insert/update data method using a connection retrieved from pool in pool cache.
    addUpdateData(sql, paramsArr = []) {
        return new Promise(function (resolve, reject) {
            _this.createConnection()
                .then(function (connection) {
                    connection.execute(sql, paramsArr, { autoCommit: true }, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        _this.releaseConnection(connection);
                        resolve(result);
                    })
                }).catch(function (err) {
                    reject(err);
                });
        });
    }

    //transaction commit method using a connection retrieved from pool in pool cache.
    commitTransaction(connection) {
        return new Promise(function (resolve, reject) {
            connection.commit((commitErr) => {
                _this.releaseConnection(connection);
                if (commitErr) {
                    reject(commitErr);
                } else {
                    resolve('success');
                }
            });
        });
    }

    //create a pool based on configuration parameters
    createPool() {
        return new Promise((resolve, reject) => {
            oracledb.createPool({
                user: config.databaseConnection.UserId,
                password: config.databaseConnection.Password,
                connectString: config.databaseConnection.TNSAlias,
                poolAlias: config.databaseConnection.connectionPoolAlias,
                poolMin: config.databaseConnection.connectionPoolMin,
                poolMax: config.databaseConnection.connectionPoolMax,
                poolIncrement: config.databaseConnection.PoolIncrement,
                poolTimeout: config.databaseConnection.connectionPoolTimeout
            }, (err, pool) => {
                if (err) {
                    if (err.message.indexOf('NJS-046') >= 0) {
                        resolve(oracledb.getPool(config.databaseConnection.connectionPoolAlias));
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve(pool);
                }
            })
        })
    }

    //retrieve a connection from pools, if necessary, create a pool. This is an entry point of create/retrieve 
    createConnection() {
        return new Promise((resolve, reject) => {
            _this.getPool(config.databaseConnection.connectionPoolAlias).
                then(pool => {
                    _this.getConnection(pool).
                        then(conn => {
                            resolve(conn);
                        }).catch(ex => {
                            reject(ex);
                        })
                }).
                catch(e => {
                    reject(e);
                })
        })
    }

    //retrieve a pool from promisify method, if necessary, create a pool. This is an entry point of create/retrieve
    getPool(poolAlias) {
        return new Promise((resolve, reject) => {
            _this.getPoolPromisified(poolAlias).
                then(pool => {
                    resolve(pool);
                }).
                catch(e => {
                    if (e.message.indexOf('NJS-047') >= 0) {
                        _this.createPool().
                            then(pool => {
                                resolve(pool)
                            }).catch(ex => {
                                reject(ex);
                            })
                    }
                })
        })
    }

    //promisify oracledb npm package build-in getPool method
    getPoolPromisified(poolAlias) {
        return new Promise((resolve, reject) => {
            try {
                let pool = oracledb.getPool(poolAlias);
                resolve(pool);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    //get a connection method using retrieved pool
    getConnection(pool) {
        return new Promise((resolve, reject) => {
            pool.getConnection((e, conn) => {
                if (e) {
                    reject(e);
                }
                else {
                    resolve(conn);
                }
            })
        })
    }

    releaseConnection(connection) {
        connection.release(function (err) {
            if (err) {
                logger.error(JSON.stringify(err));
            };
        });
    }
}

module.exports = dbAccess;
