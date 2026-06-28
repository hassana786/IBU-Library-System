import apiClient from './api';

const bookService = {
  getAllBooks: async (skip = 0, take = 10) => {
    return apiClient.get('/books', {
      params: { skip, take },
    });
  },

  getBookById: async (id) => {
    return apiClient.get(`/books/${id}`);
  },

  searchBooks: async (query, skip = 0, take = 10) => {
    return apiClient.get('/books/search', {
      params: { query, skip, take },
    });
  },

  getBooksByCategory: async (categoryId, skip = 0, take = 10) => {
    return apiClient.get(`/books/category/${categoryId}`, {
      params: { skip, take },
    });
  },

  getBooksByAuthor: async (authorId, skip = 0, take = 10) => {
    return apiClient.get(`/books/author/${authorId}`, {
      params: { skip, take },
    });
  },

  createBook: async (bookData) => {
    return apiClient.post('/books', bookData);
  },

  updateBook: async (id, bookData) => {
    return apiClient.put(`/books/${id}`, bookData);
  },

  deleteBook: async (id) => {
    return apiClient.delete(`/books/${id}`);
  },

  getBookStats: async () => {
    return apiClient.get('/books/stats');
  },
};

export default bookService;