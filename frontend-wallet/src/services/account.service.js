// account.service
// does the api calls to backend for wallet
import {axiosInstance} from '../api'

// export account service
export const accountService = {
  postLogin
}

// postLogin
// calls postWalletLogin api
// inputs: uuid, nonce, publicKey, mfatoken
// outputs: wallet and asq question
function postLogin (uuid, nonce, publicKey, mfatoken) {
  //in account post Login
  return axiosInstance.post('/postWalletLogin', {
    nonce: nonce,
    uuid: uuid,
    mfatoken: mfatoken
  })
}
