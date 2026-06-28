const bookService = require('../services/bookService');
const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { AUDIT_MODULES } = require('../constants');

class BookController {
  async getAllBooks(req, res) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const books = await bookService.getAllBooks(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Books retrieved successfully', books);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBookById(req, res) {
    try {
      const { id } = req.params;

      const book = await bookService.getBookById(parseInt(id));

      return sendSuccessResponse(res, 200, 'Book retrieved successfully', book);
    } catch (error) {
      return sendErrorResponse(res, 404, error.message);
    }
  }

  async searchBooks(req, res) {
    try {
      const { query, skip = 0, take = 10 } = req.query;

      const books = await bookService.searchBooks(query, parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Books found', books);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBooksByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { skip = 0, take = 10 } = req.query;

      const books = await bookService.getBooksByCategory(parseInt(categoryId), parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Books retrieved successfully', books);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBooksByAuthor(req, res) {
    try {
      const { authorId } = req.params;
      const { skip = 0, take = 10 } = req.query;

      const books = await bookService.getBooksByAuthor(parseInt(authorId), parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Books retrieved successfully', books);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async createBook(req, res) {
    try {
      const { title, isbn, description, authorId, categoryId, quantity } = req.body;

      const book = await bookService.createBook(title, isbn, description, parseInt(authorId), parseInt(categoryId), parseInt(quantity));

      await auditLogService.logAction(
        req.user.id,
        'CREATE',
        AUDIT_MODULES.BOOK,
        `Book created: ${isbn}`,
        req.ip
      );

      return sendSuccessResponse(res, 201, 'Book created successfully', book);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const book = await bookService.updateBook(parseInt(id), updateData);

      await auditLogService.logAction(
        req.user.id,
        'UPDATE',
        AUDIT_MODULES.BOOK,
        `Book updated: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Book updated successfully', book);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async deleteBook(req, res) {
    try {
      const { id } = req.params;

      await bookService.deleteBook(parseInt(id));

      await auditLogService.logAction(
        req.user.id,
        'DELETE',
        AUDIT_MODULES.BOOK,
        `Book deleted: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Book deleted successfully');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBookStats(req, res) {
    try {
      const stats = await bookService.getBookStats();

      return sendSuccessResponse(res, 200, 'Book statistics retrieved', stats);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new BookController();