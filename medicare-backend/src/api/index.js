import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // change to deployed URL in production
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  // or AsyncStorage for React Native
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;