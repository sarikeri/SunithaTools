var mongoClient = require('mongodb').MongoClient;
var config = require('./../config');

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
                var collection = db.collection(collectionName);
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

    find(collectionName, query, projection) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                var collection = db.collection(collectionName);
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
                var collection = db.collection(collectionName);
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

    insertMany(collectionName, datas) {
        return new Promise((resolve, reject) => {
            try {
                mongoClient.connect(this.connectString, function (err, db) {
                    if (err) {
                        reject(err);
                    }
                    var collection = db.collection(collectionName);
                    collection.insertMany(datas)
                        .then((result) => {
                            resolve(result);
                        })
                        .then(() => {
                            db.close();
                        });
                });
            } catch (insertErr) {
                reject(insertErr);
            };
        });
    };

    update(collectionName, query, update) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                var collection = db.collection(collectionName);
                collection.update(query, update, { upsert: true, multi: false })
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

    remove(collectionName, query) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                var collection = db.collection(collectionName);
                collection.remove(query, query)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((removeErr) => {
                        reject(removeErr);
                    })
                    .then(() => {
                        db.close();
                    });
            });
        });
    };
}

module.exports = mongoDataProvider;