/**
 * WIP, mostly scraps
 */

var litecoin = require('litecoin');

const {Address, Balance, Property} = require('../models/index.js')


var omniClient = require('../ltc_client')
var tl = require('../TradeLayerRPCAPI.js')

/*omniClient.cmd("listreceivedbyaddress", 0, true, async function(
  err,
  addresses,
  resHeaders
) {
  addresses.forEach( async (obj)=>{
    const {address, amount} = obj;
    const newAddress = await Address.create({
      address,
      balances:[ {
       amount,
       propertyId:  0       
      }],
    }, {
      include: [Balance]
    })
    loadTradeLayerBalances(0)
  })
});*/

var blockHeight = 0

omniClient.cmd("getalltxonblock",function(err,data,resHeaders){
    blockHeight=data
})

loadTradeLayerBalances = function(index){
    tl.getallbalancesforaddress(globalAddresses[index],function(data){
        //here the data has to go into Goldman's model by calling the .create() function of one of the
        //sqluelized data modules, ideally using async using the above nomenclature and not this callback 
        index+=1
        if(index>=globalAddresses.length-1){return indexTradeLayerTxByBlock(firstTLBlock)}
        loadTradeLayerBalances(index)
    })
}

var blocks = []
var firstTLBlock = 450000

function async loopBlocks(startBlock,endBlock){
    var blocks = {}
    for(var i = startBlock; i<endBlock);i++{
        var block = await getBlock(i)
        blocks.push(block)
    }
    console.log(blocks)
    return blocks
}

function getBlock(height){
  tl.getalltxonblock(height,function(data){
      return data
  })
}

function async syncronize(){
    var blocks = await loopBlocks(firstTLBlock,blockHeight)
    blocks.forEach( async (obj)=>{
    const {address, amount, type, propertyId, txn} = obj;
    const newAddress = await Address.create({
      address,
      txns:[txn],
      balances:[ {
       amount,
       propertyId: propertyID       
      }],
    }, {
      include: [Balance]
    })
}

syncronize()
