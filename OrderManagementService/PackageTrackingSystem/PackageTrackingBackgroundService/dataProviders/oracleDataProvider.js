var oracledb = require('oracledb');
var config = require('../config');
var logger = require('./../utils/logger');

class oracleDataProvider {
    constructor() {
        oracledb.maxRows = config.databaseMaxRows;
    }

    getData(query, params = {}) {
        return new Promise((resolve, reject) => {
            oracledb.getConnection(config.databaseConnection.connectionPoolAlias)
                .then((connection) => {
                    connection.execute(query, params, { outFormat: oracledb.OBJECT }, function (err, result) {
                        oracleDataProvider.releaseConnection(connection);
                        if (!err) {
                            resolve(result);
                        } else {
                            reject(`DBError retrieving data: ${err}`);
                        }
                    });
                })
                .catch((err) => {
                    logger.debug(`DBError: Unable to get connection for GET operation: ${err}`);
                    reject(`DBError: Unable to get connection for GET operation: ${err}`);
                });
        });
    };

    updateData(sql, params = {}) {
        return new Promise((resolve, reject) => {
            oracledb.getConnection(config.databaseConnection.connectionPoolAlias)
                .then((connection) => {
                    connection.execute(sql, params, function (err, result) {
                        if (err) {
                            oracleDataProvider.releaseConnection(connection);
                            reject(`DBError while updating: ${err}`);
                        } else {
                            connection.commit((commitErr) => {
                                oracleDataProvider.releaseConnection(connection);
                                if (commitErr) {
                                    reject(`DBError during commit: ${commitErr}`);
                                } else {
                                    resolve(result.rowsAffected);
                                }
                            });
                        }
                    });
                })
                .catch((err) => {
                    logger.debug(`DBError: Unable to get connection for UPDATE operation: ${err}`);
                    reject(`DBError: Unable to get connection for UPDATE operation: ${err}`);
                });
        });
    };

    // This method is made static to allow the callback methods to have a convenient way to release the connection.
    static releaseConnection(connection) {
        if (connection) {
            connection.release((err) => {
                if (err)
                    logger.debug(err);
            });
        }
    }
}

module.exports = oracleDataProvider;