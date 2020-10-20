<template>
  <md-table style="width: 400px;" md-card>
   <md-card-header>Your Recent Trades</md-card-header>
     <md-tabs style="margin: -20px 0px 0px;">
      <md-tab id="tab-recent"  md-label="Recent">
        <md-table v-model="recentByAddressGetter" style="margin: -20px 0px 0px;">
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Price" md-sort-by="price" style="height: 14px;" md-numeric>{{item.price}}
            </md-table-cell>
            <md-table-cell md-label="Contracts" md-sort-by="amount_traded" style="height: 14px;" md-numeric>{{item.amount_traded}}
            </md-table-cell>
            <md-table-cell md-label="Transaction ID" md-sort-by="taker_txid" style="height: 14px;">
             <md-button v-bind:href="'https://chain.so/tx/LTCTEST/' + item.taker_txid" style="height: 10px" target="_blank">TX ID
                <md-tooltip md-direction="left">
                  <a v-bind:href="'https://chain.so/tx/LTCTEST/' + item.taker_txid" target="_blank">
                    {{item.taker_txid}}
                  </a>
                </md-tooltip>
            </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </md-tab>
    </md-tabs>
  </md-table>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'HistoricalTrades',
  data () {
    return {
      txshow: false,
      tooltipActive: false,
      taker_txid: null
    }
  },
  computed: {
    ...mapState('orderbook', ['recent']),
    ...mapGetters('contracts', ['transactionsGetter', 'selectedContractGetter']),
    ...mapGetters('orderbook', ['recentByAddressGetter']),
    ...mapGetters('wallet', ['addressGetter'])
  },
  mounted () {
    this.handleTrades()
  },
  methods: {
    ...mapActions('orderbook', ['getRecentTrades', 'postRecentTradesbyAddress']),
    handleTrades () {
      // var data = {
      //   contractID: this.selectedContractGetter,
      //   address: this.addressGetter
      // }
      // this.postRecentTradesbyAddress(data)
      // console.log('recent trades by address are ', this.recentByAddressGetter)
      // setInterval(() => {
      //   data = {
      //     contractID: this.selectedContractGetter,
      //     address: this.addressGetter
      //   }
      //   this.postRecentTradesbyAddress(data)
      // }, 2500)
    }
  }
}
</script>

<style scoped>
.mycolors-buy {
  color: #fff;
  background-color: #17a536;
}
.mycolors-sell {
  color: #fff;
  background-color: #d61d67;
}
.md-card-header {
  color: #d61d67;
}

.a {
  color: #FFF;
}

.button {
  border-radius: 50%;
  height: 10px;
  width: 10px;
  border: 1px solid #ddd;
  padding: 10px 10px;
}

.md-table-toolbar {
  padding: 0px 0px 0px 00px;
  margin: -10px 0px -20px 0px;
  text-align: center;
  font-size: 16px;

}

</style>
