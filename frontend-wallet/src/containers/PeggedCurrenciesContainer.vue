<template>
  <div id="PeggedCurrenciesContainer">
    <div class="md-layout">
      <div class="md-layout-item md-small-hide">
        <md-tabs style="margin: 0px 0px 0px 40px" md-sync-route>
          <md-tab id="tab-summary" md-label="Trading" to="/Summary"></md-tab>
          <md-tab id="tab-dCurrency" md-label="dCurrency" to="/dCurrency"></md-tab>
          <md-tab id="tab-portfolios" md-label="Portfolio" to="/Portfolio"></md-tab>
          <md-tab id="tab-taxes" md-label="Taxes" to="/Taxes"></md-tab>
        </md-tabs>
      </div>
    </div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <md-tabs class="tabs-tight">
        <md-tab id="tab-content-issue" class md-label="Issue">
          <PIssue />
        </md-tab>
        <md-tab id="tab-content-redeem" class md-label="Redeem">
          <PRedeem />
        </md-tab>
      </md-tabs>
    </div>
  </div>
</template>

<script>
import Sankey from "@/components/PeggedCurrencyAlluvial";
import PIssue from "@/components/PIssue";
import PRedeem from "@/components/PRedeem";

export default {
  name: "PeggedCurrencies",
  components: { Sankey, PIssue, PRedeem }
};
</script>

<style>
</style>
