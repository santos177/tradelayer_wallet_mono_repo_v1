<template>
  <div id="OrderbookBuy" style="">
  <md-table v-model="buy" style="height: 305px; margin: -30px 0px 0px; padding:0px;">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Price" style="height: 12px;" md-sort-by="price" class="mycolors" md-numeric>{{item.price}}</md-table-cell>
          <md-table-cell md-label="Quantity" style="height: 12px;" md-sort-by="quantity" md-numeric>{{item.quantity}}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'OrderbookBuy',
  data () {
    return {
    }
  },
  computed: {
    ...mapState('orderbook', ['buy', 'sell']),
    ...mapState('contracts', ['selectedContract'])
  },
  created () {
    // reset login status
    this.handleorderBook()
  },
  methods: {
    ...mapActions('orderbook', ['getOrderBook']),
    handleorderBook (e) {
      // this.getOrderBook(this.selectedContract)
      // let that = this
      // setInterval(() => { that.getOrderBook(this.selectedContract) }, 5000)
    }
  }
}
</script>

<style scoped>
.mycolors {
  color: #17a536;
}
</style>
