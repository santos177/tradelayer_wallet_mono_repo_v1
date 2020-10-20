<template>
  <div id="OrderbookSell" v-if="sell && sell.length > 0">
    <md-table v-model="sell" style="height: 300px; margin: -30px 0px 0px;">
      <md-table-row slot="md-table-row" v-on:click="onRowClick(item)" class="orderBookRow" slot-scope="{ item }">
        <md-table-cell  md-label="Price" md-sort-by="price" style="height: 14px;" class="mycolors" md-numeric>{{item.price}}</md-table-cell>
        <md-table-cell md-label="Quantity" md-sort-by="quantity" style="height: 14px;" md-numeric>{{item.quantity}}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
  <span v-else>Empty list</span>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'OrderbookSell',
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
  },
  methods: {
    ...mapActions('orderbook', ['getOrderBook', 'getPairOrderBook', 'selectOrder']),
    handleorderBook (e) {
      // this.getOrderBook(this.selectedContract)
      // let that = this
      // setInterval(() => { that.getOrderBook(this.selectedContract) }, 4500)
    },
    onRowClick(item) {
      this.selectOrder(item)
    }
  }
}
</script>
<style scoped>

.mycolors {
  color: #d61d67;;
}
.orderBookRow {
  cursor: pointer;
}
.orderBookRow:hover {
  background: gray;
}
</style>
