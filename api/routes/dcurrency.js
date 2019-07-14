var { dbconnect } = require('../dbconnect')
const config = require('../config')
var path= config.TLPATH
var datadir = config.TLDATADIR
var exec = require('child_process').exec;

const dcurrencyApi = ({omniClient, ...app}) => {
  app.post('/api/createPeg', function(req, res){
  			var obj = {};
  			var qty = req.body.qty;
  			var address = req.body.address;
  			var name = req.body.name;
        var contractID = req.body.contractID;
        // TODO:
        // make the contractID a variable on the front end (not hardcorded in api)
  			var command = path+"/litecoin-cli -datadir="+ datadir +" tl_sendissuance_pegged "+ address +" 1 2 0 \""+ name +"\" 4 \""+contractID+"\" "+ qty;  //req.params.command;

        console.log('command in createPeg ', command )

  			exec(command, function (error, stdout, stderr) {
  				if (error === null) {
  					console.log("La TRX "+ stdout)
  					req.body.trxid = stdout;
  					res.send(req.body);
  				} else {
            console.log('something went wrong in createPeg', stderr)
            res.send(stderr)
          }
  			});
  });

  /* tl_send_pegged
              "1. fromaddress          (string, required) the address to send from\n"
              "2. toaddress            (string, required) the address of the receiver\n"
              "3. propertyid           (number, required) the identifier of the tokens to send\n"
              "4. amount               (string, required) the amount to send\n"
              "\nResult:\n"
              "\"hash\"                  (string) the hex-encoded transaction hash\n" */
  app.post('/api/sendPegged', function(req, res){
    	  var fromaddress = req.body.fromAddress;
        var toaddress = req.body.toAddress;
        var contractID = req.body.contractID;
        var amount = req.body.amount;
  			var obj = {};

  			var command = path+"/litecoin-cli -datadir="+ datadir +" tl_send_pegged "+ fromaddress +" " + toaddress + " \"" + contractID + "\" " +amount;

        console.log('command in sendPegged ', command )

  			exec(command, function (error, stdout, stderr) {
  				if (error === null) {
  					console.log("La TRX "+ stdout)
  					req.body.trxid = stdout;
  					res.send(req.body);
  				} else {
            console.log('something went wrong in sendPegged', stderr)
            res.send(stderr)
          }
  			});
  });

  /* redeemPegged
  tl_redemption_pegged
  "\nArguments:\n"
              "1. redeemaddress         (string, required) the address of owner \n"
              "2. propertyid           (number, required) the identifier of the tokens to redeem\n"
              "3. amount               (number, required) the amount of pegged currency for redemption"
              "4. contractid           (number, required) the identifier of the future contract involved\n"
              "\nResult:\n"
              "\"hash\"                  (string) the hex-encoded transaction hash\n" */

  app.post('/api/redeemPegged', function(req, res){
    	  var redeemaddress = req.body.redeemaddress;
        var name = req.body.name;
        var amount = req.body.amount;
        var contractID = req.body.contractID;
  			var obj = {};

  			var command = path+"/litecoin-cli -datadir="+ datadir +" tl_redemption_pegged "+ redeemaddress +" \"" + name + "\" " + amount+ " \"" +contractID +"\"";

        console.log('command in redeemPegged ', command )

  			exec(command, function (error, stdout, stderr) {
  				if (error === null) {
  					console.log("La TRX "+ stdout)
  					req.body.trxid = stdout;
  					res.send(req.body);
  				} else {
            console.log('something went wrong in redeemPegged', stderr)
            res.send(stderr)
          }
  			});
  });

  // 1) fromaddress (string, required) the address to send from\n"
  // 2) contractID (number, required) contract ID which is collaterilized in ALL
  app.post('/api/maxPegged', function(req, res){
    	  var fromaddress = req.body.fromAddress.toString();
        var contractID = req.body.contractID;
  			var obj = {};

  			var command = path+"/litecoin-cli -datadir="+ datadir +" tl_getmax_peggedcurrency " +" \""+ fromaddress +"\" \"" +contractID +"\"";

        console.log('command in maxPegged ', command )

  			exec(command, function (error, stdout, stderr) {
  				if (error === null) {
  					console.log("La response "+ stdout)
  					req.body.maxPegged = stdout;
  					res.send(req.body);
  				} else {
            console.log('something went wrong in maxPegged', stderr)
            res.send(stderr)
          }
  			});
  });
  return app
}

module.exports = dcurrencyApi
