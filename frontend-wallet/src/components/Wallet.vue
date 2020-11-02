<template>
  <div>
  
    <div id='wallet-header'> 
      <span >addresses </span> 
      <span  id='wallet-balance' v-on:click='updateCurrentUTXOs'> <md-tooltip md-direction='bottom'>click to update balance </md-tooltip>  balance: {{currentAddressLTCBalance}}</span>
    </div>
    <md-table id='address-table'>
      <div v-bind:key="item.publicAddress" v-for="(item, index) in walletDec">
      <md-table-row  v-if="currentAddressIndex == index">
        <md-table-cell class='selected-address' > <div > {{ item.publicAddress }} </div> </md-table-cell>
      </md-table-row>
      <md-table-row v-on:click='setCurrentAddress(index)' v-else>
        <md-table-cell  > <div >{{ item.publicAddress }} </div> </md-table-cell>
        </md-table-row>
        </div>
    </md-table>
    <br/>   
    <div class='divider'></div>
    <div id='txn-container'>
      <form @submit.prevent='handleSubmit'>
        <div class='form-group'>
          <div> From: {{walletDec[currentAddressIndex].publicAddress}} </div>
        </div>

        <div v-if="txnType === txnTypeEnum.LTC_SEND" >
          <div class='form-group form-wrapper'>
              <div> 
                <label for='toAddress'>to </label>
                <input :value="toAddress" @input="txnFormUpdate" type='text' placeholder='address' name='toAddress' />
              </div>
            <div>
              <label>sats</label>
              <input :value="sats" @input="txnFormUpdate" type='number' name='sats' /></div>
            </div>
        </div>

        <div v-else-if="txnType === txnTypeEnum.BUY_CONTRACT || txnType === txnTypeEnum.SELL_CONTRACT" >
            <div class='form-group form-wrapper' >
              <div>
                <label for='quantity'>quant</label>
                <input :value="quantity" @input="txnFormUpdate" type='number' step='any' placeholder='quantity' name='quantity' />
              </div>
              <div> 
                <label for="price">price</label>
                <input :value="price" @input="txnFormUpdate" type='number' step='any' placeholder='price' name='price' /> 
              </div>
            </div>
        </div>
        
      <div v-else-if="txnType === txnTypeEnum.ISSUE_CURRENCY || txnType === txnTypeEnum.REDEEM_CURRENCY" >
            <div class='form-group form-wrapper'>
              <div>
                <label for="contract">contract</label>
                <input :value="contract" @input="txnFormUpdate" type='text' placeholder='contract' name='contract' /> 
              </div>
              <div>
                <label for="name">name</label>
               <input :value="name" @input="txnFormUpdate" type='text' placeholder='name' name='name' /> 
              </div>
              <div>
                <label for="quantity">quant</label>
              <input :value="quantity" @input="txnFormUpdate" type='number' placeholder='quantity' name='quantity' /> 
              </div>
            </div>
        </div>
         <div v-else-if="txnType === txnTypeEnum.PROPOSE_CHANNEL" >
            <div class='form-group form-wrapper'>
              <div>
                <label for="contract">margin balance</label>
                <input :value="channelBalance" @input="txnFormUpdate" type='text' placeholder='balance' name='channelBalance' /> 
              </div>
               <div>
                <label for="contract">price</label>
                <input :value="channelPrice" @input="txnFormUpdate" type='text' placeholder='price' name='channelPrice' /> 
              </div>
               <div>
                <label for="contract">trade size</label>
                <input :value="quantity" @input="quantity" type='text' placeholder='trade size' name='quantity' /> 
              </div>
            </div>
        </div>
        <div class='form-group'>
          <md-field>
            <md-select v-model='txnType'>
              <md-option :value="this.txnTypeEnum.LTC_SEND">Send LTC</md-option>
              <md-option :value="this.txnTypeEnum.BUY_CONTRACT">Buy Contract</md-option>
              <md-option :value="this.txnTypeEnum.SELL_CONTRACT">Sell Contract</md-option>
              <md-option :value="this.txnTypeEnum.ISSUE_CURRENCY">Issue Currency</md-option>
              <md-option :value="this.txnTypeEnum.REDEEM_CURRENCY">Redeem Currency</md-option>
              <md-option :value="this.txnTypeEnum.PROPOSE_CHANNEL">Propose Channel</md-option>

            </md-select>
          </md-field>
        </div>
        <md-button md-button class='md-button-content submit-button' type='submit'> submit</md-button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { createTxn, signTxn } from "../../lib/wallet.js";
import { walletService, socketService } from "../services";

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
      "quantity",
      "channelPrice",
      "channelBalance"
    ]),
    ...mapGetters("wallet", ["addressGetter", "currentAddressLTCBalance"]),
    ...mapState('contracts', ['selectedContract']),

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
    ...mapActions("contracts", ["sendtrade"]),
    ...mapMutations("wallet", ["setTxnState", 'setCurrentTxnType']),
    ...mapActions("wallet", ["setCurrentAddress", "updateCurrentUTXOs"]),
    handleLTCSubmit() {
      if (this.currentTxnType !== txnTypeEnum.LTC_SEND)return
      if(!confirm('Are you sure you want to sign and broadcast this transaction')) return
      let { utxoArray, toAddress, sats, walletDec, currentAddressIndex } = this;

      let { publicAddress, wifKey } = walletDec[currentAddressIndex];

      const txn = createTxn(utxoArray, toAddress, +sats, publicAddress);
      const signedTxn = signTxn(txn, wifKey).serialize()
      
      walletService.sendRawTxn(signedTxn).then((data)=>{
        console.log(data);
      })
    },
    handleBuySellSubmit(){
    const address = this.walletDec[this.currentAddressIndex].publicAddress;
    const {BUY_CONTRACT, SELL_CONTRACT} = txnTypeEnum
    const { propsIdForSale, propsIdDesired } = this.selectedContract
    const data = {};
    if (this.currentTxnType === SELL_CONTRACT) {
      data.address = address
      data.propsIdForSale = propsIdForSale;
      data.amountforsale = parseFloat(this.quantity);
      data.propsIdDesired = propsIdDesired;
      data.amountdesired = parseFloat(this.price);
    }
    if (this.currentTxnType === BUY_CONTRACT) {
      data.address = address
      data.propsIdForSale = propsIdDesired;
      data.amountforsale = parseFloat(this.quantity);
      data.propsIdDesired = propsIdForSale;
      data.amountdesired = parseFloat(this.price);
    }
      this.sendtrade(data)
    return
    },
    handleIssueRedeemSubmit(){
      // placeholder
      return
    },
    handleProposeChannel(){
      
      const {   quantity, channelPrice, channelBalance, currentAddressIndex, walletDec} = this
       let { publicAddress } = walletDec[currentAddressIndex];
       
       socketService.proposeChannel({
         marginBalance: channelBalance,
          quotePrice: channelPrice,
          unpublishedTradeSize: quantity,
          address: publicAddress
       })
       
    },
    handleSubmit(e) {
      if(!confirm('Are you sure you want to sign and broadcast this transaction')) return

      const {currentTxnType, handleLTCSubmit, handleIssueRedeemSubmit, handleBuySellSubmit,handleProposeChannel} = this
      const {LTC_SEND,  BUY_CONTRACT, SELL_CONTRACT, ISSUE_CURRENCY, REDEEM_CURRENCY, PROPOSE_CHANNEL} = txnTypeEnum

      switch (currentTxnType) {
        case  LTC_SEND:
          return handleLTCSubmit();
        case BUY_CONTRACT:
        case SELL_CONTRACT:
          return handleBuySellSubmit()
        case ISSUE_CURRENCY:
          return getSendIssuancePeggedPayload(/*datahere*/).then(this.handleOpReturnPayload)
        case REDEEM_CURRENCY:
          return handleIssueRedeemSubmit()
        case PROPOSE_CHANNEL:
          return handleProposeChannel()
        default:
          break;
      }
     
    },
    handleOpReturnPayload(txn){
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
.update-button, .submit-button{
  border: 1px solid grey;
  border-radius: 40%;
}
.selected-address{
  font-weight: bold
}
#address-table td{
  cursor: pointer;
    align: left;

}
#header{
  text-align: left;
  padding-left: 35px;
  padding-bottom: 20px;

}
.divider{
  border-top: 1px solid lightgrey;
  width: 100%;
  margin: 10px 0px 10px 0;
}
#address-table{
  max-height: 200px;
  overflow: scroll;
}

.form-wrapper {
  display: flex;
  flex-direction: column
}

#wallet-balance{
  cursor: pointer;
}

#wallet-header{
  display: flex;
  justify-content: space-between;
  padding: 0 20px 0 20px;
  margin: 15px 0 15px 0;
  font-weight: bold;
  font-size: 17px;
}
</style>
