<template>
  <div id="HistoricalTradesContainer">
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
    <div>
      <HistoricalTradesbyAddress/>
  </div>
</div>
</template>

<script>
// import buysell panel
import HistoricalTradesbyAddress from '@/components/HistoricalTradesbyAddress'
import BuySell from '@/components/BuySell'

export default {
  name: 'HistoricalTradesbyAddressContainer',
  components: {HistoricalTradesbyAddress, BuySell}
}
</script>

<style>
</style>
