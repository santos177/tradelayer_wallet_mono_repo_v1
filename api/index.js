const config = require('./config')
const helpers = require('./helpers')
const { base64encode, base64decode } = require('nodejs-base64')

var omniClient = require('./ltc_client.js')

console.log('this is the litecoin client ', omniClient)
omniClient.getNetworkHashPs(function(err, hashps) {
	if (err) console.error(err);
	console.log('Network Hash Rate: ' + hashps);
  });
//connect to express
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var cors = require("cors")
var bodyParser = require('body-parser');
var asynco = require('async');
var dns = require("dns");
var exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var WebSocketServer = require('ws').Server;
var dgram = require('dgram');
var udpserver= dgram.createSocket('udp4');
var fs = require('fs')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path= config.TLPATH
var datadir = config.TLDATADIR
var morgan = require('morgan')
// var account_creation_difficulty = '0400'
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
// var store_dir = datadir + '/sessions/'
const handleIoConnection = require('./sockets/index.js')
console.warn(handleIoConnection);

app.use(cors())
//SOCKET IO
io.on('connection', handleIoConnection)

// udpserver.on('message', (msg, rinfo) => {

// 	//console.log("MSG :"+ msg)

// 	 var msgStr = msg.toString().split("<<<")
// 	 var msgArr = msgStr[0].split("-")
// 	 console.log("MSG :"+ msgArr[5])

// 	  wsCol.forEach(function(socket) {

// 		socket.emit('messages', msg.toString());

// 	  });
// })

//UDP server
udpserver.on('error', (err) => {
	  //console.log(`server error:\n${err.stack}`);
	  udpserver.close();
});

udpserver.on('listening', () => {
	  const address = udpserver.address();
	  //console.log(`server listening ${address.address}:${address.port}`);
});
udpserver.bind(666);

const configureRoutes = require('./routes');

// configure app to use bodyParser()
// this will let us get the data from a POSTx

app.omniClient = omniClient

app.use('/', express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

config.LOGGER && app.use(morgan())
//****LAST PROP CODE
var lastBlock = 0
var firstTime = true;
// getInfo().then(function(value) {
//     lastBlock = Number((JSON.parse(value)).block)
// 	//createContractFirstTime()
// 	//createContract(4)
// 	console.log("lastBlock "+ lastBlock)
//   }, function(reason) {
//     console.log("ERROR :"+ reason)
// });

function getInfo(){

	 var command = path+'/litecoin-cli -datadir='+ datadir +' tl_getinfo'
	 return (new Promise((resolve, reject) => {

									exec(command, function (error2, stdout2, stderr2) {
											 //console.log("ERR "+ error2)
										     if (error2) return resolve(false);
											 resolve(stdout2);
									});
	  }));
}

// function createContract(blocks){
// 	    firstTime=false
// 	    console.log("Creando contrato "+ propertyId)
// 		var command = path+'/litecoin-cli -datadir='+ datadir +' tl_createcontract QQi279Fm1d8Fji3283C61XoFucAXdzeHvs 1 4 "ALL '+ String(propertyId) +'18" '+ blocks +' 1 3 1'
// 	  	console.log("Command "+ command)
// 		exec(command, function (error, stdout, stderr) {
// 			//console.log("ERR "+ error)
// 			if (error === null) {
// 				                                console.log("TRX "+ stdout)
// 								propertyId++;
// 								console.log("OK CONTRACT ")
// 								setLastProp()
// 					}
// 				})
// }

// function createContractFirstTime(){
//
// 	    console.log("CREANDO PRIMEROS CONTRATOS "+ propertyId)
// 		var command = path+'/litecoin-cli -datadir='+ datadir +' tl_createcontract QQi279Fm1d8Fji3283C61XoFucAXdzeHvs 1 4 "ALL '+ String(propertyId) +'18" 5 1 3 1'
//
// 		console.log("Command1 "+ command)
// 		exec(command, function (error, stdout, stderr) {
// 			//console.log("ERR1 "+ error)
// 			if (error === null) {
// 						console.log("TRX "+ stdout)
// 						propertyId++;
// 						var command2 = path+'/litecoin-cli -datadir='+ datadir +' tl_createcontract QQi279Fm1d8Fji3283C61XoFucAXdzeHvs 1 4 "ALL '+ String(propertyId) +'18" 10 1 3 1'
// 						console.log("Command2 "+ command2)
// 						exec(command2, function (error2, stdout2, stderr2) {
// 						//console.log("ERR2 "+ error2)
// 						if (error === null) {
// 									console.log("TRX "+ stdout2)
// 									propertyId++;
// 									console.log("OK FIRST CONTRACT ")
//
// 								}
// 							})
// 					}
// 				})
// }

//$SRC/litecoin-cli -datadir=$DATADIR tl_gettradehistory ${CONTRACT_ID}
var port = process.env.PORT || 76;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


app.use((req, res, next)  => {
	// give routes access to omniClient
	req.omniClient = omniClient;
	next()
} ) 
app.use('/api', router);
configureRoutes(app)

// START THE SERVER
// =============================================================================
//app.listen(port);
http.listen(port, function(){
  console.log('Magic happens on port ' + port);
});
