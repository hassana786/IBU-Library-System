import apiClient from './api';

const fineService = {
  getMyFines: async (skip = 0, take = 10) => {
    return apiClient.get('/fines/my-fines', {
      params: { skip, take },
    });
  },

  getUnpaidFines: async () => {
    return apiClient.get('/fines/unpaid');
  },

  getTotalUnpaidFine: async () => {
    return apiClient.get('/fines/total-unpaid');
  },

  payFine: async (fineId) => {
    return apiClient.post('/fines/pay', {
      fineId,
    });
  },

  getAllFines: async (skip = 0, take = 10) => {
    return apiClient.get('/fines', {
      params: { skip, take },
    });
  },

  getFineStats: async () => {
    return apiClient.get('/fines/stats');
  },
};

export default fineService;