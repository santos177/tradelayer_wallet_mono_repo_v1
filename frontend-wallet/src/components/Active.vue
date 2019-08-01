<template>
  <div id="Active" class="md-layout" >
     <md-table v-model="activesGetter" md-card style="">
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Price" md-sort-by="price" style="height: 12px;" md-numeric>{{item.effectiveprice}}
            </md-table-cell>
            <md-table-cell md-label="Contracts" md-sort-by="amountforsale" style="height: 12px;" md-numeric>{{item.amountforsale}}
            </md-table-cell>
            <md-table-cell md-label="Transaction ID" md-sort-by="txid" style="height: 12px; margin: 0px;" md-numeric>
             <md-button v-bind:href="'https://chain.so/tx/LTCTEST/' + item.txid" style="margin: 0px; height: 12px" target="_blank">TX ID
                <md-tooltip md-direction="top">
                  <a v-bind:href="'https://chain.so/tx/LTCTEST/' + item.txid" target="_blank">
                    {{item.txid}}
                  </a>
                </md-tooltip>
            </md-button>
            </md-table-cell>
            <md-table-cell md-label="Cancel?" >
              <button @click="handleSingleCancel(item)" style="font-size: 12px; color: #fff; background: #810303">Cancel
              </button>
            </md-table-cell>

        </md-table-row>
    </md-table>
    <md-table md-card>
      <md-table-cell>
        <button @click="handleCancelTrades" style="font-size: 12px; color: #fff; background: #810303">Cancel All Open Orders
        </button>
      </md-table-cell>
    </md-table>
  </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex'

export default {
  name: 'Active',
  data () {
    return {
      msg: 'Active Transactions by Address'
    }
  },
  computed: {
    ...mapGetters('wallet', ['addressGetter']),
    ...mapGetters('contracts', ['activebuysbyaddressGetter', 'activesellsbyaddressGetter', 'activesGetter']),
    ...mapState('contracts', ['selectedContract'])
  },
  created () {
    this.handleGetTransactions()
  },
  methods: {
    ...mapActions('contracts', ['postActiveTradesbyAddress', 'postCancelSingleActiveTrade', 'postCancelTrades']),
    handleGetTransactions (e) {
      console.log('firing handle get active transactions')
      var data = {
        contractID: this.selectedContract,
        address: this.addressGetter
      }
      this.postActiveTradesbyAddress(data)
      setInterval(() => { this.postActiveTradesbyAddress(data) }, 10000)
    },
    handleSingleCancel (myitem) {
      console.log('firing popup with this data ', myitem)
      var data = {
        senderAddress: myitem.address,
        block: myitem.block,
        idx: myitem.idx
      }
      console.log('cancel data is', data)
      this.postCancelSingleActiveTrade(data)
        .then((myCancel) => {
          console.log('successful cancel ', myCancel)
          this.postActiveTradesbyAddress(this.selectedContract, this.addressGetter)
        })
        .catch((err) => {
          console.log('waaaa single cancel no work ', err)
        })
    },
    handleCancelTrades (e) {
      this.postCancelTrades()
    }
  }
}

</script>

<style scoped>

</style>
