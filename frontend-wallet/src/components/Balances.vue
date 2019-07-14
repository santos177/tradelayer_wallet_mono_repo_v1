<template>
  <div class="md-layout md-gutter md-alignment-top-center">
    <div class="md-layout-item animated jello">
    <md-card>
      <md-card-header>DCurrency Balances</md-card-header>
      <md-card-content>
        <md-table>
            <md-table-row>
              <md-table-head> Coin</md-table-head>
              <md-table-head> Balance</md-table-head>
            </md-table-row>
            <md-table-row v-for="balance in balances" v-bind:key="balance.name">
              <md-table-cell>dUSD</md-table-cell>
              <md-table-cell>{{balance.balance}}</md-table-cell>
            </md-table-row>
        </md-table>
      </md-card-content>
    </md-card>
  </div>
  <div class="md-layout-item">
    <md-card>
      <md-card-header>ALL Balance</md-card-header>
      <md-card-content>
        <md-table>
            <md-table-row>
              <md-table-head> Coin</md-table-head>
              <md-table-head> Balance</md-table-head>
            </md-table-row>
            <md-table-row v-for="balance in balanceALL" v-bind:key="balance.name">
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
              <md-table-head>Testnet Deposit Address</md-table-head>
            </md-table-row>
            <md-table-row>
              <md-table-cell>{{addressGetter}}</md-table-cell>
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
      balances: {},
      balanceALL: {},
      address: ''
    }
  },
  computed: {
    ...mapGetters('user', ['addressGetter'])
  },
  methods: {
    ...mapActions('pcurrency', ['getBalancePegged', 'getBalanceALL'])
  },
  mounted () {
    this.getBalancePegged({'address': this.addressGetter, 'contractID': '10'})
      .then((result) => {
        this.balances = result.data
        console.log('balances result', result)
      })
      .catch((err) => {
        console.log('waaaa ', err)
      })

    this.getBalanceALL({'address': this.addressGetter, 'contractID': 4})
      .then((result) => {
        this.balanceALL = result.data
        console.log('ALL result', result)
      })
      .catch((err) => {
        console.log('waaaa ', err)
      })
  }
}

</script>

<style scoped>
.md-card-header {
  color: #d61d67;
}
</style>
