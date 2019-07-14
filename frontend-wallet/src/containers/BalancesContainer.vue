<template>
  <div id="BalancesContainer">
     <div class="md-layout md-gutter md-alignment-center-space-between">
      <div class="md-layout-item">
        <md-table>
          <md-table-head>
            <md-tabs md-sync-route>
              <md-tab id="tab-balances" md-label="Wallet" to="/Balances">
              </md-tab>
            </md-tabs>
          </md-table-head>
          <md-table-row>
            <md-table-cell>
              <Balances/>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>
</div>
</template>

<script>
// import buysell panel
import Balances from '@/components/Balances'

export default {
  name: 'BalancesContainer',
  components: {Balances}
}
</script>

<style>
</style>
