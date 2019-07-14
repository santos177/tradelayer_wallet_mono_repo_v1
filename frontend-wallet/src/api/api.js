import axios from 'axios'
// import config from '../../config'

// console.log('config.API_URL')
export const axiosInstance = axios.create({
  baseURL: 'http://23.239.17.224:5001/api',
  headers: {
    'Content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
  /* other custom settings */
})

// test
