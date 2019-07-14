<template>
  <div>
    <md-table-toolbar>
      <md-card-header>Orderbook</md-card-header>
    </md-table-toolbar>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100 md-medium-size-50 md-large-size-50">
        <BuySell/>
      </div>
      <div class="md-layout-item md-small-size-100 md-medium-size-50 md-large-size-50" style="">
        <md-table  md-card style="height:580px !important;">
          <md-table-row style="height:280px !important;">
            <md-tabs style="height:280px !important;">
              <md-tab id="tab-orderbookbuy" style="" md-label="Buy">
                  <OrderbookBuy/>
              </md-tab>
            </md-tabs>
            </md-table-row>
            <md-table-row style="">
              <md-tabs style="">
                <md-tab id="tab-orderbooksell" md-label="Sell">
                  <OrderbookSell/>
                </md-tab>
             </md-tabs>
           </md-table-row>
        </md-table>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import OrderbookBuy from '@/components/OrderbookBuy'
import OrderbookSell from '@/components/OrderbookSell'
import BuySell from '@/components/BuySell'

export default {
  name: 'Orderbook',
  components: {OrderbookBuy, OrderbookSell, BuySell},
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
    handleorderBook (e) {

    }
  }
}
</script>

<style scoped>
.md-tabs {
  height:280px !important;
}
.md-tab {
  height:280px !important;
}
.md-card-header {
  color: #d61d67;
}
</style>
