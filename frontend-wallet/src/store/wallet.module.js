const {   wifToPubKey, encryptKey, decryptKey, generateKeyPair} = require('../../lib/wallet')
const localWalletEnc =  window.localStorage.getItem('walletEnc') 
const localWalletDec = window.localStorage.getItem('walletDec')

const state = {
    walletEnc: localWalletEnc ? JSON.parse(localWalletEnc) : [] ,
    walletDec:  localWalletDec ? JSON.parse(localWalletDec) : []
  }
  
  
  const mutations = {
    addKeyPair(state, password){
        // todo: check decription first
        const keyPair = generateKeyPair()
        
        const ecriptedWif = encryptKey(keyPair.wifKey, password)
        
    
        const walletEnc = [...state.walletEnc];
        const walletDec = [...state.walletDec];
        walletEnc.push(ecriptedWif)
        walletDec.push(keyPair);
        
        state.walletEnc = walletEnc;
        state.walletDec = walletDec;
        window.localStorage.setItem('walletEnc', JSON.stringify(walletEnc))
        window.localStorage.setItem('walletDec', JSON.stringify(walletDec))
      
      },
      decryptWallet(state, password){
        const walletDec = state.walletEnc.map((encryptedKey)=>{
          
          return decryptKey(encryptedKey, password)
        })
        state.walletDec = walletDec;
        window.localStorage.setItem('walletDec', JSON.stringify(walletDec));
        
      }
  }

  const getters = {
    walletCountDisplay (state){
        const count = state.walletEnc.length
        switch (count) {
          case 0:
            return "no addresses"
          case 1:
            return "1 adddress"
          default:
            return `${count} adresses`
        }
      },
      hasEncryptedKeys(state){
        return state.walletEnc.length > 0;
      }
    
  }
  
  export const wallet = {
    namespaced: true,
    state,
    mutations,
    getters
  }
  