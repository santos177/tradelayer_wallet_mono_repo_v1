var LOGIN_DIFFICULTY = '0400'
var CRYPT_LOOP_MAX = Math.pow(2, 32)
import sha256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
import forge from 'node-forge'
var aesjs = require('aes-js')
const walletCrypto = require('./wallet')
const pbkdf2 = require('pbkdf2')
const keypair = require('keypair')

// const forge = require('node-forge')
export const CryptUtil = {
  // Returns an int nonce for which the HASH( CONCAT( nonce, pow_challenge )) ends with LOGIN_DIFFICULTY
  ///generating nonce for wallet creation is bullshit...this function returns bullshit
  generateNonceForDifficulty: function(challengeString) {
    var nonce = 0
    var hashtest = CryptoJS.SHA256(challengeString + nonce)
    //console.log('hastest, ', hashtest.toString(CryptoJS.enc.Hex))
    while (++nonce < CRYPT_LOOP_MAX) {
      // var hashBits = sjcl.hash.sha256.hash(challengeString + nonce);
      // var hashString = sjcl.codec.hex.fromBits(hashBits);
      var hashBits = CryptoJS.SHA256(challengeString + nonce)
      var hashString = hashBits.toString(CryptoJS.enc.Hex)
      console.log('hash nonce ', hashString.indexOf(LOGIN_DIFFICULTY, hashString.length - LOGIN_DIFFICULTY.length))

      if (hashString.indexOf(LOGIN_DIFFICULTY, hashString.length - LOGIN_DIFFICULTY.length) !== -1)
        return nonce
    }
    return null;
  },
  // Returns a structure that includes a PEM-encoded public key for transmission to
  //    the server, and an RSAKey object
  //    (http://kjur.github.io/jsrsasign/api/symbols/RSAKey.html)
  //    representing the private key.
  generateAsymmetricPair: function() {
    var pair = keypair();
    // var keyObj = KEYUTIL.generateKeyPair('RSA', 1024);
    return {
      pubPem: pair.public,
      privKey: forge.pki.privateKeyFromPem(pair.private)
    }
  },
  // Returns a symmetric key which can be used to encrypt/decrypt wallets for storage on the server.
  generateSymmetricKey: function(password, hexSalt) {
    //var my_key = pbkdf2.pbkdf2Sync(password, hexSalt, 1, 32, 'sha256')
    var my_key = forge.pkcs5.pbkdf2(password, hexSalt, 2048, 16);
    console.log('my symmetric key', my_key)
    return my_key
  },
  // Returns a string that consists of the JSON representation of the given object,
  //  encrypted using the given key.
  encryptObject: function(o, key) {
    var inputBytes = forge.util.createBuffer(JSON.stringify(o));
    var encipher = forge.aes.createEncryptionCipher(key, 'CBC');
    console.log('key', key)
    encipher.start(key);
    encipher.update(inputBytes);
    encipher.finish();
    return encipher.output.toHex();
  },
  // Returns a JSON object, given the provided encrypted JSON string and key.
  decryptObject: function(walletString, key) {

    var walletBytes = forge.util.createBuffer(forge.util.hexToBytes(walletString))
    var decipher= forge.aes.createDecryptionCipher(key, 'CBC');
    console.log(key)
    decipher.start(key)
    decipher.update(walletBytes)
    var finish = decipher.finish()
    console.log('cypher finish', finish)

    // var decrypted = JSON.parse(forge.util.decodeUtf8(decipher.output))
    var decrypted = decipher.output
    // console.log('decrypted', decrypted)
	  return decrypted
    // return JSON.parse(decipher.output)
  },
  createSignedObject: function(data, privKey) {
    return privKey.signString(data, "sha1");
  }
};
