<template>
    <div>
      <md-card class="md-layout md-alignment-top-center">
        <form @submit.prevent="handleSubmit">
            <div class="form-group md-layout-item">
                <label for="email" style="margin: 20px 20px 0px;">Wallet ID Or Email</label>
                <input type="text" style="margin: 20px 40px 0px; width: 250px;" v-model="uuid" name="username" class="form-control"/>
                <div v-show="submitted && !uuid" class="invalid-feedback">UUID is required</div>
            </div>         
            <div class="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" style="margin: 0px 40px 0px; width: 250px;" v-model="password" name="password" class="form-control"/>
                <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
            </div>
            <div class="form-group">
                <md-button @click="handleSubmit" class="md-raised md-accent animated rubberBand" :disabled="loggedIn">Login</md-button>
                <img v-show="loggedIn = false" src="data:image/gifbase64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                <router-link to="/CreateWallet" class="btn btn-link">Register/Create Wallet</router-link>
            </div>
            <p v-if="loginError">
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
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      uuid: '',
      password: '',
      submitted: false
    }
  },
  computed: {
    ...mapState('auth', ['loggedIn']),
    ...mapGetters('auth', ['loginError'])
  },
  created () {
    // reset login status
    console.warn('LOGGING OUT IN LOGIN') // this.logout()
   },
    methods: {
      ...mapActions('account', ['verify']),
    ...mapActions('auth', ['logout']),
    ...mapMutations('wallet', ['decryptWallet']),
    handleSubmit (e) {
      this.submitted = true
      const { password, decryptWallet } = this
      
      if (password) {
        decryptWallet(password)
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
  padding:10px;
  border-radius: 50%;
  width: 350px;
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
</style>
