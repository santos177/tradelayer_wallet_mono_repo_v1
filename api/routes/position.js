// var { dbconnect } = require("../dbconnect");
// const config = require("../config");
const express = require("express");
const positionRouter = express.Router();

positionRouter.get("/getFullPosition", (req, res) => {
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

module.exports = positionRouter
