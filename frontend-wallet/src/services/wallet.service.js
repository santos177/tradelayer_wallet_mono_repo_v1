import axios from "axios";
import {axiosInstance} from '../api/api'
const network = process.env.NODE_ENV === "development" ? "ltctest" : "ltc";

const getUTXOs = (address, next) => {
  axios
    .get(`https://chain.so/api/v2/get_tx_unspent/${network}/${address}`)
    .then( ({data}) => {
      if (data.status === "success") {
        next(data.data.txs.map( (txn)=> mapToTxnFormat(txn))) ;
      }
    });
};

const mapToTxnFormat = (txn)=>{
  return {
    txid: txn.txid,
    outputIndex: txn.output_no,
    script: txn.script_hex,
    satoshis: (+txn.value) * 100000000,
    confirmations: txn.confirmations,
    time: txn.time
  }
}

const sendRawTxn = (rawTxn)=> {
  return axiosInstance.post('/txn', {rawTxn})
}

export const walletService = {
  getUTXOs, sendRawTxn
};
