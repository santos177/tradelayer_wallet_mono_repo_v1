const {randomBytes} = require('crypto')
const secp256k1 = require('secp256k1')
const bs58 = require('bs58')
const bitcoin = require('bitcoinjs-lib')
const Cryptr = require('cryptr');

const litecore= require('litecore-lib')




// mainnet
// const LITECOIN = {
//   messagePrefix: '\x19Litecoin Signed Message:\n',
//   bip32: {
//     public: 0x019da462,
//     private: 0x019d9cfe
//   },
//   pubKeyHash: 0x30,
//   scriptHash: 0x32,
//   wif: 0xb0
// }

// testnet
const LITECOIN = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bip32: { 
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4, //  for segwit (start with 2)
  wif: 0xef
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

// bip38's encrypt/decrypt is incredibly slow, swapping for Cryptr for now:
const encryptKey = (wifKey, password)=>{
  // const decoded = wif.decode(wifKey)
  // return bip38.encrypt(decoded.privateKey, decoded.compressed, password)
  const cryptr = new Cryptr(password);

  return cryptr.encrypt(wifKey);
}
const decryptKey = (encryptedKey, password)=>{
  // var decryptedKey = bip38.decrypt(encryptedKey, password,  (status)=> {
  //   console.log(status.percent) // will print the percent every time current increases by 1000
  // })
  // return wif.encode(0xb0, decryptedKey.privateKey, decryptedKey.compressed)
  const cryptr = new Cryptr(password);
  const decrypted = cryptr.decrypt(encryptedKey);
  return decrypted.length == 52 ? decrypted : false; 

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
