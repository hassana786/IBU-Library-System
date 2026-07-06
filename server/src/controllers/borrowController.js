const borrowingService = require('../services/borrowingService');
const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { AUDIT_MODULES } = require('../constants');

class BorrowingController {
  async borrowBook(req, res) {
    try {
      const { bookId, dueDays } = req.body;
      const userId = req.user.id;

      const borrowing = await borrowingService.borrowBook(userId, parseInt(bookId), dueDays || 14);

      await auditLogService.logAction(
        userId,
        'CREATE',
        AUDIT_MODULES.BORROWING,
        `Book borrowed: ${bookId}`,
        req.ip
      );

      return sendSuccessResponse(res, 201, 'Book borrowed successfully', borrowing);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async returnBook(req, res) {
    try {
      const { borrowingId } = req.body;

      const borrowing = await borrowingService.returnBook(parseInt(borrowingId), req.user);

      await auditLogService.logAction(
        req.user.id,
        'UPDATE',
        AUDIT_MODULES.BORROWING,
        `Book returned: ${borrowingId}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Book returned successfully', borrowing);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBorrowingHistory(req, res) {
    try {
      const userId = req.user.id;
      const { skip = 0, take = 10 } = req.query;

      const history = await borrowingService.getBorrowingHistory(userId, parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Borrowing history retrieved', history);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getActiveBorrowings(req, res) {
    try {
      const userId = req.user.id;

      const borrowings = await borrowingService.getActiveBorrowings(userId);

      return sendSuccessResponse(res, 200, 'Active borrowings retrieved', borrowings);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getAllBorrowings(req, res) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const borrowings = await borrowingService.getAllBorrowings(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'All borrowings retrieved', borrowings);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBorrowingStats(req, res) {
    try {
      const stats = await borrowingService.getBorrowingStats();

      return sendSuccessResponse(res, 200, 'Borrowing statistics retrieved', stats);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new BorrowingController();