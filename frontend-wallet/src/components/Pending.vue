<template>
  <div id="Pending" class="md-layout" >
      <md-table v-model="pendingByAddressGetter" md-card style="">
           <md-table-row slot="md-table-row" slot-scope="{ item }">
             <md-table-cell md-label="Transaction ID" md-sort-by="txid" style="height: 12px; margin: 0px;" md-numeric>
              <md-button v-bind:href="'https://chain.so/tx/LTCTEST/' + item.txid" style="margin: 0px; height: 12px" target="_blank">TX ID
                 <md-tooltip md-direction="top">
                   <a v-bind:href="'https://chain.so/tx/LTCTEST/' + item.txid" target="_blank">
                     {{item.txid}}
                   </a>
                 </md-tooltip>
             </md-button>
             </md-table-cell>
         </md-table-row>
    </md-table>
  </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex'

export default {
  name: 'Pending',
  data () {
    return {
      msg: 'Transactions by Address'
    }
  },
  computed: {
    ...mapGetters('wallet', ['addressGetter']),
    ...mapGetters('contracts', ['transactionsGetter', 'pendingByAddressGetter']),
    ...mapState('contracts', ['selectedContract'])
  },
  created () {
    this.handleGetTransactions()
  },
  methods: {
    ...mapActions('contracts', ['postTransactionsbyAddress', 'getPendingByAddress']),
    handleGetTransactions (e) {
      console.log('firing handle get transactions')
      var data = {
        address: this.addressGetter,
        contractID: this.selectedContract}

      this.getPendingByAddress(data)
      setInterval(() => {
        data = {
          address: this.addressGetter,
          contractID: this.selectedContract}
        this.getPendingByAddress(data)
      }, 2000)
    }
  }
}

</script>

<style scoped>

</style>
