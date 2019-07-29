import Vue from 'vue'
import Vuex from 'vuex'

import { alert } from './alert.module'
import { account } from './account.module'
import { auth } from './auth.module'
import { user } from './user.module'
import { orderbook } from './orderbook.module'
import { contracts } from './contracts.module'
import { pcurrency } from './pcurrency.module'
import { loading } from './loading.module'
import {wallet} from './wallet.module.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    alert,
    user,
    account,
    auth,
    orderbook,
    contracts,
    pcurrency,
    loading,
    wallet
  }
})
