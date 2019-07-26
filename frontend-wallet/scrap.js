


// const ltcnet = {
//   messagePrefix: '\x19Litecoin Signed Message:\n',
//   bip32: { 
//     public: 0x043587cf,
//     private: 0x04358394
//   },
//   pubKeyHash: 0x6f,
//   scriptHash: 0xc4, //  for segwit (start with 2)
//   wif: 0xef
// }
// use it like this:

// var key = bitcoin.HDNode.fromSeedHex(seed, ltcnet)



// console.log(decryptKey(encriptKey(wifKey, 'password123'), 'password13'));


// console.log(encryptedKey)






// => '5KN7MzqK5wt2TP1fQCYyHBtDrXdJuXbUzm4A9rKAteGu3Qi5CVR'

// => '6PRVWUbkzzsbcVac2qwfssoU

// var privateKey = new litecore.PrivateKey('L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy');
// var utxo = {
//   "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
//   "outputIndex" : 0,
//   "address" : address,
//   "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
//   "satoshis" : 50000
// };

// var transaction = new litecore.Transaction()

    // .from(utxo)
    // .addData('litecore rocks') // Add OP_RETURN data
    // .sign(privateKey);

/**
 * Generate key pair
 *
 * @return {{private: string, public: string}}
 */
// function generateAddressKeyPair () {
//   // Generate private key
//   let privKey
//   do {
//     privKey = randomBytes(32)
//   } while (! secp256k1.privateKeyVerify(privKey))
//   // Generate public key
//   const pubKey = secp256k1.publicKeyCreate(privKey)

//   return {
//     private: privKey.toString('hex'),
//     // Base58 format for public key, public key plays address role
//     public: bs58.encode(pubKey),
//   }
// }





// const path = "m/0'/0/0"
// const mnemonic = 'word word word word word word word word word word word word'
// const seed = bip39.mnemonicToSeed(mnemonic)
// const root = bip32.fromSeed(seed)

// const child1 = root.derivePath("m/0'/0")
// const child2 = root.derivePath("m/0'/1")

// const child1Address = bitcoin.payments.p2pkh({ pubkey: child1.publicKey }).address
// const child2Address = bitcoin.payments.p2pkh({ pubkey: child2.publicKey }).address


/**
 * Sign hex hash
 *
 * @param {string} privateKey
 * @param {string} hash
 * @return {string}
 */
function signHash (privateKey, hash) {
    return secp256k1.sign(Buffer.from(hash, 'hex'), Buffer.from(privateKey, 'hex')).signature.toString('base64')
  }
  
  /**
   * Verify hex hash signature
   *
   * @param {string} address
   * @param {string} signature
   * @param {string} hash
   * @return {bool}
   */
  function verifySignature (address, signature, hash) {
    return secp256k1.verify(Buffer.from(hash, 'hex'), Buffer.from(signature, 'base64'), bs58.decode(address))
  }
  
  // module.exports = {generateAddressKeyPair, signHash, verifySignature}
  
  // const path = "m/0'/0/0"
  // const mnemonic = 'word word word word word word word word word word word word'
  // const seed = bip39.mnemonicToSeed(mnemonic)
  // const root = bip32.fromSeed(seed)
  
  // const child1 = root.derivePath("m/0'/0")
  // const child2 = root.derivePath("m/0'/1")
  
  // const child1Address = bitcoin.payments.p2pkh({ pubkey: child1.publicKey }).address
  // const child2Address = bitcoin.payments.p2pkh({ pubkey: child2.publicKey }).address
  