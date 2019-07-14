import {axiosInstance} from '../api'

// export auth service
export const authService = {
  postLogin,
  getAuthenticate,
  postRefresh
}

// we need user object to be returned from postWalletLogin
function postLogin (data) {
  return axiosInstance.post('/postWalletLogin', {
    uuid: data.uuid,
    password: data.password
  })
    .then(response => response.data)
    .catch(error => Promise.reject(error.response))
}

function getAuthenticate () {
  return axiosInstance.get('/getAuthenticate')
    .then(response => response.data)
    .catch(error => Promise.reject(error.response))
}

function postRefresh (token) {
  return axiosInstance.post('/postRefreshToken', { token: token })
    .then(response => response.data)
    .catch(error => Promise.reject(error.response))
}
