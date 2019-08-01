<template>
  <div class="md-layout">
    <div class="animated jello">
    <md-card>
      <md-card-header>Balances</md-card-header>
      <md-card-content>
        <md-table>
            <md-table-row>
              <md-table-head> Coin</md-table-head>
              <md-table-head> Balance</md-table-head>
            </md-table-row>
            <md-table-row v-for="balance in balances" v-bind:key="balance.name">
              <md-table-cell>{{balance.name}}</md-table-cell>
              <md-table-cell>{{balance.balance}}</md-table-cell>
            </md-table-row>
        </md-table>
      </md-card-content>
    </md-card>
  </div>
  <div>
    <md-card>
      <md-card-header>Deposit Address</md-card-header>
      <md-card-content>
        <md-table>
            <md-table-row>
              <md-table-head>Litecoin Faucets</md-table-head>
            </md-table-row>
            <md-table-row>
              <md-table-cell>http://testnet.litecointools.com/</md-table-cell>
            </md-table-row>
        </md-table>
        <md-table>
            <md-table-row>
              <md-table-head>Testnet Deposit Address</md-table-head>
            </md-table-row>
            <md-table-row>
              <md-table-cell>{{addressGettter}}</md-table-cell>
            </md-table-row>
        </md-table>
      </md-card-content>
    </md-card>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Balances',
  components: {},
  data () {
    return {
      title: 'Balances',
      balances: {}
    }
  },
  computed: {
    ...mapGetters('wallet', ['addressGetter'])
  },
  methods: {
    ...mapActions('pcurrency', ['getBalancePegged'])
  },
  mounted () {
    this.getBalancePegged({'address': this.addressGetter, 'contractID': 7})
      .then((result) => {
        this.balances = result.data
        console.log('balances result', result)
      })
      .catch((err) => {
        console.log('waaaa ', err)
      })
  }
}

</script>

<style>
</style>
