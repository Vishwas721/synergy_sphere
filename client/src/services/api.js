import axios from 'axios';

// Create an instance of axios with a base URL for your backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  REQUEST INTERCEPTOR

  This is a powerful axios feature. Before any request is sent from
  the React app, this interceptor checks if we have a token in
  localStorage. If we do, it adds it to the request's Authorization header.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Configure the header to send the token
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;