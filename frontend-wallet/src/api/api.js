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
    if( status === 200){
      return true
    } else {
      console.warn('ERROR DETECTED', status);
      return false
      
    }
    
  },
  responseType: 'json'
  /* other custom settings */
})

// test
