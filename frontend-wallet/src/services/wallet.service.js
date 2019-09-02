import axios from "axios";
import {axiosInstance} from '../api/api'
const network = process.env.NODE_ENV === "development" ? "ltctest" : "ltc";
const {Unit} = require('litecore-lib')
window.Unit = Unit
const getUTXOs2 = (address, next) => {
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



const getUTXOs = (address, next)=>{
  axios.get(`https://api.bitaps.com/ltc/testnet/v1/blockchain/address/transactions/${address}`).then( async (res)=>{
    const txnData = res.data.data.list.map((txnObj)=> {
      return {
        txid: txnObj.txId,
        outsCount: txnObj.outsCount
      }
    }) 
    
    axiosInstance.post("/txn/utxos", {txnData, address}).then((data)=>{
      
      const utxoDataFormatted = data.data.map((utxo)=> {
        return {
          txid: utxo.txid,
          outputIndex: utxo.outputIndex,
          script: utxo.scriptPubKey.hex,
          satoshis: btcToSats(utxo.value),          
        }
      })
      console.warn(utxoDataFormatted);
      next(utxoDataFormatted)
      
    }).catch((err)=>{
      console.warn(err);
    })
  }).catch((err)=>{
    const {response} = err
    if(response.data.details === 404 && response.data.message === "address not found"){
      next([])
    } else {
      console.warn(err);
      
    }
    
  })
}

const mapToTxnFormat = (txn)=>{
  return {
    txid: txn.txid,
    outputIndex: txn.output_no,
    script: txn.script_hex,
    satoshis: btcToSats(txn.value),
    // or amount
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
const txnTypeEnum = {
  LTC_SEND: 0,
  BUY_CONTRACT: 1,
  SELL_CONTRACT: 2,
  ISSUE_CURRENCY: 3,
  REDEEM_CURRENCY: 4,
  PROPOSE_CHANNEL: 5
}


export const walletService = {
  getUTXOs, sendRawTxn, txnTypeEnum
};
