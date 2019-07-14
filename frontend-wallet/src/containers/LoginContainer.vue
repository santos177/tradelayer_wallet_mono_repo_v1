<template>
  <div id="LoginContainer" class="md-layout md-alignment-top-center">
    <md-table>
      <md-table-row>
        <md-table-cell class="md-alignment-top-center"><Login/></md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Login from '@/components/Login'

export default {
  name: 'LoginContainer',
  components: {Login}
}
</script>

<style>
</style>
