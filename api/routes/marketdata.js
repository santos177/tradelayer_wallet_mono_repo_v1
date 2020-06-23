var { dbconnect } = require('../dbconnect')
const config = require('../config')
var path= config.TLPATH
var datadir = config.TLDATADIR
var exec = require('child_process').exec;
const express = require('express')
const marketdataRouter = express.Router()

//deprecated until associated RPC is implemented, also this should go under its own route with other trade history data.
/*marketDataRouter.get('/getContractVolume', (req, res)=>{
  const {contractID, startblock, endblock} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getcontractvolume', contractID, startblock, endblock, (err, volume )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(volume)

    }
  })
})*/

marketDataRouter.get('/getSpotTokenVolume', (req, res)=>{
  const {id1, id2, startblock, endblock} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getmdexvolume', id1, id2, startblock, endblock, (err, volume )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(volume)

    }
  })
  
marketDataRouter.get('/getTotalLTCVolume', (req, res)=>{
  const {id, startblock, endblock} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getdexvolume', id1, startblock, endblock, (err, volume )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(volume)

    }
  })
}

//this isn't actually an RPC and we need to create a layer of abstraction
/*marketdataRouter.get('/getQuotes', (req, res)=>{
  const {contractID, trustRating} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getquotes', contractID, trustRating, (err, quotes )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(quotes)
    }
  })
})
*/

marketdataRouter.get('/getNativeInsuranceFund', (req, res)=>{
  const {contractID} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getcache', contractID, (err, insurance )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})

marketdataRouter.get('/getOracleInsuranceFund', (req, res)=>{
  const {contractID} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getoraclecache', contractID, (err, insurance )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})

marketdataRouter.get('/getKYCRegistarList', (req, res)=>{
  const {contractID} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_listkyc', (err, data )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})

marketdataRouter.get('/getActivations', (req, res)=>{
  const {contractID} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getactivations', (err, data )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})
  
marketdataRouter.get('/getCurrencyTotal', (req, res)=>{
  const {propertyid} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getcurrencytotal', propertyid, (err, data )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})
                
marketdataRouter.get('/getALLPrice', (req, res)=>{
  const {omniClient} = req; 
  omniClient.cmd('tl_getallprice', (err, data )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})

marketdataRouter.get('/getContractPrice', (req, res)=>{
  const {contractid} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getmarketprice', contractid, (err, data )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})

  
