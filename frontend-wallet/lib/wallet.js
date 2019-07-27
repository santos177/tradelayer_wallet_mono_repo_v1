const {randomBytes} = require('crypto')
const secp256k1 = require('secp256k1')
const bs58 = require('bs58')
var bip38 = require('bip38')
// var bip32 = require('bip32-utils')
const bip32 = require('bip32')
const bitcoin = require('bitcoinjs-lib')

const litecore= require('litecore-lib')


var bip38 = require('bip38')
var bip39 = require('bip39')
var wif = require('wif')



const LITECOIN = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0
}

const generateKeyPair = ()=> {
  const keyPair = bitcoin.ECPair.makeRandom({ network: LITECOIN })
  const {address} = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: LITECOIN })
  const wifKey = keyPair.toWIF()
  return {
    wifKey,
    publicAddress: address
  }

}

const wifToPubKey = (wifKey) =>{
  const privateKey = new litecore.PrivateKey(wifKey);

  return  privateKey.toAddress().toString();
}

const encryptKey = (wifKey, password)=>{
  const decoded = wif.decode(wifKey)
  
  return bip38.encrypt(decoded.privateKey, decoded.compressed, password)
}
const decryptKey = (encryptedKey, password)=>{
  
  var decryptedKey = bip38.decrypt(encryptedKey, password,  (status)=> {
    console.log(status.percent) // will print the percent every time current increases by 1000
  })
  return wif.encode(0xb0, decryptedKey.privateKey, decryptedKey.compressed)
  
} 


const createTxn = (utxo, to, sats)=>{
  return new litecore.Transaction() 
  .from(utxo)   
  .to(to, sats)
}

const createOpReturnTxn = (utxo, opReturn, sats) =>{ 
  return new litecore.Transaction()  
  .from(utxo)
  .addData(opReturn)  
}


const signTxn = (txn, wifKey)=>{
  const privateKey = new litecore.PrivateKey(wifKey);
  return txn.sign(wifKey)

}

module.exports  =  {
  wifToPubKey, encryptKey, decryptKey, generateKeyPair
}
