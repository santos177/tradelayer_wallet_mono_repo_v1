// account.module
// does the Vuex work action/mutations to state for wallet account on front end
// import config from '../../config'
import {orderbookService} from '../services'

const state = {
  buy: {},
  sell: {},
  buyFull: {},
  sellFull: {},
  orderBookFull: {},
  recent: {},
  recentbyaddress: {}
}

const getters = {
  buyFullGetter (state) {
    return state.buyFull
  },
  sellFullGetter (state) {
    return state.sellFull
  },
  recentByAddressGetter (state) {
    return state.recentbyaddress
  }
}

const actions = {
  getPairOrderBook({dispatch, commit, rootState, rootGetters}, data) {
    const { propsIdForSale, propsIdDesired} = rootState.contracts.selectedContract;
    orderbookService.getPairOrderBook({propsIdForSale, propsIdDesired})
    .then(res => {
      const orderBook = res.data;
      const { buyBook, sellBook } = orderBook;

      const newBuyBookArray = []
      buyBook.forEach((book, i) => {
        const buyBookObj = {
          quantity:parseFloat(book.amountremaining).toFixed(8),
          price: (parseFloat(book.amountdesired) / parseFloat(book.amountforsale)).toFixed(8),
        }
        newBuyBookArray[i] = buyBookObj;
      })

      const newSellBookArray = []
      sellBook.forEach((book, i) => {
        const sellBookObj = {
          quantity: parseFloat(book.amountremaining).toFixed(8),
          price: (parseFloat(book.amountdesired) / parseFloat(book.amountforsale)).toFixed(8),
        }
        newSellBookArray[i] = sellBookObj;
      })

      newBuyBookArray.sort((a, b) => Number(a.price) - Number(b.price))
      newSellBookArray.sort((a, b) => Number(a.price) - Number(b.price))
      commit('buyBookFull', newBuyBookArray)
      commit('sellBookFull', newSellBookArray)
      commit('buyBook', newBuyBookArray.slice(0, 5))
      commit('sellBook', newSellBookArray.slice(0, 5))
    })
  },

  getOrderBook ({dispatch, commit, rootState, rootGetters}, data) {
    dispatch('contracts/getEquity', {address: rootGetters['wallet/addressGetter'], contractID: rootState.contracts.selectedContract, contractIDALL: '4'}, { root: true })
    orderbookService.getOrderBook(rootState.contracts.selectedContract)
      .then((result) => {
        if(result.data.error) return
        // console.log('this is the buy book , ', result.data[1])
        // console.log('this is the sell book , ', result.data[0])
        var buyBook = result.data[1]
        var sellBook = result.data[0]
        // console.log('this is the buyBook inside getOrderBook ', buyBook)
        // console.log('this is the sellBook inside getORderBook ', sellBook)
        var buyMap = new Map()
        for (var i = 0; i < buyBook.length; i++) {
          buyMap.set(buyBook[i].effectiveprice, 0)
        }
        //
        var sellMap = new Map()
        for (var a = 0; a < sellBook.length; a++) {
          sellMap.set(sellBook[a].effectiveprice, 0)
        }

        for (var b = 0; b < buyBook.length; b++) {
          // this returns the value according to the key
          let totalAmount = Number(buyMap.get(buyBook[b].effectiveprice))
          // this returns the amount for sale for current book order
          let newAmount = Math.floor(Number(buyBook[b].amountforsale))
          // this is what the new total orders is
          let amount = totalAmount + newAmount
          buyMap.set(buyBook[b].effectiveprice, amount)
        }

        for (var c = 0; c < sellBook.length; c++) {
          let totalAmount = Number(sellMap.get(sellBook[c].effectiveprice))
          let newAmount = Math.floor(Number(sellBook[c].amountforsale))
          let amount = totalAmount + newAmount
          sellMap.set(sellBook[c].effectiveprice, amount)
        }

        var newBuyBook = []
        buyMap.forEach(function (value, key) {
          var book = {
            price: '',
            quantity: ''
          }

          book.price = key
          book.quantity = value

          newBuyBook.push(book)
          newBuyBook.sort(function (a, b) {
            return Number(b.price) - Number(a.price)
          })
        })

        // var buyend = newBuyBook.length
        // var buystart = newBuyBook.length - 5
        // console.log('buy start is ', buystart)
        // commit buy book before you clip it
        commit('buyBookFull', newBuyBook)
        // clip it
        newBuyBook = newBuyBook.slice(0, 5)

        var newSellBook = []
        sellMap.forEach(function (value, key) {
          var book = {
            price: '',
            quantity: ''
          }

          book.price = key
          book.quantity = value

          newSellBook.push(book)
          newSellBook.sort(function (a, b) {
            return Number(b.price) - Number(a.price)
          })
        })

        var sellend = newSellBook.length
        var sellstart = newSellBook.length - 5
        // console.log('sell start is ', sellstart)
        // commit sell book before you clip it
        commit('sellBookFull', newSellBook)
        // clip it
        newSellBook = newSellBook.slice(sellstart, sellend)
        commit('buyBook', newBuyBook)
        commit('sellBook', newSellBook)

        return 'done'
      })
  },
  getRecentTrades ({ dispatch, commit, rootState }, theSelectedContract) {
    orderbookService.getRecentTrades(theSelectedContract)
      .then((result) => {
        if (result.data.error) return
        var recent = result.data.sort(function (a, b) {
          if (a.taker_block === b.taker_block) {
            return Number(b.taker_index_block) - Number(a.taker_index_block)
          } else {
            return Number(b.taker_block) - Number(a.taker_block)
          }
        })
        commit('recent', recent)
        return 'done'
      }).catch((err)=>{
        console.warn('catching recent trade error ',err);
        
      })
  },
  postRecentTradesbyAddress ({ dispatch, commit, rootState }, data) {
    orderbookService.postRecentTradesbyAddress(data.contractID, data.address)
      .then((result) => {
        if(result.data.error) return
        var recentbyaddress = result.data.sort(function (a, b) {
          if (a.taker_block === b.taker_block) {
            return Number(b.taker_index_block) - Number(a.taker_index_block)
          } else {
            return Number(b.taker_block) - Number(a.taker_block)
          }
        })
        commit('recentbyaddress', recentbyaddress)
        return 'done'
      })
      .catch((err) => {
        console.log('waaa in postRecentTradesbyAddress ', err)
        return err
      })
  }
}

const mutations = {
  buyBook (state, book) {
    state.buy = book
  },
  sellBook (state, book) {
    state.sell = book
  },
  buyBookFull (state, book) {
    state.buyFull = book
  },
  sellBookFull (state, book) {
    state.sellFull = book
  },
  recent (state, book) {
    state.recent = book
  },
  recentbyaddress (state, transactions) {
    state.recentbyaddress = transactions
  }
}

export const orderbook = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
