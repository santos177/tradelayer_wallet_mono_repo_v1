import Vue from 'vue'
import Router from 'vue-router'
import PeggedCurrenciesContainer from '@/containers/PeggedCurrenciesContainer'
import CreateWalletContainer from '@/containers/CreateWalletContainer'
import LoginContainer from '@/containers/LoginContainer'
import SummaryContainer from '@/containers/SummaryContainer'
// import BalancesContainer from '@/containers/BalancesContainer'
import OrdersContainer from '@/containers/OrdersContainer'
import PositionsContainer from '@/containers/PositionsContainer'
import ChartsContainer from '@/containers/ChartsContainer'
import PortfolioContainer from '@/containers/PortfolioContainer'
import OrderbookContainer from '@/containers/OrderbookContainer'
import HistoricalTradesContainer from '@/containers/HistoricalTradesContainer'
import OrderbookBuy from '@/components/OrderbookBuy'
import OrderbookSell from '@/components/OrderbookSell'
import TaxesContainer from '@/containers/TaxesContainer'
import ValidatorsContainer from '@/containers/ValidatorsContainer'
import HistoricalTradesbyAddressContainer from '@/containers/HistoricalTradesbyAddressContainer'

import {store} from '../store'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/Taxes',
      name: 'Taxes',
      component: TaxesContainer
    },
    {
      path: '/OrderbookBuy',
      name: 'OrderbookBuy',
      component: OrderbookBuy
    },
    {
      path: '/Charts',
      name: 'Charts',
      component: ChartsContainer
    },
    {
      path: '/Validators',
      name: 'Validators',
      component: ValidatorsContainer
    },
    {
      path: '/OrderbookSell',
      name: 'OrderbookSell',
      component: OrderbookSell
    },
    {
      path: '/Summary',
      name: 'Summary',
      component: SummaryContainer
    },
    {
      path: '/CreateWallet',
      name: 'CreateWallet',
      component: CreateWalletContainer
    },
    { path: '/',
      name: 'LoginContainer',
      component: LoginContainer
    },
    {
      path: '/Balances',
      name: 'Balances',
      component: PortfolioContainer
    },
    {
      path: '/dCurrency',
      name: 'dCurrency',
      component: PeggedCurrenciesContainer
    },
    {
      path: '/Positions',
      name: 'Positions',
      component: PositionsContainer
    },
    {
      path: '/Orders',
      name: 'Orders',
      component: OrdersContainer
    },
    {
      path: '/Portfolio',
      name: 'Portfolio',
      component: PortfolioContainer
    },
    {
      path: '/Orderbook',
      name: 'Orderbook',
      component: OrderbookContainer
    },
    {
      path: '/HistoricalTrades',
      name: 'Historical Trades',
      component: HistoricalTradesContainer
    },
    {
      path: '/HistoricalTradesbyAddress',
      name: 'Historical Trades by Address',
      component: HistoricalTradesbyAddressContainer
    },
    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ],
  mode: 'history'

})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/CreateWallet', '/']
  // console.log('to path', to.path)
  const authRequired = !publicPages.includes(to.path, 0)
  const loggedIn = store.getters['auth/loggedin']

  // console.log('we are in before each')
  // console.log('auth required', authRequired)

  if (authRequired && !loggedIn) {
    return next('/')
  }

  next()
})
