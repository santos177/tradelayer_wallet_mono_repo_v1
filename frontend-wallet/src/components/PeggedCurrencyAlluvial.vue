<template>
    <div id='Sankey'>
        <GChart
        :settings="{ packages: ['sankey', 'corechart', 'table', 'map'] }"
        type='Sankey'
        :data=$store.state.sankeyData
        :options='this.chartOptions'
        />
    </div>
</template>

<script>
import {GChart} from 'vue-google-charts'
import {mapActions} from 'vuex'

export default {
  name: 'Sankey',
  components: {
    GChart
  },
  data () {
    return {
      chartData: [['test', 'test', 'test'],
        ['test', 'test2', 7],
        ['test2', 'test3', 5]],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017'
        }
      }
    }
  },
  methods: mapActions([
    'getSankeyData',
    'refreshSankey'
  ]),
  mounted () {
    this.getSankeyData()
    this.refreshSankey()
    console.log('sankey', this.$store.state.sankeyData)
  }
}
</script>

<style>
</style>
