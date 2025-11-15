import axios from 'axios'; 

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
     response => response,
      async error => {
         const originalRequest = error.config;
         
         if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
             originalRequest._retry = true; 
             
             try {
                 await axios.get('http://localhost:3000/refresh-token');
                  return axios(originalRequest); // retry original request 
                }
                 catch (err) { 
                    //  Refresh token failed: redirect to login
                     window.location.href = '/'; 
                     return Promise.reject(err); } }
                      return Promise.reject(error);
                     } 
                    );
                    
export default axios;   