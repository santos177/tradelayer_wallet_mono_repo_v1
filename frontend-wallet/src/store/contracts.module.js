import {contractsService} from '../services'
// import numeral from 'numeral'

const state = {
  equity: 'Log in',
  lastTXID: 0,
  positions: {},
  activebuysbyaddress: [],
  activesellsbyaddress: [],
  actives: [],
  transactions: [],
  fullPositions: [],
  lastContractId: 6,
  ALLPrice: 4,
  lastContractName: 'ALL F20',
  selectedContract: 'ALL/USD',
  pendingByAddress: [],
  pendingTXIDs: []
}

function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}

const getters = {
  pendingTXIDsGetter (state) {
    return state.pendingTXIDs
  },
  equityGetter (state) {
    return state.equity
  },
  lastContractIdGetter (state) {
    return state.lastContractId
  },
  lastContractNameGetter (state) {
    return state.lastContractName
  },
  positionsGetter (state) {
    return state.positions
  },
  fullPositionsGetter (state) {
    // console.log('fullPositionsGetter ', state.fullPositions)
    return state.fullPositions
  },
  transactionsGetter (state) {
    console.log('transactions in trans getter ', state.transactions)
    return state.transactions
  },
  activebuysbyaddressGetter (state) {
    // console.log('active trades by address ', state.activebuysbyaddress)
    return state.activebuysbyaddress
  },
  activesellsbyaddressGetter (state) {
    // console.log('active trades by address ', state.activesellsbyaddress)
    return state.activesellsbyaddress
  },
  activesGetter (state) {
    // console.log('active trades by address ', state.actives)
    return state.actives
  },
  selectedContractGetter (state) {
    return state.selectedContract
  },
  pendingByAddressGetter (state) {
    // console.log('active trades by address ', state.activesellsbyaddress)
    return state.pendingByAddress
  }
}

const actions = {
  addPendingTXID ({dispatch, commit, rootState, rootGetters}, txid) {
    console.log('this is the txid passed to the add pending action ', txid)
    commit('addPendingTXID', txid)
  },
  setSelectedContract ({dispatch, commit, rootState, rootGetters}, data) {
    console.log('this is selected contract', data.selectedContract)
    commit('selectedContract', data.selectedContract)
    return 'setState successful'
  },
  getEquity ({dispatch, commit, rootState, rootGetters}, data) {
    return new Promise((resolve, reject) => {
      contractsService.getEquity(data.address, data.contractID, data.contractIDALL)
        .then(result => {
          // console.log('this is equity balance ', result.data.balance)
          commit('equity', result.data.balance)
          resolve(result)
        })
        .catch(err => {
          console.log('waaa equity ', err)
          reject(err)
        })
    })
  },
  buyContracts ({dispatch, commit, rootState, rootGetters}, data) {
    return new Promise((resolve, reject) => {
      contractsService.postBuyContracts(data.quantity, data.price, rootState.contracts.selectedContract, rootGetters['wallet/addressGetter'], data.leverage)
        .then(result => {
          commit('lastTXID', result.data.trxid)
          // console.log('the trxid is from buy contracts is', result.data.trxid)
          // console.log('result of postBuyContracts is ', result)
          resolve(result)
        })
        .catch(err => {
          // console.log('err from buyContracts action', err)
          reject(err)
        })
    })
  },
  sellContracts ({dispatch, commit, rootState, rootGetters}, data) {
    return new Promise((resolve, reject) => {
      contractsService.postSellContracts(data.quantity, data.price, rootState.contracts.selectedContract, rootGetters['wallet/addressGetter'], data.leverage)
        .then(result => {
          commit('lastTXID', result.data.trxid)
          // console.log('result of post Sell Contracts is ', result)
          resolve(result)
        })
        .catch(err => {
          console.log('err from sell Contracts action', err)
          reject(err)
        })
    })
  },
  postCancelTrades ({ dispatch, commit, rootState, rootGetters }) {
    contractsService.postCancelTrades(rootState.contracts.selectedContract, rootGetters['wallet/addressGetter'])
      .then((result) => {
        return 'successfully canceled'
      })
      .catch((err) => {
        console.log('something went wrong with canceling trades ', err)
        return err
      })
  },
  getPendingByAddress ({ dispatch, commit, rootState, rootGetters }, data) {
    // console.log('the selected active contract in active address is ', data.contractID)
    // console.log('address in active address is ', data.address)
    // get the latest transaction txid from buy or sell submit
    // data.quantity, data.price, rootState.contracts.selectedContract, rootGetters['user/addressGetter'], data.leverage
    // get the oderbook from buyside
    var orderbook = rootState.orderbook.recentbyaddress
    // var orderbookSell = rootState.orderbook.sellFull

    console.log('this is the orderbook ', orderbook)
    // if maker_txid or taker_txid is = pendingTXID, then it is no longer pending,
    // then remove pendingtrade and pendingtxid

    console.log('we are in pending by address with pendingTXIDs ', state.pendingTXIDs)
    // for each transaction, filter to see if transactions match any activebuysbyaddress
    for (var i = 0; i < state.pendingTXIDs.length; i++) {
      console.log('this is pendingtxids length', state.pendingTXIDs.length)
      console.log('this is where we are in pending txids i ', i)
      var matchedTransactionsBuy1 = state.activebuysbyaddress.filter((trade) => {
        console.log('this is what the trade looks like in pending ', trade)
        return (
          trade.txid === state.pendingTXIDs[i] ||
          trade.txid === state.pendingTXIDs[i])
      })

      var matchedTransactionsBuy2 = orderbook.filter((trade) => {
        return (
          trade.maker_txid === state.pendingTXIDs[i] ||
          trade.taker_txid === state.pendingTXIDs[i])
      })
      console.log('matchedTransactionsBuy ', matchedTransactionsBuy1)
      console.log('mtchedBuy2', matchedTransactionsBuy2)
      // for each transaction, filter to see if transactions match any activesellsbyaddress
      var matchedTransactionsSell1 = state.activesellsbyaddress.filter((trade) => {
        return (trade.txid === state.pendingTXIDs[i] ||
          trade.txid === state.pendingTXIDs[i])
      })

      var matchedTransactionsSell2 = orderbook.filter((trade) => {
        return (
          trade.maker_txid === state.pendingTXIDs[i] ||
          trade.taker_txid === state.pendingTXIDs[i])
      })
      console.log('matchedTransactionsSell ', matchedTransactionsSell1)
      console.log('matchedTransactionsSell2 ', matchedTransactionsSell2)
      // if no match, it is pending, create JSON object array containing trade info
      if (!matchedTransactionsBuy1.length && !matchedTransactionsBuy2.length && !matchedTransactionsSell1.length && !matchedTransactionsSell2.length) {
        // it just stays in pending tx array
        // trade info gets added to pendingByAddress
        var tradeToAdd = {
          txid: state.pendingTXIDs[i]
        }

        commit('addPendingTransaction', tradeToAdd)
      } else {
        // if match, it is not pending, so remove from pendingtxids
        // make sure it is removed from pendingbyAddress
        if (matchedTransactionsBuy1.length) {
          console.log('matched transaction buy means it is not pending')
          commit('removePendingTXID', state.pendingTXIDs[i])
          commit('removePendingTransaction', matchedTransactionsBuy1)
        }
        if (matchedTransactionsBuy2.length) {
          console.log('matched transaction buy means it is not pending')
          commit('removePendingTXID', state.pendingTXIDs[i])
          commit('removePendingTransaction', matchedTransactionsBuy2)
        }

        if (matchedTransactionsSell1.length) {
          console.log('matched transaction sell means it is nt pending')
          commit('removePendingTransaction', matchedTransactionsSell1)
        }
        if (matchedTransactionsSell2.length) {
          console.log('matched transaction buy means it is not pending')
          commit('removePendingTXID', state.pendingTXIDs[i])
          commit('removePendingTransaction', matchedTransactionsSell2)
        }
      }
    }
    return 'done'
  },
  postActiveTradesbyAddress ({ dispatch, commit, rootState, rootGetters }) {
    return new Promise((resolve, reject) => {
      contractsService.postActiveTradesbyAddress(rootState.contracts.selectedContract, rootGetters['wallet/addressGetter'])
        .then((result) => {
          // console.log('returned active sell trades by address', result.data)
          commit('activebuysbyaddress', result.data[0])
          commit('activesellsbyaddress', result.data[1])
          var currentActives = result.data[0]
          currentActives = currentActives.concat(result.data[1])
          // console.log('all actives ', currentActives)
          commit('actives', currentActives)
          resolve(result.data)
        })
        .catch((err) => {
          console.log('waaaa something wrong in the active trades ', err)
          reject(err)
        })
    })
  },
  postCancelSingleActiveTrade ({ dispatch, commit, rootState, rootGetters }, data) {
    return new Promise((resolve, reject) => {
      contractsService.postCancelSingleActiveTrade(data.senderAddress, data.block, data.idx)
        .then((result) => {
          console.log('cancel result')
          resolve(result)
        })
        .catch((err) => {
          console.log('something went wrong in cancel single active trade ', err)
          reject(err)
        })
    })
  },
  postALLPrice ({ dispatch, commit, rootState, rootGetters }) {
    contractsService.postALLPrice()
      .then((result) => {
        // console.log('all price result', result)
        commit('allprice', result.data.unitprice)
        return 'done'
      })
      .catch((err) => {
        console.log('err in postALLPRice ', err)
        return err
      })
  },
  getPositions ({ dispatch, commit, rootState }, data) {
    contractsService.getPositions(data.account, data.contractID)
      .then((result) => {
        // console.log('positions returned from positions service', result)
        commit('setPositions', result)
        return 'done'
      })
      .catch((err) => {
        console.log('err after getPositions service in getPositions contracts store', err)
        return err
      })
  },
  getFullPositions ({ dispatch, commit, rootState, rootGetters }, data) {
    // console.log(' rootState ContractId in getFullPositions contracts module ', data)
    contractsService.getFullPositions(data.account, data.contractID)
      .then((result) => {
        // console.log('set full positions in getFullPositions contract module ', result.data)
        commit('setFullPositions', result)
        return 'done'
      })
      .catch((err) => {
        console.log('err after getFullPositions service in getFullPositions contracts store', err)
        return err
      })
  },
  getLastContractId ({ dispatch, commit, rootState }) {
    // console.log('fired get lastcontract ID')
    contractsService.getLastContractId()
      .then((result) => {
        // console.log('result.data of getLastContractId', result.data)
        commit('lastContractId', result.data)
        return 'done'
      })
      .catch((err) => {
        console.log('something went wrong in getLastContractId', err)
        return err
      })
  }
}

const mutations = {
  addPendingTXID (state, pendingtxid) {
    console.log('this is the pending txid in mutation ', pendingtxid)
    var isThere = state.pendingTXIDs.filter((txid) => {
      return txid === state.pendingtxid
    })

    console.log('inside the push pending with isThere value ', isThere)
    if (!isThere.length) {
      console.log('we are inside the not isThere')
      state.pendingTXIDs.push(pendingtxid)
    }
    console.log('this is the state.pendingTXIDs after push ', state.pendingTXIDs)
  },
  removePendingTXID (state, pendingtxid) {
    var removed
    var indexTXID = state.pendingTXIDs.find((txid, i) => {
      console.log('the txid in removepending ', txid)
      console.log('the pendingtxid in removepending ', pendingtxid)
      if (txid === pendingtxid) {
        removed = state.pendingTXIDs.splice(i, 1)
        return i
      }
    })
    console.log('index removed', indexTXID)
    console.log('the thing that was removed  ', removed)
    state.pendingTXIDs = state.pendingTXIDs
    console.log('pending txids after remove ', state.pendingTXIDs)
    return 'done'
  },
  removePendingTransaction (state, pendingTransaction) {
    var removed
    console.log('this is the pendingTransaction we want to remove from pending ', pendingTransaction)
    var indexPending = state.pendingByAddress.find((trade, i) => {
      // console.log('this is current trade.txid  in pendingByAddress find', trade.txid)
      // console.log('this is pendingTransaction.txid  in pendingByAddress find', pendingTransaction[0].txid)
      console.log('we are inside remove  maker tx', pendingTransaction[0].maker_txid)
      console.log('we are inside remove taker tx ', pendingTransaction[0].taker_txid)
      console.log('we are inside remove tx', pendingTransaction[0].txid)
      if (pendingTransaction[0].txid) {
        if (trade.txid === pendingTransaction[0].txid) {
          console.log('we are inside remove ', trade.txid)
          removed = state.pendingByAddress.splice(i, 1)
          return i
        }
      }
      if (pendingTransaction[0].maker_txid.length) {
        if (trade.txid === pendingTransaction[0].maker_txid) {
          console.log('we are inside remove ', pendingTransaction[0].maker_txid)
          removed = state.pendingByAddress.splice(i, 1)
          return i
        }
      }
      if (pendingTransaction[0].taker_txid.length) {
        // we assume there is a taker txid
        if (trade.txid === pendingTransaction[0].taker_txid) {
          console.log('we are inside remove ', pendingTransaction[0].taker_txid)
          removed = state.pendingByAddress.splice(i, 1)
          return i
        }
      }
    })
    console.log('the thing that was removed  ', indexPending + removed)
    state.pendingByAddress = state.pendingByAddress
    console.log('pending by address after remove ', state.pendingByAddress)
    return 'done'
  },
  addPendingTransaction (state, pendingTransaction) {
    console.log('this is the pending transaction we will push ', pendingTransaction)
    // if it is already in the pendingByAddress, don't add it
    var isThere = state.pendingByAddress.find((pending) => {
      return pendingTransaction.txid === pending.txid
    })
    if (!isThere) {
      state.pendingByAddress.push(pendingTransaction)
    }
    console.log('this is the pendingbyaddress after push', state.pendingByAddress)
  },
  pendingByAddress (state, pendingByAddress) {
    state.pendingByAddress = pendingByAddress
  },
  selectedContract (state, selectedContract) {
    state.selectedContract = selectedContract
  },
  equity (state, equity) {
    state.equity = equity
  },
  lastTXID (state, txid) {
    state.lastTXID = txid
  },
  transactions (state, transactions) {
    state.transactions = transactions
  },
  actives (state, actives) {
    state.actives = actives
  },
  activebuysbyaddress (state, activebuys) {
    state.activebuysbyaddress = activebuys
  },
  activesellsbyaddress (state, activesells) {
    state.activesellsbyaddress = activesells
  },
  setFullPositions (state, fullPosition) {
    if (fullPosition.data && fullPosition.data.length !== undefined) {
      console.log('Setting FP data:', fullPosition.data);
      
    //  console.log('fullPositions.data ', fullPosition.data)
      // var symbol = fullPosition.data['symbol']
      var matched = false
      var i = 0

      var uniquePositions = state.fullPositions.filter(onlyUnique)
      var hasSymbol = typeof fullPosition.data.symbol
      // console.log('filtered Positions', uniquePositions)
      // loop through all positions
      for (i = 0; i < uniquePositions.length; i++) {
        // console.log('unique position symbol at position ' + i + ' ', uniquePositions[i].symbol)
        // console.log('suymbol in full Position', fullPosition.data['symbol'])
        if ((uniquePositions[i].symbol === fullPosition.data['symbol']) && (hasSymbol !== undefined)) {
          // fullPosition.data.longPosition = numeral(fullPosition.data.longPosition).format('0,0')
          // console.log('fullposition.data[valueLong]', fullPosition.data['valueLong'])
          // console.log('state.ALLPrice in getfullpositions ', state.ALLPrice)
          // console.log('full exisitng position before change ', state.fullPositions[i])
          // fullPosition.data['longPosition'] = fullPosition.data['longPosition']
          // fullPosition.data['shortPosition'] = fullPosition.data['shortPosition']

          fullPosition.data['valueLong'] = fullPosition.data['valueLong'] / state.ALLPrice
          fullPosition.data['valueShort'] = fullPosition.data['valueShort'] / state.ALLPrice
          state.fullPositions[i] = fullPosition.data
          state.fullPositions.sort()
          // console.log('existing position updted with new value ', state.fullPositions[i])
          matched = true
          // console.log('found the symbol and match is true', state.fullPositions)
        }
      }
      // console.log('if it contains a symbol in fullPositions contract module ', hasSymbol)
      if ((typeof fullPosition.data.symbol !== typeof undefined)) {
      //  console.log('means it got inside hasSymbol !== undefined')
      } else {
      //  console.log('means it did NOT get inside hasSymbol !== undefined')
      }
      if (!matched && (typeof fullPosition.data.symbol !== typeof undefined)) {
        // console.log('pushed new position ', fullPosition.data)
        // fullPosition.data.longPosition = numeral(fullPosition.data.longPosition).format('0,0')
        fullPosition.data['valueLong'] = fullPosition.data['valueLong'] / state.ALLPrice
        fullPosition.data['valueShort'] = fullPosition.data['valueShort'] / state.ALLPrice

        // console.log('fullposition.data[valueLong]', fullPosition.data['valueLong'])
        // console.log('state.ALLPrice in getfullpositions ', state.ALLPrice)

        state.fullPositions.push(fullPosition.data)
      }
      // console.log('state fullPositions after setFullPositions', state.fullPositions)
    } // end of if fullPosition.data ! = null
  },
  setPositions (state, position) {
    state.positions = position
  },
  allprice (state, allprice) {
    // console.log(' the all price is ', allprice)
    state.ALLPrice = allprice
  },
  lastContractId (state, lastContractId) {
    // console.log('value of last contract id ', lastContractId['property-id'])
    state.lastContractId = lastContractId['property-id']
  }
}

export const contracts = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
