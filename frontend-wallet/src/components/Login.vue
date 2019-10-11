<template>
  <div>
    <md-card class="md-layout md-alignment-top-center">
      <form @submit.prevent="handleSubmit">
        <div v-if="hasEncryptedKeys">
          <div class="form-group">
  
            <label htmlFor="password">You have {{walletCountDisplay}}; enter password to unlock</label>
            <input type="password" style="margin: 0px 40px 0px; width: 250px;" v-model="password" name="password" class="form-control" placeholder='password' />
            <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
          </div>
          <div class="form-group">
            <md-button @click="handleSubmit" class="md-raised md-accent animated rubberBand" :disabled="loggedIn">Unlock Wallet</md-button>
            <img v-show="loggedIn = false" src="data:image/gifbase64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
            />
          </div>
        </div>
        <div class="md-raised md-accent animated rubberBand" v-else> no addresses found! </div>
        <router-link to="/CreateWallet" class="btn btn-link">Register/Create Wallet</router-link>
        <router-link to="/Recover" class="btn btn-link recover">Recover from private key</router-link>
        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
          </ul>
        </p>
      </form>
    </md-card>
  </div>
</template>

<script>
  import {
    mapState,
    mapActions,
    mapGetters,
    mapMutations
  } from 'vuex'
  
  export default {
    data() {
      return {
        uuid: '',
        password: '',
        submitted: false,
        errors: []
      }
    },
    computed: {
      ...mapState('auth', ['loggedIn']),
      ...mapGetters('auth', ['loginError']),
      ...mapGetters('wallet', ["hasEncryptedKeys", "walletCountDisplay"])
  
    },
    created() {
      // reset login status
      console.warn('LOGGING OUT IN LOGIN') // this.logout()
    },
    methods: {
      ...mapActions('auth', ['logout']),
      ...mapActions('wallet', ['decryptWalletAction']),
      handleSubmit(e) {
        this.submitted = true
        const {
          password,
          decryptWalletAction
        } = this
  
        if (password) {
          
          const res = decryptWalletAction({password, next:(res)=>{
            if(res){
              this.$router.push('/Summary')
            } else {
              this.errors.push('invallid password; try again')
            }
          }})
        }
      }
    }
  }
</script>

<style scoped>
  .button {
    border-radius: 50%;
    height: 80px;
    width: 80px;
    padding: 10px 10px;
    margin: 10px 20px;
    border: 1px solid #ddd;
  }
  
  .md-card {
    margin: 30px;
    padding: 50px;
    border-radius: 50%;
    width: 400px;
  }
  
  .input {
    margin: 30px;
    width: 170px;
    display: inline-block;
  }
  
  .md-button {
    height: 80px;
    border: 1px;
    border-radius: 50%;
  }
  
  .recover {
    padding-top: 0px;
  }
</style>
