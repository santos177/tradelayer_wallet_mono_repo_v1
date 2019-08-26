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

        <div v-if="txnType === txnTypeEnum.LTC_SEND" >
          <div class='form-group'>
              <label for='toAddress'>to </label>
              <input :value="toAddress" @input="txnFormUpdate" type='text' placeholder='address' name='toAddress' />
          </div>
          <div class='form-group'>
            <label>sats</label>
            <input :value="sats" @input="txnFormUpdate" type='number' name='sats' />
          </div>
        </div>

        <div v-else-if="txnType === txnTypeEnum.BUY_CONTRACT || txnType === txnTypeEnum.SELL_CONTRACT" >
            <div class='form-group'>
            <input :value="quantity" @input="txnFormUpdate" type='number' placeholder='quantity' name='quantity' /> 
            <input :value="price" @input="txnFormUpdate" type='number' placeholder='price' name='price' /> 
            </div>
        </div>
        
      <div v-else-if="txnType === txnTypeEnum.ISSUE_CURRENCY|| txnType === txnTypeEnum.REDEEM_CURRENCY" >
            <div class='form-group'>
            <input :value="contract" @input="txnFormUpdate" type='text' placeholder='contract' name='contract' /> 
            <input :value="name" @input="txnFormUpdate" type='text' placeholder='name' name='name' /> 
            <input :value="quantity" @input="txnFormUpdate" type='number' placeholder='quantity' name='quantity' /> 
            </div>
        </div>
        <div class='form-group'>
          <select v-model='txnType'>
              <option :value="this.txnTypeEnum.LTC_SEND">Send LTC</option>
              <option :value="this.txnTypeEnum.BUY_CONTRACT">Buy Contract</option>
              <option :value="this.txnTypeEnum.SELL_CONTRACT">Sell Contract</option>
              <option :value="this.txnTypeEnum.ISSUE_CURRENCY">Issue Currency</option>
              <option :value="this.txnTypeEnum.REDEEM_CURRENCY">Redeem Currency</option>
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
      "currentTxnType",
      "name",
      "price",
      "contract",
      "quantity"
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
