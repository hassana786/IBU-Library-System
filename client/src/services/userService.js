import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const userService = {
  getAllUsers: () => axios.get(API_URL),
  registerUser: (userData) => axios.post(`${API_URL}/register`, userData)
};

export default userService;