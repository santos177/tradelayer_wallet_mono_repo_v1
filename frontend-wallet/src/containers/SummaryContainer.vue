<template>
  <div id="SummaryContainer">
    <div class="md-layout-item">
      <md-field>
        <md-tooltip md-direction="right">First, select a contract</md-tooltip>
        <label for="selectedContract">Contract</label>
        <!-- 
        <md-select v-model="selectedContract" @md-selected="handleSelectedContract($event)">
          <md-option value="ALL/USD">ALL/USD</md-option>
          <md-option value="ALL/JPY">ALL/JPY</md-option>
          <md-option value="ALL/LTC">ALL/LTC</md-option>
          <md-option value="LTC/USD">LTC/USD</md-option>
          <md-option value="LTC/JPY">LTC/JPY</md-option>
        </md-select>
        -->
         <md-select v-model="selectedContract" @md-selected="handleSelectedContract($event)">
          <md-option 
          v-for="contract in contractsList"
          v-bind:key="contract.name"
          :value="contract.id"
          >
          {{contract.name}}
          </md-option>
        </md-select>
      </md-field>
    </div>
    <div class="md-layout-item md-small-hide">
      <md-tabs style="margin: 0px 0px 0px 40px" md-sync-route>
        <md-tab id="tab-summary" md-label="Trading" to="/Summary"></md-tab>
        <md-tab id="tab-portfolios" md-label="Portfolio" to="/Portfolio"></md-tab>
        <md-tab id="tab-taxes" md-label="Taxes" to="/Taxes"></md-tab>
      </md-tabs>
    </div>

    <div class="md-layout md-alignment-top-center">
      <div
        class="md-xsmall-hide md-small-hide md-layout-item md-small-size-100 md-medium-size-25 md-large-size-25"
      >
        <md-table md-card>
          <md-card-header 
          style="height: 40px;" 
          class="md-alignment-top-center">OrderBook</md-card-header>
          <md-table-row>
            <md-tabs style="height: 250px;">
              <md-tab id="tab-orderbooksell" md-label="Sell">
                <OrderbookSell />
              </md-tab>
            </md-tabs>
          </md-table-row>
          <md-table-row>
            <md-tabs style="height: 250px;">
              <md-tab id="tab-orderbookbuy" md-label="Buy">
                <OrderbookBuy />
              </md-tab>
            </md-tabs>
          </md-table-row>
        </md-table>
      </div>
      <div class="md-small-size-100 md-medium-size-66 md-large-size-50">
        <md-table md-card>
          <md-table-row>
            <BuySell />
          </md-table-row>
        </md-table>
        <md-table style="height: 160px" md-card>
          <md-card-header class="md-layout-item">Inverse contract</md-card-header>

          <md-table-row>
            <md-table-cell style="text-align: right;">Symbol</md-table-cell>
            <md-table-cell style="text-align: left;">ALL/dUSD</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell style="text-align: right;">Type</md-table-cell>
            <md-table-cell style="text-align: left;">Inverse contract</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell style="text-align: right;">Max Leverage</md-table-cell>
            <md-table-cell style="text-align: left;">1x</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell style="text-align: right;">Mark Price</md-table-cell>
            <md-table-cell style="text-align: left;">---</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell style="text-align: right;">Premium</md-table-cell>
            <md-table-cell style="text-align: left;">---%</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell style="text-align: right;">Open Interest</md-table-cell>
            <md-table-cell style="text-align: left;">---</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
      <div
        class="hide-on-desktop md-layout-item md-small-size-100 md-medium-size-25 md-large-size-25"
      >
        <md-table md-card>
          <md-tabs>
            <md-tab id="tab-orderbookbuy" style="height: 250px" md-label="Buy">
              <OrderbookBuy />
            </md-tab>
            <md-tab id="tab-orderbooksell" style="height: 250px" md-label="Sell">
              <OrderbookSell />
            </md-tab>
          </md-tabs>
        </md-table>
      </div>
      <div
        style="height: 600px"
        class="md-layout-item md-small-size-100 md-medium-size-100 md-large-size-33"
      >
        <HistoricalTrades />
        <TradeChannels />
      </div>
    </div>

    <div class="md-layout md-small-hide">
      <md-tabs class="tabs-tight">
        <md-tab
          style="margin: 0px 0px -20px;"
          id="tab-content-positions"
          class
          md-label="Positions"
        >
          <Positions />
        </md-tab>
        <md-tab id="tab-content-active-pos" class md-label="Active">
          <Active />
        </md-tab>
        <md-tab id="tab-content-fills" class="tab-tight md-label-tight" md-label="Fills">
          <HistoricalTradesbyAddress />
        </md-tab>
        <md-tab id="tab-content-pending" class="tab-tight md-label-tight" md-label="Pending">
          <Pending />
        </md-tab>
      </md-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BuySell from "@/components/BuySell";
import OrderbookBuy from "@/components/OrderbookBuy";
import OrderbookSell from "@/components/OrderbookSell";
import HistoricalTrades from "@/components/HistoricalTrades";
import HistoricalTradesbyAddress from "@/components/HistoricalTradesbyAddress";
import Positions from "@/components/Positions";
import Close from "@/components/Close";
import Active from "@/components/Active";
import Pending from "@/components/Pending";
import TradeChannels from "@/components/TradeChannels";
// import Balances from '@/components/Balances'

export default {
  name: "SummaryContainer",
  data() {
    return {
      selectedContract: {},
      selectedContractNew: "",
      contractsList: [
        {
          id:   1,
          name:'DPof8/SuperV',
          propsIdForSale: 6,
          propsIdDesired: 9,
          type: "pairContract",
        },
        {
          id: 2,
          name:'DPof8/8ofBG',
          propsIdForSale: 6,
          propsIdDesired: 11,
          type: "pairContract",
        },
        {
          id: 3,
          name:'token3/token4',
          propsIdForSale: 3,
          propsIdDesired: 4,
          type: "pairContract",
        }
      ]
    };
  },
  computed: {
    ...mapGetters("contracts", ["selectedContractGetter"])
  },
   watch: {
    selectedContractGetter: {
      immediate: true,
      handler() {
        this.handleOrderBook()
      }
    }
  },
  methods: {
    ...mapActions("contracts", ["setSelectedContract"]),
    ...mapActions("orderbook", ["getPairOrderBook"]),
    handleSelectedContract(value) {
      const pair = this.contractsList.find(e => e.id === value)
      console.log(`Selecting contract with ID: ${pair.id}, Name: ${pair.name}`);
      this.setSelectedContract({selectedContract: pair});
    },
    handleOrderBook() {
        if (this.selectedContractGetter.type === "pairContract") {
          this.getPairOrderBook(this.selectedContract)
        }
    }
  },
  components: {
    BuySell,
    OrderbookBuy,
    OrderbookSell,
    HistoricalTrades,
    Positions,
    Close,
    Active,
    Pending,
    HistoricalTradesbyAddress,
    TradeChannels
  }
};
</script>

<style scoped>
.md-table-toolbar {
  padding: 0px 0px 0px 00px;
  margin: -40px 0px -20px 0px;
  text-align: center;
  font-size: 16px;
}

.md-tabs-content {
}

.tabs-tight {
  margin: 0px 16px 10px;
  padding: 6px 10px 10px;
}

.md-card-header {
  color: #d61d67;
  margin: 0px 0px 0px;
}

.md-table-cell {
  width: 40px;
  height: 6px;
  margin: 0px;
  padding: 0px;
}

.md-field {
  width: 180px;
  margin: 0px 0px 0px 20px;
}

@media only screen and (min-width: 960px) {
  .hide-on-desktop {
    display: none;
  }
}
</style>
