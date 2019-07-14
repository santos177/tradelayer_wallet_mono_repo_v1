const uuidv4 = require('uuid/v4');
const uuid_validate = require('uuid-validate')
const testuuid = 'd6056254-2b5d-4a78-a8d0-ed5326035d04'
//const config = require('./config')
//onst helpers = require('./helpers')
var crypto = require('crypto')
const { Client } = require('pg')
//var { dbconnect } = require('./dbconnect')
const { base64encode, base64decode } = require('nodejs-base64')
const jwt  = require('jsonwebtoken');

var litecoin = require('litecoin');
var omniClient = new litecoin.Client({
  host: 'localhost',
  port: 9332,
  user: "pepejandro",
  pass: "pepecash",
  ssl: false/* true, */
});

console.log('this is the litecoin client ', omniClient)
//establish db connection
//var client = dbconnect
// console.log('export client', client)
//console.log('client.query', client.query())

var bcrypt = require('bcrypt-nodejs')

//connect to express
var express    = require('express');        // call express
var queue = require('express-queue');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var asynco = require('async');
// console.log("DATA "+ JSON.stringify(asynco))
var dns = require("dns");
var exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var WebSocketServer = require('ws').Server;
var dgram = require('dgram');
var udpserver = dgram.createSocket('udp4');
var fs = require('fs')
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var path= config.TLPATH
//var datadir = config.TLDATADIR
var account_creation_difficulty = '0400'
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

// console.log('path is , ', path)
// console.log('dbport is ', config.DBPORT)
// console.log('config is ', config)

//var store_dir = datadir + '/sessions/'

var wsCol = [];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Using queue middleware
app.use(queue({ activeLimit: 2, queuedLimit: -1 }));
// activeLimit - max request to process simultaneously
// queuedLimit - max requests in queue until reject (-1 means do not reject)
//
// May be also:
// app.get('/api', queue({ activeLimit: 2, queuedLimit: -1})

app.post('/api/bot', function(req, res){

    console.log("PARAM :"+req.body)

    var obj = {};
    var qty = req.body.qty;
    var price = req.body.price;
    var action = req.body.action;
    var contractID = req.body.contractID;
    var address = req.body.address;
    var command = "/root/BlockPo-to-Tradelayer/src/litecoin-cli -datadir=/root/.litecoin tl_tradecontract \""+ address +"\" \""+ contractID +"\" "+ qty +" "+ price +" "+ action;  //req.params.command;
    console.log("COMMAND "+ command)

    omniClient.cmd('tl_tradecontract', address.toString(), contractID.toString(), qty, price, action, function whenOK(err, trade, resHeaders){
        if(err === null) {
            console.log("La TRX "+ trade)
                                  // req.body.trxid = trade;
            res.send('ok');

        } else {
            console.log('something went wrong in the bot ', err)
            res.send(err)
        }
    });
});


//$SRC/litecoin-cli -datadir=$DATADIR tl_gettradehistory ${CONTRACT_ID}
var port = process.env.PORT || 76;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
//app.listen(port);
http.listen(port, function(){
  //console.log('Magic happens on port ' + port);
});
