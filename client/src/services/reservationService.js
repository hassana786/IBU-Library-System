import apiClient from './api';

const reservationService = {
  reserveBook: async (bookId) => {
    return apiClient.post('/reservations', {
      bookId,
    });
  },

  cancelReservation: async (reservationId) => {
    return apiClient.delete('/reservations', {
      data: { reservationId },
    });
  },

  getMyReservations: async (skip = 0, take = 10) => {
    return apiClient.get('/reservations/my-reservations', {
      params: { skip, take },
    });
  },

  getBookReservations: async (bookId, skip = 0, take = 10) => {
    return apiClient.get(`/reservations/book/${bookId}`, {
      params: { skip, take },
    });
  },

  getAllReservations: async (skip = 0, take = 10) => {
    return apiClient.get('/reservations', {
      params: { skip, take },
    });
  },

  getReservationStats: async () => {
    return apiClient.get('/reservations/stats');
  },
};

export default reservationService;