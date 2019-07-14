var { dbconnect } = require('../dbconnect')
const config = require('../config')
var path= config.TLPATH
var datadir = config.TLDATADIR

const orderbookApi = ({omniClient, ...app}) => {
  app.post('/api/getOrderBook', function(req, res){
  	  var contractID = req.body.contractID;
      contractID = contractID.toString()
      // console.log(' this is the contract ID ', contractID)
  	  var buyCommand = path+"/litecoin-cli -datadir="+ datadir +" tl_getcontract_orderbook \""+ contractID +"\" 1"
  	  var sellCommand = path+"/litecoin-cli -datadir="+ datadir +" tl_getcontract_orderbook \""+ contractID +"\" 2"
  	  var sellObj = "";
  	  var buyObj = "";

        omniClient.cmd('tl_getcontract_orderbook', contractID, 1, function whenOK(err, buyResp, resHeaders){
  	  	// exec(buyCommand, function (error, stdout, stderr) {
  			if (err === null) {

  				buyObj = JSON.stringify(buyResp, null, "\t");
          omniClient.cmd('tl_getcontract_orderbook', contractID, 2, function whenOK(err2, sellResp, resHeaders) {
  				// exec(sellCommand, function (error2, stdout2, stderr2) {
  					if (err2 === null) {
  						//res.header("Content-Type", "application/json");
  						sellObj = JSON.stringify(sellResp, null, "\t");
  						jsonTxt = "["+ sellObj +","+ buyObj +"]";
  						var jsonObj = JSON.parse(jsonTxt);
  					  // console.log(jsonObj);
  						////console.log(jsonObj);
  						res.send(jsonObj);
  					} else {
              console.log('something went wrong is orderbook sell ', err2)
              res.send(err2)
            }
  				});
  			} else {
          console.log('something went wtong in orderbook buy ', err)
          res.send(err)
        }
  		});
  });
  return app
}

module.exports = orderbookApi
