<template>
  <div class="hello">
    <div class="md-layout">
      <md-card>
        <md-card-content>
          <div class="md-layout-item">
          <md-table v-model="balances" style="margin: 0px 110px 0px; width:140px;">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="Balance" style="height: 14px;" md-sort-by="balance" md-numeric>{{item.balance}}</md-table-cell>
              </md-table-row>
            </md-table>
          </div>
          <md-field>
            <label for="contractID">Contract</label>
            <md-select v-model="contractID" name="contractID" id="contractID">
              <md-option value="5">dUSD</md-option>
            </md-select>
          </md-field>

          <md-field style=" margin:0px -50px; width:370px;">
            <label for="fromaddress">From Address: </label>
            <md-select v-model="fromaddress" name="fromaddress" id="fromaddress" style="width:370px;">
              <md-option :value="addressGetter" style=" padding:30px 0px 0px 0px; font-size: 12px; width:370px;">{{addressGetter}}</md-option>
            </md-select>
          </md-field>

          <md-field style="margin:0px -50px; width:370px;">
            <label for="toaddress">To Address:</label>
            <md-input style="font-size: 14px;" v-model="toaddress"></md-input>
          </md-field>

          <md-field style="margin:20px 0px;">
            <label for="quantity">Quantity</label>
            <md-input v-model="quantity"></md-input>
          </md-field>

          <div>
            <md-button class="md-raised md-accent" style="margin:0px 0px;" v-on:click="sendPegged">Send</md-button>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PSend',
  data () {
    return {
      quantity: 0,
      toaddress: '',
      fromaddress: '',
      contractID: '',
      balances: {}
    }
  },
  computed: {
    ...mapGetters('wallet', ['addressGetter'])
  },
  created () {
    this.getBalancePegged({'address': this.addressGetter, 'contractID': 6})
      .then((result) => {
        this.balances = result.data
        // console.log('balances result', result)
      })
      .catch((err) => {
        console.log('waaaa ', err)
      })
  },
  methods: {
    ...mapActions('pcurrency', ['sendPeggedCurrency', 'getBalancePegged']),
    sendPegged (e) {
      const { toaddress, fromaddress, quantity, contractID } = this
      // console.log('toaddress is ', toaddress)
      this.sendPeggedCurrency({'toAddress': toaddress, 'fromAddress': fromaddress, 'amount': quantity, 'contractID': contractID}).then((data) => {
        alert('this is what happened with your send : ', data)
      })
        .catch((err) => {
          console.log('problem with send pegged currency', err)
          alert(err)
        })
      // alert('Pegg currency successfully created')
    }
  }
}
</script>
<style scoped>
.md-card {
  margin: 10px;
  padding:10px;
  border-radius: 50%;
  width: 440px;

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
