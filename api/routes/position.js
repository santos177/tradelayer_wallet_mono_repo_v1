var { dbconnect } = require("../dbconnect");
const config = require("../config");
const express = require("express");
const positionRouter = express.Router();

positionRouter.post("/postFullPositions", (req, res) => {
  const {omniClient} = req
  
  var account = req.body.account;
  var contractID = req.body.contractID.toString();
  var address = req.body.account;
  address = address.toString();
  omniClient.cmd(
    "tl_getfullposition",
    address,
    contractID,
    (err, fullPosition, resHeaders) => {
      if (err === null) {
        const fullPositions = JSON.stringify(fullPosition);
        res.send(fullPositions);
      } 
      else {
        console.warn("*** error in get fullPositions *** ");
        console.warn(err.toString());
        res.send(err);
      }
    }
  );
});

positionRouter.get('/getVolume', (req, res)=>{
  const {contractID, blocks} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getvolume', contractID, blocks, (err, volume )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(volume)

    }
  })
})


positionRouter.get('/getQuotes', (req, res)=>{
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

positionRouter.get('/getInsurance', (req, res)=>{
  const {contractID} = req.query;
  const {omniClient} = req; 
  omniClient.cmd('tl_getinsurance', contractID, (err, insurance )=>{
    if(err){
      res.send(err.toString())
    } else {
      res.send(insurance)
    }
  })
})

module.exports = positionRouter
