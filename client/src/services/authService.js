import apiClient from './api';

const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

const register = (firstName, lastName, email, password, phone, address) => {
  return apiClient.post('/auth/register', {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
  });
};

const getMe = () => {
  return apiClient.get('/auth/me');
};

const logout = () => {
  // Stateless JWT auth: nothing to invalidate server-side, kept for API symmetry.
};

export default {
  login,
  register,
  getMe,
  logout,
};
