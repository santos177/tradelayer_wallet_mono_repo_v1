<template>
  <div>
   
   <h1>wallet</h1>
     <div v-bind:key="item.publicAddress" v-for="(item, index) in walletDec">
        <div v-if="currentAddressIndex == index"> <b> {{ item.publicAddress }} </b> </div>
        <div v-on:click='setCurrentAddressIndex(index)' v-else> {{ item.publicAddress }} </div> 
   </div>
  </div>
</template>

<script>

import { mapGetters, mapMutations, mapState} from 'vuex'


export default {
  name: 'Wallet',
  data: () => ({
    showDialog: true,
  }),
  computed :{
    ...mapState('wallet', ['walletDec', 'currentAddressIndex'])
  }, 
  methods: {
    ...mapMutations('wallet', ['setCurrentAddressIndex'])
  }
}
</script>

<style scoped>

</style>
