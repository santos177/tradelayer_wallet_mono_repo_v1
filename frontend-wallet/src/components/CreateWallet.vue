<template>
  <form @submit.prevent='handleSubmit' novalidate='true'>
     
           <div class='form-group'>
               <label htmlFor='password'>Password</label>
               <input type="password" v-model="password" class='form-control animated bounce delay-2s'>
               <Password v-model='password' name='password'
               :strength-meter-only='true' :secureLength=7 />
               <div v-show='submitted && !password' class='invalid-feedback'>Password is required</div>
           </div>
           <div class='form-group'>
               <label htmlFor='password2'>Verify Password</label>
               <input type='password' v-model='password2' name='password2' class='form-control animated jello delay-2s' />
               <div v-show='submitted && !password2' class='invalid-feedback'>Password verification is required</div>
           </div>
           <div class='form-group'>
               <md-button @click="handleSubmit" class='md-raised md-accent animated rubberBand delay-4s'>Create</md-button>
           </div>

           <p v-if="loginError">
             <b>Please correct the following error(s):</b>
             <ul style="list-style: none">
               <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
             </ul>
           </p>
           <!-- <div>
              <router-link to='/login' class='btn btn-link'>Already have a wallet? Login</router-link>
           </div> -->
       </form>
</template>

<script>
import Password from 'vue-password-strength-meter'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  components: { Password },
  data () {
    return {
      email: '',
      password: '',
      password2: '',
      submitted: false,
      loginError: false,
      errors: []
    }
  },
  computed: {
    ...mapState('user', ['nonce', 'walletBlob', 'publicKey', 'encryptedWallet'])
  },
  created () {
    // reset login status
    console.warn('LOGGING OUT IN CREATEWALLET')
    this.logout()
  },
  methods: {
    ...mapActions('user', ['walletEmail', 'walletPassword', 'walletAddress', 'walletUUIDCreate', 'walletCreateCrypto', 'walletChallenge', 'walletCreate']),
    ...mapActions('auth', ['logout']),
    ...mapMutations('user', ['addKeyPair']),
    showFeedback ({suggestions, warning}) {
      console.log('🙏', suggestions)
      console.log('⚠', warning)
    },
    showScore (score) {
      console.log('💯', score)
    },
    handleSubmit (e) {
      console.log('fired handleSubmit')
      const { password, password2}= this
      this.loginError = false
      this.submitted = true
      this.errors = []

      if (!(password && password2)) {
        this.loginError = true
        this.errors.push('Please enter a password')
      }
      if (password !== password2) {
        this.loginError = true
        this.errors.push('Oops, passwords do not match')
      }

      if (!this.loginError) {
        console.log('should be doing stuff in create wallet')
        this.addKeyPair(password)
      }
    },
    validEmail: function (email) {
      // eslint-disable-next-line
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
    }
  }
}
</script>

<style>

</style>
