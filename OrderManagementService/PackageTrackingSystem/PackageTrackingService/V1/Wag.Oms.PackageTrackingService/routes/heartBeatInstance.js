var dbAccess = require('../dalRepositories/dbAccess.js');
var express = require('express');
var router = express.Router();
var moment = require('moment-timezone');
var logger = require('../utils/logger.js');
var dbClient = new dbAccess();

router.get('/', function (req, res) {

    var sql = "SELECT SYSDATE FROM DUAL";
    var heartBeatInstance = {};
    dbClient.getData(sql).then(function (result) {
        result.rows.forEach(function (row) {
            heartBeatInstance.ServiceStatus = "Ok";
            heartBeatInstance.ServerTime = moment(row.SYSDATE).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";;
            heartBeatInstance.IsDBReachable = true;
        });        
        
        res.send(heartBeatInstance);
    })
    .catch(function (err) {
        //res.status(500);        
        logger.error(err);
        heartBeatInstance.ServiceStatus = "NotOk";
        heartBeatInstance.IsDBReachable = false;
        heartBeatInstance.ErrorMessage = "Service could not connect to database";

        res.send(heartBeatInstance);
        });
    return;
});

module.exports = router;