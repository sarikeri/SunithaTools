var mongoClient = require('mongodb').MongoClient;
var config = require('./../orderConfig');

class mongoDataProvider {
    constructor() {
        this.connectString = config.mongoDBConnection.connectionString;
    }

    findOne(collectionName, query, projection) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                let collection = db.collection(collectionName);
                collection.findOne(query, projection)
                .then((result) => {
                    resolve(result);
                })
                .catch((getErr) => {
                    reject(getErr);
                })
                .then(() => {
                    db.close();
                });
            });
        });
    };

    findAndModify(collectionName, query, update, returnNew, upsert) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                let collection = db.collection(collectionName);
                collection.findAndModify(query, {}, update, { new: returnNew, upsert: upsert })
                .then((result) => {
                    resolve(result);
                })
                .catch((getErr) => {
                    reject(getErr);
                })
                .then(() => {
                    db.close();
                });
            });
        });
    };

    find(collectionName, query, projection) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                let collection = db.collection(collectionName);
                collection.find(query, projection).toArray(function (findErr, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                    db.close();
                });
            });
        });
    };

    insert(collectionName, data) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                let collection = db.collection(collectionName);
                collection.insert(data)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((insertErr) => {
                        reject(insertErr);
                    })
                    .then(() => {
                        db.close();
                    });
            });
        });
    };

    update(collectionName, query, update) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                let collection = db.collection(collectionName);
                collection.update(query, update)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((updateErr) => {
                        reject(updateErr);
                    })
                    .then(() => {
                        db.close();
                    });
            });
        });
    };
}

module.exports = mongoDataProvider;