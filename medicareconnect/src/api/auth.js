import API from './index';

export const register = (data) => API.post('/auth/register', data);

export const login = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  localStorage.setItem('token',      res.data.token);
  localStorage.setItem('userId',     res.data.user.id);
  localStorage.setItem('role',       res.data.user.role);
  localStorage.setItem('name',       res.data.user.name);
  return res.data.user;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};