var litecoin = require('litecoin');

const {Address, Balance, Property, Txn, Type} = require('../models/index.js')


var omniClient = require('../ltc_client')
var tl = require('../TradeLayerRPCAPI.js')


var blockHeight = 0

omniClient.cmd("getalltxonblock",function(err,data,resHeaders){
    blockHeight=data
})

var loops = 0 

var log = []

function loop(cb){
  loops+=1
  var delay = 15000
  if(loops=1){delay = 1500}
  var lastHeight = blockHeight
  omniClient.cmd("getalltxonblock",function(err,data,resHeaders){
    blockHeight=data
    if(blockHeight>lastHeight&&loops>1){
      tl.getalltxonblock(blockHeight,function(data){
          var entry = processData(data)
          log.push(entry)
          loop(cb)
      }
    }else{
      setTimeout(function(){
        loop(cb)
      },delay)
    }
  })
}

function async processData(block){
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
    return newAddress
}
