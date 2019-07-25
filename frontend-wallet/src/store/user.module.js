// user.module.js
// does the vuex work for user actions/state/mutations
// state
import {userService} from '../services'
const { CryptUtil } = require('../../lib/cryptUtil')
// console.log('crypt util', CryptUtil)
// console.log('crypt util', CryptUtil.generateNonceForDifficulty('blah'))

const state  {

  walletEnc: "",
  walletDec: [],
  walletBlob: {
    uuid: '',
    addresses: [],
    email: ''
  },
  password: '',
  walletKey: '',
  asymKey: '',
  nonce: '',
  publicKey: '',
  encryptedWallet: {},
  powChallenge: '',
  salt: '',
  uuid_is_valid: false,
  asq: ''
}

const getters = {
  walletBlobGetter (state) {
    return state.walletBlob
  },
  addressGetter (state) {
    // console.log('addressGetter walletBlob ', state.walletBlob)
    var address = ''
    var addresses =state.walletBlob.addresses
    address = addresses[0] && addresses[0].replace(/"/g, '')
    return address
  }
}

// action
const actions = {
  // TODO: remove this action walletAddress
  walletAddress ({dispatch, commit}, uuid) {
    userService.postNewAddress(uuid)
      .then((result) => {
        console.log('result.data in walletAddress ', result.data)
        commit('address', result.data.address)
        console.log('this is state walletBlob in walletAddress ', state.walletBlob)
        dispatch('walletChallenge', state.walletBlob.uuid)
        // dispatch('walletCreateCrypto', {salt: state.salt, password: state.password, walletBlob: state.walletBlob})
      })
      .catch((err) => {
        console.log('error from create funded address ', err)
      })
  },
  // set walletEmail
  walletEmail ({commit}, email) {
    commit('email', email)
  },
  // set walletPassword
  walletPassword ({commit}, password) {
    commit('password', password)
  },
  // walletUUIDcreate
  // create and set UUID
  walletUUIDCreate ({dispatch, commit}) {
    // console.log('userService', userService)
    userService.getUUIDCreate()
      .then(res => {
        // console.log('getUUIDCreate ', res)
        // console.log(' wallet UUID ', res.data.toString())
        commit('uuidCreate', res.data.uuid)
        dispatch('walletUUIDValidate', state.walletBlob.uuid)
      })
      .catch(err => {
        console.log(err)
        commit('uuidCreate', err)
      })
  },
  // walletUUIDValidate
  // validate UUID through postUUIDValidate
  walletUUIDValidate ({dispatch, commit}, uuid) {
    // console.log('uuid passed to post uuidvalidate service', uuid)
    userService.postUUIDValidate(uuid)
      .then(res => {
        console.log('inwallet uuid validate action ', res.data)
        commit('uuidValidate', res.data)
        console.log('states uuid after uuid validate commit', state.walletBlob.uuid)
        dispatch('walletAddress', res.data)
        // dispatch('walletChallenge', state.walletBlob.uuid)
      })
      .catch(err => {
        commit('uuidValidate', err)
      })
  },
  // challenge
  // calls postChallenge api service
  // inputs uuid
  walletChallenge ({dispatch, commit}, uuid) {
    // inputs uuid
    userService.postChallenge(uuid)
      .then((res) => {
        commit('challenge', res.data)
        console.log(' after post challenge, res data', res.data)
        dispatch('walletCreateCrypto', {salt: state.salt, password: state.password, walletBlob: state.walletBlob})
      })
      .catch(err => {
        console.log('err in walletChallenge', err)
      })
  },
  // do wallet crypto functions
  walletCreateCrypto ({dispatch, commit}, data) {
    // salt, powChallenge, password, walletBlob
    // do the crypto stuff and change state
    // console.log('data in wallet create crypto', data)
    // var nonce = CryptUtil.generateNonceForDifficulty(data.powChallenge)
    var walletKey = CryptUtil.generateSymmetricKey(data.password, data.salt)
    var encryptedWallet = CryptUtil.encryptObject(data.walletBlob, walletKey)
    var asymKey = CryptUtil.generateAsymmetricPair()
    // commit the mutations to state
    // commit('nonce', nonce)
    commit('walletKey', walletKey)
    commit('encryptedWallet', encryptedWallet)
    commit('asymKey', asymKey)
    // console.log('data in wallet create crypto after commits-nonce', nonce)
    // console.log('data in wallet create crypto after commits-walletKey', walletKey)
    // console.log('data in wallet create crypto after commits-encryptedWallet', encryptedWallet)
    // console.log('data in wallet create crypto after commits-asymKey', asymKey)
    // TODO: nothing is ever done with asym key?  where is publickey being properly set?
    dispatch('walletCreate', {uuid: state.walletBlob.uuid, email: state.walletBlob.email, encryptedWallet: state.encryptedWallet})
  },
  // create wallet
  // inputs: uuid, email, nonce, publicKey, encryptedWallet
  walletCreate ({ dispatch, commit }, data) {
    // inputs: uuid, email, nonce, public_key, encrypted_wallet)
    console.log('walletCreate action uuid', data.uuid)
    console.log('walletCreate action email', data.email)
    console.log('walletCreate action encryptedWallet', data.encryptedWallet)

    userService.postCreateWallet(state.password, data.uuid, data.email, data.encryptedWallet)
      .then(res => {
      // inputs:  input:uuid, email, nonce, public_key, encrypted_wallet)
        console.log('response from post create wallet', res)
        commit('created', res)
        // console.log('results of postCreateWallet ', res)
        dispatch('auth/login', {uuid: data.uuid, password: state.password}, { root: true })
      })
      .catch(err => {
        console.log('error in postCreate Wallet return', err)
      })
  }
} // end actions

// mutations
const mutations = {
  walletBlob (state, walletBlob) {
    state.walletBlob = JSON.parse(walletBlob.toString())
    // console.log('wallelBlob uuid ', state.walletBlob['uuid'])
    alert('Please WRITE DOWN your Wallet ID, listed at the top of the page, because in the demo you will NOT be emailed a copy')
  },
  asq (state, asq) {
    state.asq = asq
  },
  uuidCreate (state, uuid) {
    state.walletBlob.uuid = uuid
  },
  uuidValidate (state, isValid) {
    state.uuid_is_valid = isValid
  },
  challenge (state, data) {
    state.salt = data.salt
    state.powChallenge = data.pow_challenge
    state.challenge = data.challenge
  },
  created (state, created) {
    state.token = created.token
  },
  nonce (state, nonce) {
    state.nonce = nonce
  },
  walletKey (state, walletKey) {
    state.walletKey = walletKey
  },
  encryptedWallet (state, encryptedWallet) {
    state.encryptedWallet = encryptedWallet
  },
  asymKey (state, asymKey) {
    state.asymKey = asymKey
  },
  publicKey (state, publicKey) {
    state.publicKey = publicKey
  },
  password (state, password) {
    state.password = password
  },
  email (state, email) {
    state.walletBlob.email = email
  },
  uuid (state, uuid) {
    state.walletBlob.uuid = uuid
  },
  address (state, address) {
    console.log('address in address mutation', address)
    state.walletBlob.addresses = [address]
  }
}

export const user = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
