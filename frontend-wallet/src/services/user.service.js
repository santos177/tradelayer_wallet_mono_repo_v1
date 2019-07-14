// user.service
// does the api calls to backend for wallet
import {axiosInstance} from '../api'

// export userService
export const userService = {
  postCreateWallet,
  postChallenge,
  postUUIDValidate,
  getUUIDCreate,
  postCreateFundedAddress,
  postLoginFundedAddress,
  postUpdateWalletBlob,
  postNewAddress
}

// function login (uuid, password, publicKey) {
//   return axiosInstance.post('/postWalletLogin', {
//     uuid: uuid
//     // mfatoken: mfatoken
//   })
// }
function postCreateFundedAddress (username) {
  // console.log('in Create Funded Address')
  return axiosInstance.post('http://45.7.230.193:76/SignUp', {
    username: username,
    password: 'pepe'
  })
}

function postLoginFundedAddress (username) {
  // console.log('in Create Funded Address')
  return axiosInstance.post('http://45.7.230.193:76/SignIn', {
    username: username,
    password: 'pepe'
  })
}
// does api call of getUUIDcreate
// returns promise of getUUIDcreate with uuid as result of promise
function getUUIDCreate () {
  // console.log('in getUUIDcreate service')
  return axiosInstance.get('/getUUIDCreate')
}

// does api call of postUUIDValidate
// inputs: uuid
// outputs: JSON object true or false if v4 of uuid
function postUUIDValidate (uuid) {
  // console.log('in postUUIDValidate service')
  return axiosInstance.post('/postUUIDValidate', {
    uuid: uuid
  })
}

// does api call of postChallenge
// input: uuid
// returns json response of postChallenge api results
// response = {
//      'salt': salt,
//      'pow_challenge': pow_challenge,
//      'challenge': challenge
//   }
function postChallenge (uuid) {
  return axiosInstance.post('/postChallenge', {
    headers: {
      'Content-type': 'application/json'
    },
    withCredentials: false,
    uuid: uuid
  })
}

// post New address
function postNewAddress (uuid) {
  return axiosInstance.post('/postNewAddress',
    {
      headers: {
        'Content-type': 'application/json'
      },
      withCredentials: false,
      uuid: uuid
    })
} // end of postNewAddress

// does api call of postCreateWallet
// inputs:  input:uuid, email,publicKey, wallet
// returns json result of api postCreateWallet
function postCreateWallet (password, uuid, email, encryptedWallet) {
  return axiosInstance.post('/postCreateWallet',
    {
      headers: {
        'Content-type': 'application/json'
      },
      withCredentials: false,
      password: password,
      uuid: uuid,
      email: email,
      encryptedWallet: encryptedWallet
    })
} // end of postCreateWallet

// postUpdateWalletBlob
// inputs: uuid and encrypted wallet
// returns JSON string of result of UpdateWalletBlob
function postUpdateWalletBlob (uuid, encryptedWallet) {
  return axiosInstance.post('/postUpdateWalletBlob',
    {
      headers: {
        'Content-type': 'application/json'
      },
      withCredentials: false,
      uuid: uuid,
      encryptedWallet: encryptedWallet
    })
}
