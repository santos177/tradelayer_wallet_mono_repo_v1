import axios from 'axios'
// import config from '../../config'

// console.log('config.API_URL')
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:76/api',
  headers: {
    'Content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  validateStatus: (status)=>{
    return status === 200
    
  },
  responseType: 'json'
  /* other custom settings */
})

// test
