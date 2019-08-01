const {   wifToPubKey, encryptKey, decryptKey, generateKeyPair} = require('../../lib/wallet')
const localWalletEnc =  window.localStorage.getItem('walletEnc') 
const localWalletDec = window.localStorage.getItem('walletDec')
import {walletService} from '../services'
const state = {
    walletEnc: localWalletEnc ? JSON.parse(localWalletEnc) : [] ,
    walletDec:  localWalletDec ? JSON.parse(localWalletDec) : [],
    currentAddressIndex: 0,
    toAddress: "",
    sats: 0,
    utxoArray: []
  }

// reusable helpers
  const decryptWalletExtracted = (state, password) =>{
    const wifKeys  = state.walletEnc.map((encryptedKey)=> decryptKey(encryptedKey, password))
    if (wifKeys.length === 0){
      return true
    } else if (wifKeys.includes(false)){
      return false 
    } else {
      const walletDec = wifKeys.map((wifKey) => (
        {
            wifKey,
            publicAddress: wifToPubKey(wifKey)
          } 
      ))
      state.walletDec = walletDec;
      window.localStorage.setItem('walletDec', JSON.stringify(walletDec));
      return true
    }
    
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
    return true
  }
  
  const actions = {
    // todo: call after new address is added
    setCurrentAddress({commit, state}, index){
      const newAddress = state.walletDec[index].publicAddress;
     
      walletService.getUTXOs(newAddress, (utxoArray)=>{
        commit('setUTXOArray', utxoArray)
        commit('setCurrentAddressIndex', index)
      })
    },
    updateCurrentUTXOs({dispatch, state}){
      // run this in a setInterval
      const {walletDec, currentAddressIndex} = state
      if (walletDec[currentAddressIndex]){
        dispatch('setCurrentAddress', currentAddressIndex)
      }
    }
  }
  const mutations = {
    // creates random wifkey (could be better named)
    addKeyPair(state, {password, next, error}){
        if (decryptWalletExtracted(state, password)) {
         const keyPair = generateKeyPair()
         addKeyPairToState(state, keyPair, password) 
         
         return  next &&  next()
       }
      return error && error()
      },
     addKeyPairFromWif(state, {wifKey, password}){
        if ( (state.walletEnc.length > 0) && !decryptWalletExtracted(state, password)) {
          return false
        }
       
        // TODO: check if valid wif?
        const publicAddress = wifToPubKey(wifKey)
        addKeyPairToState(state, {wifKey, publicAddress}, password)
     },
      decryptWallet(state, password){
        return decryptWalletExtracted(state, password)
      },
      clearDecryptedWallet(state){
        state.walletDec = []
        window.localStorage.setItem('walletDec', JSON.stringify([]))
      },
      setCurrentAddressIndex(state, index){
        state.currentAddressIndex = index
      },
      setUTXOArray(state, utxoArray){
        state.utxoArray = utxoArray
      },
      setTxnState(state, {key, value}){
        state[key] = value
      },
      clearKeys(state){
        state.walletEnc = [];
        state.walletDec = [];
        window.localStorage.setItem('walletEnc', JSON.stringify([]))
        window.localStorage.setItem('walletDec', JSON.stringify([]))
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
      },
      addressGetter(state){
        const addressObj =  state.walletDec[state.currentAddressIndex]
        return addressObj ? addressObj.publicAddress : ""
      }
    
  }

  export const wallet = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
  }
  