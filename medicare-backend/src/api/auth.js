// src/api/auth.js
import API from './index';

export const login = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);  // save token
  return res.data.user;
};

export const register = async (userData) => {
  const res = await API.post('/auth/register', userData);
  return res.data;
};