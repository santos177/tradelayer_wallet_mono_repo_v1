<template>
  <div>
      <md-tabs>
        <md-tab style="height: 600px;" md-label="Coming Soon">
          <img class="animated jello" src="@/assets/taxesimage_gettycredit.jpg"/>
        </md-tab>
      </md-tabs>
  </div>
</template>

<script>
export default {
  name: 'Taxes',
  data: () => ({
    showDialog: true
  })
}
</script>

<style scoped>
  .md-dialog {
    max-width: 768px;
  }
</style>
