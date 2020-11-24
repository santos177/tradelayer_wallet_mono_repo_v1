// var { dbconnect } = require('../dbconnect')
const config = require('../config')
var path= config.TLPATH
var datadir = config.TLDATADIR

const priceApi = ({omniClient, ...app}) => {
  app.post('/api/getALLPrice', function(req,res) {
    // console.log('contractid in recent trades', contractID)
    var command = path+"/litecoin-cli -datadir="+ datadir +" "+ "tl_getallprice"
    		exec(command, function (error, stdout, stderr) {
    			if (error === null) {
              // console.log('output of tl_gettradehistory on testnet', stdout)
    					res.send(JSON.stringify(stdout));

    			} else {
            console.log('error in gte ALL Price', error)
            res.send(error)
          }
    		})
  })

  return app
}

module.exports = priceApi
