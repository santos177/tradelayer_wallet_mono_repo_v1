import router from '../router'
import axios from 'axios'
import Vuex from 'vuex'
import config from '../config'

Vue.use(axios)
Vue.use(Vuex)

// Make sure to call Vue.use(Vuex) first if using a module system
const state = {
  count: 0,
  sankeyData: [],
  balances: [{'none': 0}]
}

const mutations = {
  getSankeyData (state) {
    axios
      .get(`${config.API_URL}/getSankeyData`,
        { headers: {
          'Content-type': 'application/json'
        },
        withCredentials: false
        })
      .then((response) => {
        state.sankeyData = response.data
        // console.log(response)
      })
      .catch((error) => {
        console.log('sankeyData error ' + error)
      })
  },
  getBalances (state) {
    axios
      // get all Pegged Balances
      .get(`${config.API_URL}/balances`,
        { heders: {
          'Content-type': 'application/json'
        },
        // TODO: how to do all this with private keys?
        withCredentials: false
        })
      // if successful, set state.balances
      .then((response) => {
        state.balances = response.data
        // console.log('balances ,', response)
      })
      .catch((error) => {
        console.log('balances error', error)
      })
  },
  generateUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16)
    })
    return uuid
  },
  verifyUUID (uuid) {
    // check UUIS do proper format
    const verify = uuid.match((/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89a-f][0-9a-f]{3}-[0-9a-f]{12}$/i) || [])

    // return falsue it if fails, true if it doesnt
    if (verify.len === 0) {
      return false
    } else {
      return true
    }
  }
}

const actions = {
  getSankeyData: ({commit}) => commit('getSankeyData'),
  getBalances: ({commit}) => commit('getBalances'),
  refreshBalances: ({commit}) =>
    setInterval(() => {
      commit('getBalances')
    }, 3000),
  refreshSankey: ({commit}) =>
    setInterval(() => {
      commit('getSankeyData')
    }, 3000)

}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export const basic = {
    namespaced: true,
    state,
    actions,
    mutations
};
