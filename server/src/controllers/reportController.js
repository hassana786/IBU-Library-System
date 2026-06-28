const reportService = require('../services/reportService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');

class ReportController {
  async getDailyReport(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return sendErrorResponse(res, 400, 'Date is required');
      }

      const report = await reportService.getDailyReport(date);

      return sendSuccessResponse(res, 200, 'Daily report retrieved', report);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getMonthlyReport(req, res) {
    try {
      const { year, month } = req.query;

      if (!year || !month) {
        return sendErrorResponse(res, 400, 'Year and month are required');
      }

      const report = await reportService.getMonthlyReport(parseInt(year), parseInt(month));

      return sendSuccessResponse(res, 200, 'Monthly report retrieved', report);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBorrowingReport(req, res) {
    try {
      const { skip = 0, take = 20 } = req.query;

      const report = await reportService.getBorrowingReport(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Borrowing report retrieved', report);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getStudentReport(req, res) {
    try {
      const { studentId } = req.query;

      if (!studentId) {
        return sendErrorResponse(res, 400, 'Student ID is required');
      }

      const report = await reportService.getStudentReport(parseInt(studentId));

      return sendSuccessResponse(res, 200, 'Student report retrieved', report);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBookReport(req, res) {
    try {
      const { bookId } = req.query;

      if (!bookId) {
        return sendErrorResponse(res, 400, 'Book ID is required');
      }

      const report = await reportService.getBookReport(parseInt(bookId));

      return sendSuccessResponse(res, 200, 'Book report retrieved', report);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getMonthlyStatistics(req, res) {
    try {
      const { year, month } = req.query;

      if (!year || !month) {
        return sendErrorResponse(res, 400, 'Year and month are required');
      }

      const stats = await reportService.getMonthlyStatistics(parseInt(year), parseInt(month));

      return sendSuccessResponse(res, 200, 'Monthly statistics retrieved', stats);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new ReportController();