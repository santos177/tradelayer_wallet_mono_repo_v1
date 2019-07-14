import {authService} from '../services'
import {router} from '../router'
const { CryptUtil } = require('../../lib/cryptUtil')
// const utf8 = require('utf8')

const state = {
  loggedin: false,
  // user: false,
  tokens: {
    access: null,
    refresh: null
  },
  loginError: null
}

const getters = {
  user () {
    return state.user
  },
  isAdmin () {
    return (typeof state.user.isAdmin !== 'undefined' && state.user.isAdmin)
  },
  loggedin () {
    return state.loggedin
  },
  accesstoken () {
    return state.tokens.access
  },
  refreshtoken () {
    return state.tokens.refresh
  },
  auth () {
    return state
  },
  loginError () {
    return state.loginError
  }
}

const actions = {
  loginError ({commit, rootState}, error) {
    commit('setLoginError', error)
  },
  login ({ commit, rootState }, credentials) {
    return authService.postLogin(credentials).then((data) => {
      commit('setLoggedIn', true)
      // console.log('data in login auth', data)
      // commit('setUser', data.user)
      commit('setAccessToken', data.token)
      commit('setRefreshToken', data.token)

      var payload = JSON.parse(atob(data.token.split('.')[1]))
      console.log('payload in login', payload)
      commit('user/encryptedWallet', payload.walletEncrypted, { root: true })

      // console.log('after encrypted wallet commit data walletencrypted', rootState.user.encryptedWallet)
      // console.log('walletKey', rootState.user.walletKey)
      // var utfWalletKey = utf8.encode(rootState.user.walletKey)

      // console.log('utfWalletKey', utfWalletKey)
      var walletBlob = CryptUtil.decryptObject(rootState.user.encryptedWallet, rootState.user.walletKey)
      console.log('walletBlob in login ', walletBlob)
      commit('user/walletBlob', walletBlob, { root: true })
      // commit('user/asq', asq, { root: true })
      // commit('account/loginSuccess', { root: true })
      // console.log('we are after postLogin in auth/login ')
      commit('setLoginError', null)
      router.push('/Summary')
    })
      .catch((err) => {
        commit('setLoginError', err)
      })
  },
  authenticate ({ commit }) {
    return authService.getAuthenticate().then((data) => {
      commit('setLoggedIn', true)
      // commit('setUser', data.user)
    })
  },
  logout ({ commit }) {
    commit('setLoggedIn', false)
    // commit('setUser', false)
    commit('clearAccessToken', false)
    commit('clearRefreshToken', false)
  }
}

const mutations = {
  setLoginError (state, error) {
    state.loginError = error
  },
  setUser (state, user) {
    state.user = user
  },
  clearUser (state, user) {
    state.user = false
  },
  setAccessToken (state, token) {
    localStorage.setItem('accessToken', token)
    state.tokens.access = token
  },
  clearAccessToken (state) {
    localStorage.removeItem('accessToken')
    state.tokens.access = false
  },
  setRefreshToken (state, token) {
    localStorage.setItem('refreshToken', token)
    state.tokens.refresh = token
  },
  clearRefreshToken (state) {
    localStorage.removeItem('refreshToken')
    state.tokens.refresh = false
  },
  setLoggedIn (state, status) {
    state.loggedin = status
  }
}

export const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
