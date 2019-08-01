// account.module
// does the Vuex work action/mutations to state for wallet account on front end
// import config from '../../config'
import {pcurrencyService} from '../services'

const state = {
  balance: {},
  error: ''
}

const actions = {
  getBalancePegged ({ dispatch, commit, rootState }, data) {
    // console.log(' this is the address for get balance in store function ', data.address)
    return pcurrencyService.getBalancePegged(data.address, data.contractID)
  },
  getBalanceALL ({ dispatch, commit, rootState }, data) {
    // console.log(' this is the address for get balance in store function ', data.address)
    return pcurrencyService.getBalanceALL(data.address, data.contractID)
  },
  createPegCurrencies ({ dispatch, commit, rootState, rootGetters }, data) {
    pcurrencyService.createPegCurrency(data.name, data.quantity, rootGetters['wallet/addressGetter'], data.contractID)
      .then((result) => {
        // If exits ...
        // console.log('created pegged currency result ', result)
        return 'done'
      })
      .catch((err) => {
        console.log(' there was a problem with Pegged Currency service', err)
        commit('setError', '')
        return err.toString()
      })
  },
  sendPeggedCurrency ({ dispatch, commit, rootState, rootGetters }, data) {
    // console.log('toaddress in send Pegged action is ', data.toAddress)
    // fromAddress, toAddress, contractID, amount
    pcurrencyService.sendPeggedCurrency(data.toAddress, data.fromAddress, data.contractID, data.amount)
      .then((result) => {
        // If exits ...
        // console.log('send pegged currency result ', result)
        return 'done'
      })
      .catch((err) => {
        console.log(' there was a problem with Pegged Currency service', err)
        commit('setError', '')
        return err.toString()
      })
  },
  redeemPeggedCurrency ({ dispatch, commit, rootState, rootGetters }, data) {
    // redeemAddress, propertyID, amount
    pcurrencyService.redeemPeggedCurrency(data.redeemAddress, data.name, data.amount, data.contractID)
      .then((result) => {
        // If exits ...
        // console.log('redeem pegged currency result ', result)
        return 'done'
      })
      .catch((err) => {
        console.log(' there was a problem with Pegged Currency service', err)
        commit('setError', '')
        return err.toString()
      })
  },
  maxPeggedCurrency ({ dispatch, commit, rootState, rootGetters }, data) {
    // fromAddress, contractID
    return pcurrencyService.maxPeggedCurrency(data.fromAddress, data.contractID)
  }
}

const mutations = {
  setBalance (state, balance) {
    state.balance = balance
  },
  setError (state, error) {
    state.error = error
  }
}

export const pcurrency = {
  namespaced: true,
  state,
  actions,
  mutations
}
