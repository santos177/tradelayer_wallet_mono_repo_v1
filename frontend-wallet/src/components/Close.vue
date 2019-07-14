<template>
  <div class="md-layout" >
    <md-table class="md-scrollbar" v-model="fullPositionsGetter" md-card>
          <md-table-row  slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Symbol" md-sort-by="symbol" style="width:150px;">{{item.symbol}}</md-table-cell>
            <md-table-cell md-label="Long Position"  md-sort-by="longPosition" style="color: #17a536; width:150px;">{{item.longPosition | formatNumber}}</md-table-cell>
            <md-table-cell md-label="Short Position"  md-sort-by="shortPosition" style="color: #d61d67; width:150px;">{{item.shortPosition | formatNumber}}</md-table-cell>
            <md-table-cell md-label="Value Long" md-sort-by="valueLong" style="color: #17a536; width:150px;">{{item.valueLong | formatNumber}}</md-table-cell>
            <md-table-cell md-label="Value Short" md-sort-by="valueShort" style="color: #d61d67; width:150px;">{{item.valueShort | formatNumber}}</md-table-cell>
            <md-table-cell v-if="item.positiveupnl > 0" class="mycolors-buy" sstyle="" md-label="UPNL" >{{item.positiveupnl | formatNumber8Decimals}}</md-table-cell>
            <md-table-cell v-else-if="item.negativeupnl > 0" class="mycolors-sell" style="" md-label="UPNL" >{{item.negativeupnl | formatNumber8Decimals}}</md-table-cell>
            <md-table-cell v-else class="" style="" md-label="UPNL" >{{item.negativeupnl | formatNumber8Decimals}}</md-table-cell>
            <md-table-cell v-if="item.positivepnl > 0" class="mycolors-buy" style="" md-label="PNL" >{{item.positivepnl | formatNumber8Decimals}}</md-table-cell>
            <md-table-cell v-else-if="item.negativepnl > 0" class="mycolors-sell" style="" md-label="PNL" >{{item.negativepnl | formatNumber8Decimals}}</md-table-cell>
            <md-table-cell v-else class="" style="" md-label="PNL" >{{item.negativepnl | formatNumber8Decimals}}</md-table-cell>
          </md-table-row>
    </md-table>
  </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex'

export default {
  name: 'Pending',
  data () {
    return {
      msg: 'Positions by contract'
    }
  },
  computed: {
    ...mapGetters('user', ['walletBlobGetter', 'addressGetter']),
    ...mapGetters('contracts', ['fullPositionsGetter']),
    ...mapState('contracts', ['fullPositions', 'selectedContract']),
    ...mapState('user', ['walletBlob'])
  },
  created () {
    this.handleGetPositions()
  },
  methods: {
    ...mapActions('contracts', ['getFullPositions', 'postALLPrice']),
    handleGetPositions (e) {
      var data = {
        account: this.addressGetter,
        contractID: this.selectedContract
      }
      // console.log('data on positions ', data)
      // console.log('  full positions state', this.fullPositions)
      // console.log('  full positions symbol', this.fullPositions.symbol)
      this.getFullPositions(data)
      setInterval(() => { this.getFullPositions(data) }, 2000)
      // }
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
