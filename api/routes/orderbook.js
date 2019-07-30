var { dbconnect } = require("../dbconnect");
const config = require("../config");
var path = config.TLPATH;
var datadir = config.TLDATADIR;
const express = require("express");
const orderbookRouter = express.Router();

// add property option as well
orderbookRouter.get("/", (req, res) => {
  const { omniClient } = req;
  let { contractID } = req.query;
  omniClient.cmd("tl_getcontract_orderbook", contractID, 1, function whenOK(
    err,
    buyResp,
    resHeaders
  ) {
    if (err === null) {
      buyObj = JSON.stringify(buyResp, null, "\t");
      omniClient.cmd("tl_getcontract_orderbook", contractID, 2, function whenOK(
        err2,
        sellResp,
        resHeaders
      ) {
        if (err2 === null) {
          sellObj = JSON.stringify(sellResp, null, "\t");
          jsonTxt = "[" + sellObj + "," + buyObj + "]";
          var jsonObj = JSON.parse(jsonTxt);
          res.send(jsonObj);
        } else {
          console.log("something went wrong is orderbook sell ", err2);
          res.send(err2);
        }
      });
    } else {
      console.log("something went wtong in orderbook buy ", err);
      res.send(err);
    }
  });
});

module.exports = orderbookRouter;
