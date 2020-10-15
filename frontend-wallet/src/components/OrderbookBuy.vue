<template>
  <div id="OrderbookBuy" style="" v-if="buy && buy.length > 0">
  <md-table v-model="buy" style="height: 305px; margin: -30px 0px 0px; padding:0px;">
      <md-table-row slot="md-table-row" v-on:click="onRowClick(item)" class="orderBookRow" slot-scope="{ item }">
          <md-table-cell md-label="Price" style="height: 12px;" md-sort-by="price" class="mycolors" md-numeric>{{item.price}}</md-table-cell>
          <md-table-cell md-label="Quantity" style="height: 12px;" md-sort-by="quantity" md-numeric>{{item.quantity}}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
  <span v-else>Empty list</span>
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
    ...mapActions('orderbook', ['getOrderBook','selectOrder']),
    handleorderBook (e) {
      // this.getOrderBook(this.selectedContract)
      // let that = this
      // setInterval(() => { that.getOrderBook(this.selectedContract) }, 5000)
    },
    onRowClick(item) {
      this.selectOrder(item)
    }
  }
}
</script>

<style scoped>
.mycolors {
  color: #17a536;
}
.orderBookRow {
  cursor: pointer;
}
.orderBookRow:hover {
  background: gray;
}
</style>
