<template>
  <div class="hello">
    <div class="md-layout">
      <md-card>
        <md-card-content>
          <div class="md-layout-item">
          <md-table v-model="balances" style="margin: 0px 60px 0px; width:140px;">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="Balance" style="height: 14px;" md-sort-by="balance" md-numeric>{{item.balance}}</md-table-cell>
              </md-table-row>
            </md-table>
          </div>
          <md-field>
            <label for="name">dCurrency</label>
            <md-select v-model="name" name="name" id="name">
              <md-option value="dUSD">dUSD</md-option>
            </md-select>
          </md-field>

          <md-field>
            <label for="amount">Amount</label>
            <md-input v-model="amount"></md-input>
          </md-field>

          <div>
            <md-button class="md-raised md-accent" v-on:click="redeemPegCurrency">Redeem</md-button>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PRedeem',
  data () {
    return {
      propertyID: '',
      amount: '',
      address: this.addressGetter,
      balances: {}
    }
  },
  computed: {
    ...mapGetters('user', ['addressGetter']),
    ...mapGetters('contracts', ['selectedContract'])
  },
  created () {
    // reset login status
    // this.getbalance()
    // reset login status
    this.getBalancePegged({'address': this.addressGetter, 'contractID': 'ALL/USD'})
      .then((result) => {
        this.balances = result.data
        // console.log('balances result', result)
      })
      .catch((err) => {
        console.log('waaaa ', err)
      })
  },
  methods: {
    ...mapActions('pcurrency', ['redeemPeggedCurrency', 'getBalancePegged']),
    redeemPegCurrency (e) {
      // console.log('address is : ', this.addressGetter)
      this.redeemPeggedCurrency({'redeemAddress': this.addressGetter, 'name': this.name, 'amount': this.amount, 'contractID': 'ALL/USD'})
        .then((data) => {
          alert('Pegg currency redeemed')
        })
        .catch((err) => {
          alert('wwhhhaaaaa ', err)
        })
    }
  }
}
</script>
<style scoped>
.md-card {
  margin: 20px;
  padding:10px;
  border-radius: 50%;
  width: 350px;
}

.md-field {
  margin: 30px;
  width: 170px;
  display: inline-block;
}

.md-button {
  height: 80px;
  border: 1px;
  border-radius: 50%;
}
</style>
