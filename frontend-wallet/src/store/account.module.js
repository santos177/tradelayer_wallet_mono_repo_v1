// account.module
// does the Vuex work action/mutations to state for wallet account on front end
// import config from '../../config'
import {userService} from '../services'
// import { router } from '../router'
const { CryptUtil } = require('../../lib/cryptUtil')
// const utf8 = require('utf8')

const state = {
  status:
    { loggedIn: false, loggingIn: false }
}

const actions = {
  verify ({ dispatch, commit, rootState }, data) {
    // console.log('uuid in account module login action', data.uuid)
    // commit('loginRequest', data.uuid)
    // response = {
    // 'salt': salt,
    // 'pow_challenge': pow_challenge,
    // 'challenge': challenge
    userService.postChallenge(data.uuid)
      .then((result1) => {
        // crypto functions
        // var nonce = CryptUtil.generateNonceForDifficulty(result1.data.powChallenge)
        var walletKey = CryptUtil.generateSymmetricKey(data.password, result1.data.salt)
        // var asymKey = CryptUtil.generateAsymmetricPair()
        // commit('user/nonce', nonce)
        // console.log('walletKey', walletKey)
        // console.log('asymKey in login', asymKey)
        commit('user/walletKey', walletKey, { root: true })
        // commit('user/asymKey', asymKey, { root: true })
        // set publicKey to asymKey.pubPem
        // console.log('public key, ', asymKey.pubPem)
        // commit('user/publicKey', asymKey.pubPem, { root: true })
        // console.log('public key from state ', rootState.user.publicKey)
        return 'done with crypto'
      })
      .catch((err) => {
        console.log('error in crypto of login', err)
        dispatch('auth/loginError', err, { root: true })
        return 'error in crypto of login'
      })
      .then((result2) => {
        const loginData = {
          uuid: data.uuid,
          password: data.password
        }
        // dispatch('user/walletAddress', { root: true })
        dispatch('auth/login', loginData, { root: true })
        return 'done with login'
      })
      .catch((err) => {
        console.log('error in verify', err)
        dispatch('auth/loginError', err, { root: true })
        return err
      })
  }
}

const mutations = {

}

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
}
