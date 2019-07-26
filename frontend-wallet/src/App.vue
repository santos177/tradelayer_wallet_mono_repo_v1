<template>
  <div id="app" class="page-container md-layout-column">
      <md-toolbar class="md-theme-default md-primary">
        <div class="md-layout md-gutter md-alignment-center-space-around">
          <md-button class="md-icon-button" @click="showNavigation = true">
            <md-icon>menu</md-icon>
          </md-button>
         <div class="md-layout-item">
           <router-link to="/" class="md-avatar">
             <img src="@/assets/tradelayer.jpg" alt="">
           </router-link>
          </div>
          <div class="md-layout-item">
           <router-link to="/Summary">
             <md-icon class="md-left">home</md-icon>
             <md-tooltip md-direction="bottom">Home</md-tooltip>
           </router-link>
         </div>
         <div class="md-layout-item">
           <router-link to="/Balances">
             <md-icon class="md-left">account_circle</md-icon>
             <md-tooltip md-direction="bottom">Portfolio</md-tooltip>
           </router-link>
         </div>
         <div class="md-layout-item">
           <router-link to="/Login">
             <md-icon class="md-left">exit_to_app</md-icon>
             <md-tooltip md-direction="bottom">Logout</md-tooltip>
           </router-link>
         </div>
         <label>{{this.walletCountDisplay}}</label>
       </div>

       <div class="md-toolbar-section-end">
        <div class="md-layout md-gutter md-alignment-center-space-between">
          <div class="md-layout-item">
            <div class="md-list-item-text">
              <span>Equity</span>
              <span>{{this.equityGetter}}</span>
               <md-tooltip md-direction="bottom">Balance + Reserved + PNL</md-tooltip>
            </div>
          </div>
          |
          <div class="md-layout-item">
            <div class="md-list-item-text">
              <span>Available</span>
              <span>{{this.equityGetter}}</span>
               <md-tooltip md-direction="bottom">Equity - Initial Margin</md-tooltip>
            </div>
          </div>
          |
          <div class="md-layout-item">
            <router-link to="/Login">
              <md-tooltip md-direction="bottom">Login</md-tooltip>
              <md-icon class="md-left">fingerprint</md-icon>
            </router-link>
          </div>
          |
          <div class="md-layout-item">
            <router-link to="/CreateWallet">
              <md-tooltip md-direction="bottom">Create New Wallet</md-tooltip>
              <md-icon class="md-left">person_add</md-icon>
            </router-link>
          </div>
         <div class="md-layout-item">
          <circle-menu type="bottom" :number="4" animate="animated" mask='white' circle>
            <button type="button" slot="item_btn"></button>
            <router-link to="/Balances" slot="item_1">
              <md-tooltip md-direction="left">Wallet</md-tooltip>
              <md-icon class="">account_balance_wallet</md-icon>
            </router-link>
            <router-link to="/Taxes" slot="item_2">
              <md-tooltip md-direction="left">Taxes</md-tooltip>
              <md-icon class="">compare_arrows</md-icon>
            </router-link>
            <router-link to="/dCurrency" slot="item_3">
              <md-tooltip md-direction="left">dCurrency</md-tooltip>
              <md-icon class="">euro_symbol</md-icon>
            </router-link>
            <router-link to="/Validators" slot="item_4">
              <md-tooltip md-direction="left">Validators</md-tooltip>
              <md-icon class="">spellcheck</md-icon>
            </router-link>
          </circle-menu>
        </div>
          <!-- <md-button @click="showNavigation = true">
            <md-icon>menu</md-icon>
          </md-button> -->
        </div>
      </div>
      </md-toolbar>
      <md-drawer class="md-left" :md-active.sync="showNavigation">

        <md-toolbar class="md-transparent" md-elevation="1">
          <span class="md-title">TradeLayer</span>
        </md-toolbar>

        <md-list>
          <router-link class="md-list-item" to='/Summary'>
            <span class="md-label">Trading</span>
          </router-link>
          <router-link class="md-list-item" to='/dCurrency'>
            <span class="md-label">dCurrency</span>
          </router-link>
          <router-link class="md-list-item" to='/Portfolio'>
            <span class="md-label">Portfolio</span>
          </router-link>
          <router-link class="md-list-item" to='/Taxes'>
            <span class="md-label">Taxes</span>
          </router-link>
        </md-list>
      </md-drawer>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data: () => ({
    showNavigation: false
  }),
  computed: {
    ...mapGetters('user', ['walletBlobGetter']),
    ...mapGetters('wallet', ['walletCountDisplay']),
    ...mapGetters('contracts', ['equityGetter'])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 15px;
}

  .md-primary {
    color: #000000;
  }

  .md-button {
    border: 1px;
    border-radius: 3%/6%;
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
    border: 1px;
    border-radius: 3%/6%;
  }

  .md-toolbar {
    border: 1px;
    border-radius: 3%/6%;
  }

  .md-table {
    margin: 10px 10px;
  }

  .md-table-head {
    border: 1px;
    border-radius: 3%/6%;
  }

  .md-table-row {
    border: 1px;
    border-radius: 3%/6%;
  }

  .md-table-cell {
    border: 1px;
    border-radius: 3%/6%;
  }

  .md-card {
    margin: 10px 10px;
    border: 1px;
  }

  .md-card-content {
    border: 1px;
    border-radius: 3%/6%;
  }

  .page-container {
   position: relative;
   border: 20px solid rgba(#000, .12);
 }
</style>

<style lang="sass">
// @import ~vue-material/dist/theme/engine
// +md-register-theme("default", (primary: md-get-palette-color(purple, 900), accent: md-get-palette-color(purple, 200), theme: light))
// //+md-register-theme("default", (primary: md-get-palette-color(green, A200), accent: md-get-palette-color(purple, 200), theme: dark))
// // +md-register-theme("default", (primary:#3fffbe, accent: #3fffbe, theme: dark))
// @import ~vue-material/dist/theme/all
// @import ~vue-material/dist/components/MdButton/theme
//
// // Apply the Button theme
// @import ~vue-material/dist/components/MdContent/theme
//
// // Apply the Content theme
// @import ~vue-material/dist/components/MdToolbar/theme

// Apply the Toolbar theme
// @import "~vue-material/dist/theme/engine";
//
// @include md-register-theme("default", (
//   primary: md-get-palette-color(purple, 900), // The primary color of your application
//    accent: md-get-palette-color(purple, 200), // The accent or secondary color
//    theme: dark
//  ));
//
// @import "~vue-material/dist/theme/all";
// @import "~vue-material/dist/components/MdButton/theme"; // Apply the Button theme
// @import "~vue-material/dist/components/MdContent/theme"; // Apply the Content theme
// @import "~vue-material/dist/components/MdToolbar/theme"; // Apply the Toolbar theme

</style>
