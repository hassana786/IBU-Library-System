import apiClient from './api';

const dashboardService = {
  getDashboard: async () => {
    return apiClient.get('/dashboard');
  },
};

export default dashboardService;