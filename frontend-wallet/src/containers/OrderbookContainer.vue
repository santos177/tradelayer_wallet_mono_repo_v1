<template>
  <div id="OrderbookContainer">
    <div class="md-layout md-gutter md-alignment-center-space-between">
      <div class="md-layout-item md-small-hide">
        <md-tabs md-sync-route>
          <md-tab id="tab-summary" md-label="Trading" to="/Summary"></md-tab>
          <md-tab id="tab-dCurrency" md-label="dCurrency" to="/dCurrency"></md-tab>
          <md-tab id="tab-portfolios" md-label="Portfolio" to="/Portfolio"></md-tab>
          <md-tab id="tab-account" md-label="Send" to="/HistoricalTrades"></md-tab>
          <md-tab id="tab-charts" md-label="Charts" to="/Charts"></md-tab>
          <md-tab id="tab-taxes" md-label="Taxes" to="/Taxes"></md-tab>
          <md-tab id="tab-validators" md-label="Validators" to="/Validators"></md-tab>
        </md-tabs>
      </div>
        </div>
         <md-table md-card>
          <OrderBook/>
        </md-table>
  </div>
</template>

<script>
import OrderBook from '@/components/OrderBook'

export default {
  name: 'OrderbookContainer',
  components: {OrderBook}
}
</script>

<style>
</style>
