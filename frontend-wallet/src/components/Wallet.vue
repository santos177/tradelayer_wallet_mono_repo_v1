<template>
  <div>
  
    <h3>wallet</h3>
    <div v-bind:key="item.publicAddress" v-for="(item, index) in walletDec">
      <div v-if="currentAddressIndex == index"> <b> {{ item.publicAddress }} </b> </div>
      <div v-on:click='setCurrentAddressIndex(index)' v-else> {{ item.publicAddress }} </div>
    </div>
    <br/>
    <div id='txn-container'>
      <form @submit.prevent='handleSubmit' >
        <div class='form-group'>
          <div> From: {{walletDec[currentAddressIndex].publicAddress}} </div>
        </div>
        <div class='form-group'>
          <label for='toAddress'>to </label>
          <input :value="toAddress" @input="txnFormUpdate" type='text' placeholder='address' name='toAddress' />
        </div>
        <div class='form-group'>
          <label>sats</label>
          <input :value="sats" @input="txnFormUpdate"  type='number' name='sats' />
        </div>
         <div class='form-group'>
           <select>
            <option value="type1">type1</option>
            <option value="type2">type2</option>
            <option value="type3">type3</option>


          </select>
         </div>
         <input type='submit'/>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "Wallet",
  data: () => ({
    showDialog: true
  }),
  computed: {
    ...mapState("wallet", [
      "walletDec",
      "currentAddressIndex",
      "toAddress",
      "sats"
    ])
  },
  methods: {
    ...mapMutations("wallet", ["setCurrentAddressIndex", "setTxnState"]),
    handleSubmit() {},
    txnFormUpdate(e) {
      const { name, value } = e.target;
      this.setTxnState({ key: name, value });
    }
  }
};
</script>

<style scoped>
</style>
