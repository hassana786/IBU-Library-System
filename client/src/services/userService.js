import apiClient from './api';

const userService = {
  getAllUsers: (skip = 0, take = 10) => apiClient.get('/users', { params: { skip, take } }),
  createUser: (userData) => apiClient.post('/users', userData),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

export default userService;
