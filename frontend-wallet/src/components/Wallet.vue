<template>
  <div v-if="walletDec[currentAddressIndex]">
  
    <div id='wallet-header'> 
      <span >addresses </span> 
      <span  id='wallet-balance' v-on:click='updateCurrentUTXOs'> <md-tooltip md-direction='bottom'>click to update balance </md-tooltip>  balance: {{currentAddressLTCBalance}}</span>
    </div>
    <!-- <md-table id='address-table'>
      <div v-bind:key="item.publicAddress" v-for="(item, index) in walletDec">
      <md-table-row  v-if="currentAddressIndex == index">
        <md-table-cell class='selected-address' > <div > {{ item.publicAddress }} </div> </md-table-cell>
      </md-table-row>
      <md-table-row v-on:click='setCurrentAddress(index)' v-else>
        <md-table-cell > <div >{{ item.publicAddress }} </div> </md-table-cell>
        </md-table-row>
        </div>
    </md-table> -->

    <div class='addresses-container'>
      <div 
      class='address' 
      v-bind:class="{ 'active-address': currentAddressIndex == index }"
      v-bind:key="item.publicAddress" v-for="(item, index) in walletDec"
      v-on:click='setCurrentAddress(index)'>
         {{ item.publicAddress }} 
      </div>
    </div>
  
    <div class='divider'></div>
    <div id='txn-container'>
        <div class='form-group'>
          <md-field>
            <md-select v-model='txnType'>
              <md-option :value="this.txnTypeEnum.LTC_SEND">Send LTC</md-option>
              <md-option :value="this.txnTypeEnum.BUY_CONTRACT">Buy Contract</md-option>
              <md-option :value="this.txnTypeEnum.SELL_CONTRACT">Sell Contract</md-option>
              <md-option :value="this.txnTypeEnum.ISSUE_CURRENCY">Issue Currency</md-option>
              <md-option :value="this.txnTypeEnum.REDEEM_CURRENCY">Redeem Currency</md-option>
              <md-option :value="this.txnTypeEnum.PROPOSE_CHANNEL">Propose Channel</md-option>
              <md-option :value="this.txnTypeEnum.SIMPLE_SEND">Simple Send</md-option>
            </md-select>
          </md-field>
        </div>
    <div class='divider'></div>

      <form @submit.prevent='handleSubmit'>
        <div v-if="txnType === txnTypeEnum.LTC_SEND">
          <div class='form-group'>
            <md-field >
              <label>Send To: </label>
              <md-input v-model="toAddress" name='toAddress'></md-input>
            </md-field>
            <md-field >
              <label>Sats: </label>
              <md-input v-model="sats" type='number' name='sats' @input="txnFormUpdate"></md-input>
            </md-field>
            </div>
          </div>

          <div v-else-if="txnType === txnTypeEnum.BUY_CONTRACT || txnType === txnTypeEnum.SELL_CONTRACT" >
              <div class='form-group form-wrapper' >
            <md-field >
              <label>Quantity: </label>
              <md-input v-model="quantity" @input="txnFormUpdate" type='number' step='any' name='quantity'></md-input>
            </md-field>
            <md-field >
              <label>Price: </label>
              <md-input v-model="price" @input="txnFormUpdate" type='number' step='any'  name='price'></md-input>
            </md-field>
              </div>
          </div>
        
      <div v-else-if="txnType === txnTypeEnum.ISSUE_CURRENCY || txnType === txnTypeEnum.REDEEM_CURRENCY" >
            <div class='form-group form-wrapper'>
            <md-field >
              <label>Contract: </label>
              <md-input v-model="contract" @input="txnFormUpdate"  type='text' name='contract'></md-input>
            </md-field>
            <md-field >
              <label>Name: </label>
              <md-input v-model="name" @input="txnFormUpdate" type='text' name='name'></md-input>
            </md-field>
            <md-field >
              <label>Quantity: </label>
              <md-input v-model="quantity" @input="txnFormUpdate" type='number' name='quantity'></md-input>
            </md-field>
            </div>
        </div>
         <div v-else-if="txnType === txnTypeEnum.PROPOSE_CHANNEL" >
            <div class='form-group form-wrapper'>
            <md-field >
              <label>Margin Balance: </label>
              <md-input v-model="channelBalance" @input="txnFormUpdate" type='text' name='channelBalance' ></md-input>
            </md-field>
            <md-field >
              <label>Price: </label>
              <md-input v-model="channelPrice" @input="txnFormUpdate" type='text' name='channelPrice'></md-input>
            </md-field>
            <md-field >
              <label>Trade Size: </label>
              <md-input v-model="quantity" @input="quantity"  type='text'  name='quantity'></md-input>
            </md-field>
            </div>
        </div>
          <div v-else-if="txnType === txnTypeEnum.SIMPLE_SEND" >
            <div class='form-group form-wrapper'>
            <md-field >
              <label>Send To: </label>
              <md-input v-model="toAddress" name='toAddress' required></md-input>
              <span class="md-error">There is an error</span>
            </md-field>
            <md-field >
              <label>Property ID: </label>
              <md-input v-model="propertyId" type='text' name='Property Id' required></md-input>
              <span class="md-error">There is an error</span>
            </md-field>
            <md-field >
              <label>Quantity: </label>
              <md-input v-model="quantity" type='number'  name='Quantity' required></md-input>
              <span class="md-error">There is an error</span>
            </md-field>
            </div>
        <md-button md-button class='md-accent md-raised' v-on:click="buildRaw(txnTypeEnum.SIMPLE_SEND)" :disabled='!toAddress || !propertyId || !quantity'>Build Raw</md-button>
        <md-button md-button class='md-primary md-raised' disabled>Sign</md-button>
        <textarea class='nice-textarea' type='text-area' v-model='txMessage'></textarea>
        </div>
       </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { createTxn, signTxn } from "../../lib/wallet.js";
import { walletService, socketService } from "../services";

const { txnTypeEnum } = walletService
export default {
  name: "Wallet",
  data: () => ({
    showDialog: true,
    txnTypeEnum,
    txMessage: '',
    toAddress: '',
    propertyId: null,
    quantity: null,

  }),
  computed: {
    ...mapState("wallet", [
      "walletDec",
      "currentAddressIndex",
      "sats",
      "utxoArray",
      "currentTxnType",
      "name",
      "price",
      "contract",
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
    ...mapActions("wallet", ["setCurrentAddress", "updateCurrentUTXOs", "buildRawTx"]),
    async buildRaw(txType) {
      if (txType === txnTypeEnum.SIMPLE_SEND) {
      
      const opt = {
        txType: txnTypeEnum.SIMPLE_SEND,
        fromAddress: this.addressGetter,
        toAddress: this.toAddress,
        quantity: this.quantity,
        propertyId: this.propertyId,
      }
      const txMessage = await this.buildRawTx(opt)
      this.txMessage = txMessage;
    }
    },
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
      data.amountdesired = parseFloat(this.quantity) * parseFloat(this.price);
    }
    if (this.currentTxnType === BUY_CONTRACT) {
      data.address = address
      data.propsIdForSale = propsIdDesired;
      data.amountforsale = parseFloat(this.quantity);
      data.propsIdDesired = propsIdForSale;
      data.amountdesired = parseFloat(this.quantity) * parseFloat(this.price);
    }
      this.sendtrade(data);
      window.toggleWallet();
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
.nice-textarea {
    background-color: black;
    padding: 0.5rem 1rem;
    border:unset;
    overflow:auto;
    color:green;
    width: 90%;
    max-width: 90%;
    min-width:40%;
    margin: 1rem 0;
}
.update-button, .submit-button{
  border: 1px solid grey;
  border-radius: 20%;
}

#header{
  text-align: left;
  padding-left: 35px;
  padding-bottom: 20px;

}
.divider{
  border-top: 1px solid rgb(32, 32, 32);
  box-shadow: 0 0 2px 1px rgb(32, 32, 32);
  width: 100%;
  margin: 0.5rem 0;
}
.form-group {
  padding: 0 2rem
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
  padding: 1rem;
  font-weight: bold;
  font-size: 17px;
  background-color: rgb(32, 32, 32);
  box-shadow: 0 1px 5px black;
}

.addresses-container {
  max-height: 200px;
  display:flex;
  flex-direction: column;
  margin: 0.5rem 0;
  overflow: auto;
}
.address {
  margin: 0.3rem 0;
  cursor: pointer;
}
.address:hover {
  color: yellowgreen;
}
.active-address{ 
  color: skyblue
}
</style>
