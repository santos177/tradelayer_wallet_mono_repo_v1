import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
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
