<template>
    <div class='navigation-container'> 
      <div class='navigation-header'>
        <span class="md-title">TradeLayer</span>
      </div>
      <div class='links-container'>
        <router-link class='link' to="/Summary">
          <span class="md-label">Transactions log</span>
        </router-link>
        <router-link class="link" to="/Summary">
          <span class="md-label">Whitelists </span>
        </router-link>
        <router-link class="link" to="/Summary">
          <span class="md-label">Trade Channel Manager </span>
        </router-link>
      </div>
  <div class='divider' />

      [LTC Pairs]
     <md-list class='pairs-list'>
      <md-list-item class='pair-item'>LTC/dUSD</md-list-item>
      <md-list-item class='pair-item'>LTC/ALL</md-list-item>
      <md-list-item class='pair-item'>LTC/USDL</md-list-item>
      <md-list-item class='pair-item'>LTC/sLTC</md-list-item>
    </md-list>
  <div class='divider' />
    [Oracle Contracts]
  <div class='divider' />
    [Native Contracts]
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Navigation',
  components: {},
  data () {
    return {}
  },
  computed: {},
  methods: {},
  mounted () {
}
}
</script>

<style>

.navigation-header{
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  font-weight: bold;
  font-size: 17px;
  background-color: rgb(32, 32, 32);
  box-shadow: 0 1px 5px black;
}
.links-container {
  margin: 1rem ;
  display: flex;
  flex-direction: column;
}
.link {
  font-size: 1rem;
  margin: 0.1rem 0;
}

.divider {
  border-top: 1px solid lightgrey;
  width: 100%;
  margin: 2rem 0;
}

.pair-item {
  padding: 0;
  background: rgb(41, 41, 43);
  margin: 1px 0;
}
.pair-item:hover {
  filter: invert(100%);
  cursor: pointer;
}
</style>
