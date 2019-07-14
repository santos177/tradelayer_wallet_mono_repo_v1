<template>
  <div id="BuySellContainer">
     <div class="md-layout md-gutter md-alignment-center-space-between">
       <div class="md-layout-item md-small-hide">
         <md-tabs md-sync-route>
           <md-tab id="tab-summary" md-label="Trading" to="/Summary"></md-tab>
           <md-tab id="tab-dCurrency" md-label="dCurrency" to="/dCurrency"></md-tab>
           <md-tab id="tab-portfolios" md-label="Portfolio" to="/Portfolio"></md-tab>
           <md-tab id="tab-charts" md-label="Charts" to="/Charts"></md-tab>
           <md-tab id="tab-taxes" md-label="Taxes" to="/Taxes"></md-tab>
           <md-tab id="tab-validators" md-label="Validators" to="/Validators"></md-tab>
         </md-tabs>
       </div>
    </div>
    <div class="md-layout md-gutter md-alignment-top-center">
       <md-tabs class="tabs-tight">
        <md-tab id="tab-content-issue" class="" md-label="Wallet">
               <Balances/>
        </md-tab>
       </md-tabs>
   </div>
</div>
</template>

<script>
// import buysell panel
import Balances from '@/components/Balances'
import Sankey from '@/components/PeggedCurrencyAlluvial'

export default {
  name: 'BuySellContainer',
  components: {Balances, Sankey}
}
</script>

<style>
</style>
