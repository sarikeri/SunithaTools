var FedexClient,UspsClient,OnTracClient,LasershipClient; 

FedexClient = require('./fedex').FedexClient;
UspsClient = require('./usps').UspsClient;
OnTracClient = require('./ontrac').OnTracClient;
LasershipClient = require('./lasership').LasershipClient;

module.exports = {
    FedexClient: FedexClient,
    UspsClient: UspsClient,
    OnTracClient: OnTracClient,
    LasershipClient: LasershipClient
};
