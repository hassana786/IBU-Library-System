import apiClient from './api';

const borrowingService = {
  borrowBook: async (bookId, dueDays = 14) => {
    return apiClient.post('/borrowings/borrow', {
      bookId,
      dueDays,
    });
  },

  returnBook: async (borrowingId) => {
    return apiClient.post('/borrowings/return', {
      borrowingId,
    });
  },

  getMyBorrowingHistory: async (skip = 0, take = 10) => {
    return apiClient.get('/borrowings/my-history', {
      params: { skip, take },
    });
  },

  getActiveBorrowings: async () => {
    return apiClient.get('/borrowings/active');
  },

  getAllBorrowings: async (skip = 0, take = 10) => {
    return apiClient.get('/borrowings', {
      params: { skip, take },
    });
  },

  getBorrowingStats: async () => {
    return apiClient.get('/borrowings/stats');
  },
};

export default borrowingService;