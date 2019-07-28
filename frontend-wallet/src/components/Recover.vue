<template>
  <md-card class="md-layout md-alignment-top-center">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label htmlFor="password">recover key (be careful!!!)</label>
        <input v-model="wifKey" type="password" style="margin: 0px 40px 0px; width: 250px;" name="wifkey" class="form-control" placeholder='private key' />
        <input v-model="password" type="password" style="margin: 0px 40px 0px; width: 250px;" name="password" class="form-control" placeholder='password' />
  
        <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
      </div>
      <div class="form-group">
        <md-button @click="handleSubmit" class="md-raised md-accent animated rubberBand">recover</md-button>
      </div>
    </form>
  </md-card>
</template>

<script>
  import {
    mapState,
    mapActions,
    mapGetters,
    mapMutations
  } from 'vuex';
  
  export default {
    data: () => ({
      wifKey: '',
      password: '',
      submitted: false
    }),
    methods: {
      ...mapMutations('wallet', ['addKeyPairFromWif']),
      handleSubmit() {
        this.submitted = true
        const {
          wifKey,
          password
        } = this
        this.addKeyPairFromWif({
          wifKey,
          password
        })
      }
    }
  };
</script>

<style scoped>
  
</style>
