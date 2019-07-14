<template>
  <div id="CreateAccountWallet">
    <md-table>
      <md-table-head>
        <md-tabs md-sync-route>
          <md-tab id="tab-createwallet" md-label="Create Wallet" to="/CreateWallet">
          </md-tab>
        </md-tabs>
      </md-table-head>
      <md-table-row>
        <md-table-cell><CreateWallet/></md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import CreateWallet from '@/components/CreateWallet'

export default {
  name: 'CreateAccountWallet',
  components: {CreateWallet}
}
</script>

<style>
</style>
