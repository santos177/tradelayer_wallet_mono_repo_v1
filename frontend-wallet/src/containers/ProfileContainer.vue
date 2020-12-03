<template>
  <md-card class='profile-card'>
      <md-card-header>
          <h2>Preferances</h2>
      </md-card-header>
      <div class='email-container'>
        <span>Email Address: </span> 
        <input class='email-input' value='myEmail@domain.com' placeholder="Enter Your Email..." />
        <md-button class='md-primary md-raised email-save-button'>Save</md-button>
      </div>
      <p>/Error/ /Warning/ /Success/ Message</p>


          <div class='email-settings-container '>
            <p style='color: skyblue'>Email Notifications</p>
            <md-checkbox class="md-primary" v-model='notifications[0]'>Margin call (maximum once per 24 hours)</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[1]'>Liquidation (maximum once per 10 min)</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[2]'>Login (always on)</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[3]'>On-page Notifications</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[4]'>Trade notification popups</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[5]'>Confirmation Dialogs</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[6]'>Token Order Confirmation Dialog</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[7]'>LTC Order Confirmation Dialog</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[8]'>Contract Order Confirmation Dialog</md-checkbox>
            <md-checkbox class="md-primary" v-model='notifications[9]'>Immediate Deep Execution Warning</md-checkbox>
          </div>

        <div class='email-settings-container '>
            <p style='color: skyblue'>Sounds</p>
            <md-checkbox v-model='sounds[0]'>Order co-signed</md-checkbox>
            <md-checkbox v-model='sounds[1]'>Order confirmed</md-checkbox>
          </div>

        <div class='email-settings-container '>
            <p style='color: skyblue'>My Acceptable Whitelists</p>
            Default KYC: 0
        </div>
  </md-card>
</template>

<script>
export default {
  name: "ProfileContainer",
  components: { },
  data() {
      return {
          notifications: [false,false,false,false,false,false,false,false,false,false],
          sounds: [true,true],
          kyc: [],
      }
  }
};
</script>

<style>
.profile-card {
    max-width: 50rem;
    margin: 1rem auto;
    padding-bottom: 5rem;
}
.email-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.email-save-button {
    height: 2rem;
}
.email-input {
    height: 2rem; 
    margin: 0 1rem;
    background: unset;
    border: unset;
    border-bottom: 1px solid gray;
    font-size: 1rem;
    color:wheat
}
.email-settings-container {
    display:flex;
    flex-direction: column; 
    align-items:center;
    width: 20rem;
    margin: 2rem auto;
}
.md-checkbox {
    margin: 0.2rem;
    width: 100%;
    color:white;
}
</style>
