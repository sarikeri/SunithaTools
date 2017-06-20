var mongoPool = require('./mongodb.js');
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var moment = require('moment');
var config = require('../config.js');
var mongoClient = require('mongodb').MongoClient;

class repository {

    constructor() {
        this.connectString = config.mongoDBConnection.connectionString;
    }

    Add(document) {
        return new Promise(function (resolve, reject) {
            mongoPool.getInstance(function (db) {
                db.collection('suborder').insertOne(document, function (err, records) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve('success');
                    }
                });
            });
        });
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
                collection.find(query).toArray(function (err, data) {
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

    update(collectionName, query, update) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.connectString, function (err, db) {
                if (err) {
                    reject(err);
                }
                var collection = db.collection(collectionName);
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


module.exports = repository;