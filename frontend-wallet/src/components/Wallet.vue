<template>
  <div>
  
    <h3>addresses</h3>
    <div v-bind:key="item.publicAddress" v-for="(item, index) in walletDec">
      <div v-if="currentAddressIndex == index"> <b> {{ item.publicAddress }} </b> </div>
      <div v-on:click='setCurrentAddress(index)' v-else> {{ item.publicAddress }} </div>
    </div>
    <br/>
    <div>balance {{currentAddressLTCBalance}} </div>
    <button v-on:click='updateCurrentUTXOs' >update </button>
    <div id='txn-container'>
      <h3>txn</h3>
      <form @submit.prevent='handleSubmit'>
        <div class='form-group'>
          <div> From: {{walletDec[currentAddressIndex].publicAddress}} </div>
        </div>
        <div class='form-group'>
          <label for='toAddress'>to </label>
          <input :value="toAddress" @input="txnFormUpdate" type='text' placeholder='address' name='toAddress' />
        </div>
        <div class='form-group'>
          <label>sats</label>
          <input :value="sats" @input="txnFormUpdate" type='number' name='sats' />
        </div>
        <div class='form-group'>
          <select v-model='txnType'>
              <option :value="this.txnTypeEnum.LTC_SEND">Send LTC</option>
              <option :value="this.txnTypeEnum.BUY_CONTRACT">Buy</option>
              <option :value="this.txnTypeEnum.SELL_CONTRACT">Sell</option>
            </select>
        </div>
        <input type='submit' />
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { createTxn, signTxn } from "../../lib/wallet.js";
import { walletService } from "../services";
const {txnTypeEnum} = walletService
export default {
  name: "Wallet",
  data: () => ({
    showDialog: true,
    txnTypeEnum
  }),
  computed: {
    ...mapState("wallet", [
      "walletDec",
      "currentAddressIndex",
      "toAddress",
      "sats",
      "utxoArray",
      "currentTxnType"
    ]),
    ...mapGetters("wallet", ["addressGetter", "currentAddressLTCBalance"]),
    txnType: {
      get(){
        return this.currentTxnType
      }, 
      set(value){
        this.setCurrentTxnType(value)
      }
    }
  },
  methods: {
    ...mapMutations("wallet", ["setTxnState", 'setCurrentTxnType']),
    ...mapActions("wallet", ["setCurrentAddress", "updateCurrentUTXOs"]),
    handleSubmit() {
      if(!confirm('Are you sure you want to sign and broadcast this transaction')) return
      let { utxoArray, toAddress, sats, walletDec, currentAddressIndex } = this;

      let { publicAddress, wifKey } = walletDec[currentAddressIndex];

      const txn = createTxn(utxoArray, toAddress, +sats, publicAddress);
      const signedTxn = signTxn(txn, wifKey).serialize()
      
      walletService.sendRawTxn(signedTxn).then((data)=>{
        console.log(data);
      })
    },
    txnFormUpdate(e) {
      const { name, value } = e.target;
      this.setTxnState({
        key: name,
        value
      });
    }
  }
};
</script>

<style scoped>
</style>
