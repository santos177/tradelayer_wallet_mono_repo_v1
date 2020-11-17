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

    <div class='custom-dropdown'>
      <div class='dropdown-head' @click="toggleDropdown(1)"> LTC Pairs </div>
      <div class='dropdown-body'>
        <div 
        class='dropdown-item' 
        v-bind:class="{ active: openedDropdown === 1 }"
        v-for="(contract,index) in pairContracts"
        :key='index'
        >{{contract}}</div>
      </div>
    </div>

      <div class='custom-dropdown'>
      <div class='dropdown-head'  @click="toggleDropdown(2)">Oracle Contracts</div>
      <div class='dropdown-body'>
        <div 
          class='dropdown-item' 
          v-bind:class="{ active: openedDropdown === 2 }"
          v-for="(contract,index) in oracleContracts"
          :key='index'
          >{{contract}}</div>
      </div>
    </div>

    <div class='custom-dropdown'>
      <div class='dropdown-head' @click="toggleDropdown(3)">Native Contracts</div>
      <div class='dropdown-body'>
        <div 
          class='dropdown-item' 
          v-bind:class="{ active: openedDropdown === 3 }"
          v-for="(contract ,index) in nativeContracts"
          :key='index'
          >{{contract}}</div>
      </div>
    </div>


  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Navigation',
  components: {},
  data () {
    return {
      openedDropdown: 0,
      pairContracts: ["LTC/dUSD", "LTC/ALL", "LTC/USDL", "LTC/sLTC"],
      oracleContracts: [
        "LTC/USD-Oracle-PERP", 
        "LTC/USD-Oracle-DEC20", 
        "LTC/USD-Oracle-MAR21", 
        "BTC/USD-Oracle-PERP", 
        "BTC/USD-Oracle-DEC20", 
        "BTC/USD-Oracle-MAR21",
        "LTC/BTC-Oracle-PERP",
        "ALL/USD-Oracle-PERP",
        "ALL/LTC-Oracle-PERP"
        ],
      nativeContracts: [
        "ALL/LTC-Native-PERP",
        "LTC/USD-Native-PERP",
        "LTC/EUR-Native-PERP",
        "LTC/JPY-Native-PERP",
        "LTC/CNY-Native-PERP",
      ]
    }
  },
  computed: {},
  methods: {
    toggleDropdown(id) {
      this.openedDropdown = this.openedDropdown === id ? 0 : id;
    }
  },
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
  height: 0;
  overflow: hidden;
  transition: all 0.5s;
}
.pair-item:hover {
  filter: invert(100%);
  cursor: pointer;
}
.head {
    background: rgb(41, 41, 43);
    padding: 0.5rem;
}
.head:hover{
  cursor: pointer;
}
.head:hover + .pairs-list .pair-item {
  height: 3rem;
}


.dropdown-head {
  padding: 1rem;
  background: #367588;
  color: black;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 1px solid black;
  border-top: 1px solid black
}
.dropdown-head:hover {
  cursor: pointer;
}
.dropdown-item {
  background: rgb(41, 41, 43);
  height: 0rem;
  overflow: hidden;
  transition: all 0.5s;
}

.dropdown-item:hover {
  filter: invert(100%);
  cursor: pointer;
}
.active {
  padding: 1rem;
  height: 3rem;
}
</style>
