import axios from "axios";
import {axiosInstance} from '../api/api'
const network = process.env.NODE_ENV === "development" ? "ltctest" : "ltc";
const {Unit} = require('litecore-lib')
window.Unit = Unit
const getUTXOs = (address, next) => {
  axios
    .get(`https://chain.so/api/v2/get_tx_unspent/${network}/${address}`)
    .then( ({data}) => {
      if (data.status === "success") {
        const dataToSend = data.data.txs.map( (txn)=> mapToTxnFormat(txn))
        console.warn('UTXOs',dataToSend);
        
        next(dataToSend) ;
      }
    });
};

const mapToTxnFormat = (txn)=>{
  return {
    txid: txn.txid,
    outputIndex: txn.output_no,
    script: txn.script_hex,
    satoshis: btcToSats(txn.value),
    confirmations: txn.confirmations,
    time: txn.time
  }
}

const sendRawTxn = (rawTxn)=> {
  return axiosInstance.post('/txn', {rawTxn})
}

const btcToSats = (value)=>{
  if (typeof value === 'string'){
    value = Number(value)
  } 

  return Unit.fromBTC (value).toSatoshis() 
}

export const walletService = {
  getUTXOs, sendRawTxn
};
