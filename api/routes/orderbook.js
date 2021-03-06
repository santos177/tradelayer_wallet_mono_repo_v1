const express = require("express");
const orderbookRouter = express.Router();

orderbookRouter.get("/", (req, res) => {
  const { omniClient } = req;
  let { contractID, propertyID } = req.query;
	contractID = contractID ?   +contractID : contractID
	// of note: the TL api needs the prop_id to be a Number, but doesn't care about the contractID
  propertyID = propertyID ? + propertyID : propertyID
  if (!propertyID && !contractID){
    console.warn('*** NO PARAM DATA *** ');
    return res.send({error: "error"})
  }
  if (propertyID !== undefined) {
    omniClient.cmd("tl_getorderbook", +propertyID, (err, result) => {
      if (err) console.warn(err);
      res.send(result);
    });
  } else {
    omniClient.cmd("tl_getcontract_orderbook", contractID, 1, function whenOK(
      err,
      buyResp,
      resHeaders
    ) {
      if (err === null) {
        buyObj = JSON.stringify(buyResp, null, "\t");
        omniClient.cmd(
          "tl_getcontract_orderbook",
          contractID,
          2,
          function whenOK(err2, sellResp, resHeaders) {
            if (err2 === null) {
              sellObj = JSON.stringify(sellResp, null, "\t");
              jsonTxt = "[" + sellObj + "," + buyObj + "]";
              var jsonObj = JSON.parse(jsonTxt);
              res.send(jsonObj);
            } else {
              console.log("something went wrong is orderbook sell ", err2);
              res.send(err2);
            }
          }
        );
      } else {
        console.log("something went wtong in orderbook buy ", err);
        res.send(err);
      }
    });
  }
});

orderbookRouter.get("/pair", (req, res) => {
  const { omniClient } = req;
  const {propsIdForSale, propsIdDesired} = req.query
  const resultObj = {}

  omniClient.cmd("tl_getorderbook", +propsIdForSale, +propsIdDesired , 
  (err, result) => {
    if (err) {
      console.log(`Error with tl_getorderbook \n ${err}`)
      res.send({error: err})
    } else {
      resultObj.buyBook = result
      omniClient.cmd("tl_getorderbook", +propsIdDesired, +propsIdForSale, 
      (err, result) => {
       if (err) {
         console.log(`Error with tl_getorderbook \n ${err}`)
         res.send({error: err})
       } else {
         resultObj.sellBook = result
         res.send(resultObj)
       }
     })
    }
  })


});

module.exports = orderbookRouter;
