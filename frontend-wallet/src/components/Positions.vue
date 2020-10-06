<template>
  <div class="md-layout" >
    <md-table class="md-scrollbar" v-model="fullPositionsGetter" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Symbol" md-tooltip="Contract Abbreviation" md-sort-by="symbol" style="width:150px;">{{item.symbol}}</md-table-cell>
        <md-table-cell md-label="Long" md-tooltip="Aggregate # of Contracts, if Long" md-sort-by="longPosition" style="color: #17a536; width:150px;">{{item.longPosition | formatNumber}}</md-table-cell>
        <md-table-cell md-label="Short" md-tooltip="Aggregate # of Contracts, if Short" md-sort-by="shortPosition" style="color: #d61d67; width:150px;">{{item.shortPosition | formatNumber}}</md-table-cell>
        <md-table-cell md-label="Long Value" md-tooltip="Aggregate Value of Contracts, if Long" md-sort-by="valueLong" style="color: #17a536; width:150px;">{{item.valueLong | formatNumber}}</md-table-cell>
        <md-table-cell md-label="Short Value" md-tooltip="Aggregate Value of Contracts, if Short" md-sort-by="valueShort" style="color: #d61d67; width:150px;">{{item.valueShort | formatNumber}}</md-table-cell>
        <md-table-cell md-label="UPNL" md-tooltip="Unrealized Profit and Loss" v-if="item.positiveupnl > 0" class="mycolors-buy" sstyle=""  >{{item.positiveupnl | formatNumber8Decimals}}</md-table-cell>
        <md-table-cell md-label="UPNL" md-tooltip="Unrealized Profit and Loss" v-else-if="item.negativeupnl > 0" class="mycolors-sell" style=""  >{{item.negativeupnl | formatNumber8Decimals}}</md-table-cell>
        <md-table-cell md-label="UPNL" md-tooltip="Unrealized Profit and Loss" v-else class="" style=""  >{{item.negativeupnl | formatNumber8Decimals}}</md-table-cell>
        <md-table-cell md-label="PNL" md-tooltip="Realized Profit and Loss" v-if="item.positivepnl > 0" class="mycolors-buy" style=""  >{{item.positivepnl | formatNumber8Decimals}}</md-table-cell>
        <md-table-cell md-label="PNL" md-tooltip="Realized Profit and Loss" v-else-if="item.negativepnl > 0" class="mycolors-sell" style=""  >{{item.negativepnl | formatNumber8Decimals}}</md-table-cell>
        <md-table-cell md-label="PNL" md-tooltip="Realized Profit and Loss" v-else class="" style=""  >{{item.negativepnl | formatNumber8Decimals}}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex'

export default {
  name: 'Positions',
  data () {
    return {
      msg: 'Positions by contract'
    }
  },
  computed: {
    ...mapGetters('contracts', ['fullPositionsGetter', 'selectedContractGetter']),
    ...mapState('contracts', ['fullPositions', 'selectedContract']),
    ...mapGetters('wallet', ['addressGetter'])
  },
  created () {
    this.handleGetPositions()
  },
  methods: {
    ...mapActions('contracts', ['getFullPositions', 'postALLPrice']),
    handleGetPositions (e) {
      // console.log('this is the selected contract in fullpositions ', this.selectedContract)
      // var data = {
      //   account: this.addressGetter,
      //   contractID: this.selectedContractGetter
      // }
      // // console.log('data on positions ', data)
      // // console.log('  full positions state', this.fullPositions)
      // // console.log('  full positions symbol', this.fullPositions.symbol)
      // this.getFullPositions(data)
      // // console.log('this is the selected contract in fullpositions ', this.selectedContractGetter)
      // setInterval(() => {
      //   data = {
      //     account: this.addressGetter,
      //     contractID: this.selectedContract}
      //   // console.warn('data in full positions', data)
      //   this.getFullPositions(data)
      // }, 2000)
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
</style>
