<template>
  <div class="md-layout" >
    <md-table md-card style="width:100%">
    <md-table-row v-if="tokenForSale">
        <md-table-cell md-label="Symbol" >{{tokenForSale.name}}</md-table-cell>
        <md-table-cell md-label="Symbol" >{{tokenForSale.amount}}</md-table-cell>
    </md-table-row>
    <md-table-row v-if="tokenDesired">
        <md-table-cell md-label="Symbol" >{{tokenDesired.name}}</md-table-cell>
        <md-table-cell md-label="Symbol" >{{tokenDesired.amount}}</md-table-cell>
    </md-table-row>
    </md-table>
  </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex'

export default {
  name: 'ContractBalances',
  data () {
    return { 
        tokenForSale: {
          name: '',
          amount: 0
        },
        tokenDesired: {
          name: '',
          amount: 0
        },
    }
  },
  computed: {    
      ...mapGetters("contracts", ["selectedContractGetter"])
 },
 watch: {
    selectedContractGetter: {
      immediate: true,
      handler() {
          this.asyncGetAmountsHandler()

      }
    }
  },
  created () { },
  methods: {
    ...mapActions("contracts", ["asyncGetTokenAmount", "asyncGetTokenName"]),

    async asyncGetAmountsHandler(){
        const { propsIdDesired, propsIdForSale } = this.selectedContractGetter;
        this.tokenDesired.name = await this.asyncGetTokenName(propsIdDesired)
        this.tokenDesired.amount = await this.asyncGetTokenAmount(propsIdDesired)

        this.tokenForSale.name = await this.asyncGetTokenName(propsIdForSale)
        this.tokenForSale.amount = await this.asyncGetTokenAmount(propsIdForSale)

    }
  }
}

</script>

<style scoped>

</style>
