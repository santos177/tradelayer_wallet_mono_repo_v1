<template>
  <div class="hello">
    <div class="md-layout">
      <div class="md-layout-item">
      <md-card>
        <md-card-content>
          <md-field>
            <md-tooltip md-direction="right">First, select a contract</md-tooltip>
            <label for="selectedContract">Contract</label>
            <md-select v-model="peggedContract" @md-selected="peggedContractSelected($event)">
              <md-option value="ALL/USD">ALL/USD</md-option>
            </md-select>
          </md-field>
          <md-field>
            <label for="name">Name</label>
            <md-select v-model="name" name="name" id="name">
              <md-option value="dUSD">dUSD</md-option>
            </md-select>
          </md-field>

          <md-field>
            <label for="quantity">Quantity</label>
            <md-input v-model="quantity"></md-input>
          </md-field>

          <div>
            <md-button class="md-raised md-accent" v-on:click="createPegCurrency">Create</md-button>
          </div>
        </md-card-content>
      </md-card>
        </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'PIssue',
  data () {
    return {
      name: '',
      quantity: '',
      address: this.addressGetter,
      maxPegged: 0,
      peggedContract: ''
    }
  },
  computed: {
    ...mapGetters('user', ['addressGetter']),
    ...mapGetters('contracts', ['selectedContractGetter']),
    ...mapState('contracts', ['lastTXID'])
  },
  created () {
    // reset login status
    this.maxPeggedCurrency({'fromAddress': this.addressGetter, 'contractID': '10'})
      .then((result) => {
        // console.log('max pegged currency result ', result)
        this.maxPegged = JSON.parse(result.data['maxPegged'])
        this.maxPegged = this.maxPegged['maxPegged']
        console.log('maxPegged in PIssue ', this.maxPegged)
      })
      .catch((err) => {
        console.log(' there was a problem with max Pegged Currency service', err)
        console.log('maxPegged in PIssue ', err.toString())
      })
  },
  methods: {
    ...mapActions('pcurrency', ['createPegCurrencies', 'maxPeggedCurrency']),
    createPegCurrency (e) {
      this.createPegCurrencies({'name': this.name, 'quantity': this.quantity, 'address': this.address, 'contractID': '10'})
      alert('Pegg currency successfully created')
    },
    peggedContractSelected (e) {
      console.log('this pegged contract ', this.peggedContract)
      this.maxPeggedCurrency({'fromAddress': this.addressGetter, 'contractID': this.peggedContract.toString()})
        .then((result) => {
          // console.log('max pegged currency result ', result)
          this.maxPegged = JSON.parse(result.data['maxPegged'])
          this.maxPegged = this.maxPegged['maxPegged']
          console.log('maxPegged in PIssue ', this.maxPegged)
        })
        .catch((err) => {
          console.log(' there was a problem with max Pegged Currency service', err)
          console.log('maxPegged in PISsue ', err.toString())
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
  width: 410px;
}

.md-field {
  margin: 30px 80px;
  width: 170px;
  display: block;
}

.md-button {
  height: 80px;
  border: 1px;
  border-radius: 50%;
}
</style>
