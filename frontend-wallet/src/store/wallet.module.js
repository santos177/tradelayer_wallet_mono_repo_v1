const {   wifToPubKey, encryptKey, decryptKey, generateKeyPair} = require('../../lib/wallet')
const localWalletEnc =  window.localStorage.getItem('walletEnc') 
const localWalletDec = window.localStorage.getItem('walletDec')

const state = {
    walletEnc: localWalletEnc ? JSON.parse(localWalletEnc) : [] ,
    walletDec:  localWalletDec ? JSON.parse(localWalletDec) : [],
    currentAddressIndex: 0,
    toAddress: "",
    sats: 0
  }

// reusable helpers
  const decryptWalletExtracted = (state, password) =>{
    const walletDec = state.walletEnc.map((encryptedKey)=>{
      const wifKey = decryptKey(encryptedKey, password)
      return {
        wifKey,
        publicAddress: wifToPubKey(wifKey)
      }
    })
    state.walletDec = walletDec;
    window.localStorage.setItem('walletDec', JSON.stringify(walletDec));
    
  }

  const addKeyPairToState = (state, keyPair, password) => {
    const ecriptedWif = encryptKey(keyPair.wifKey, password)
    const walletEnc = [...state.walletEnc];
    const walletDec = [...state.walletDec];
    walletEnc.push(ecriptedWif)
    walletDec.push(keyPair);
    
    state.walletEnc = walletEnc;
    state.walletDec = walletDec;
    window.localStorage.setItem('walletEnc', JSON.stringify(walletEnc))
    window.localStorage.setItem('walletDec', JSON.stringify(walletDec))
    
  }
  
  
  const mutations = {
    // creates random wifkey (could be better named)
    addKeyPair(state, password){
        // todo: check decription first
        const keyPair = generateKeyPair()
        
        addKeyPairToState(state, keyPair, password)
      
      },
     addKeyPairFromWif(state, {wifKey, password}){
       
        if(state.walletEnc.length > 0){
          try {
            decryptWalletExtracted(state, password)
          } catch (err){
            console.warn(err)
            return  
          }
        } 
        // TODO: check if valid wif?
        const publicAddress = wifToPubKey(wifKey)
        addKeyPairToState(state, {wifkey, publicAddress}, password)
     },
      decryptWallet(state, password){
        decryptWalletExtracted(state, password)
      },
      clearDecryptedWallet(state){
        state.walletDec = []
        window.localStorage.setItem('walletDec', JSON.stringify([]))
      },
      setCurrentAddressIndex(state, index){
        state.currentAddressIndex = index
      },
      setTxnState(state, {key, value}){
        state[key] = value
      }
  }

  const getters = {
    walletCountDisplay (state){
        const count = state.walletDec.length
        switch (count) {
          case 0:
            return state.walletEnc.length ?  `no addresses (${state.walletEnc.length} locked)` : `no addresses`
          case 1:
            return "1 adddress"
          default:
            return `${count} adresses`
        }
      },
      hasEncryptedKeys(state){
        return state.walletEnc.length > 0;
      },
      isLoggedIn(state){
        return state.walletDec.length > 0;
      }
    
  }

  export const wallet = {
    namespaced: true,
    state,
    mutations,
    getters
  }
  