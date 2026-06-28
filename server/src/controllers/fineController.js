const fineService = require('../services/fineService');
const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { AUDIT_MODULES } = require('../constants');

class FineController {
  async getMyFines(req, res) {
    try {
      const userId = req.user.id;
      const { skip = 0, take = 10 } = req.query;

      const fines = await fineService.getFinesForUser(userId, parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Fines retrieved', fines);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getUnpaidFines(req, res) {
    try {
      const userId = req.user.id;

      const fines = await fineService.getUnpaidFinesForUser(userId);

      return sendSuccessResponse(res, 200, 'Unpaid fines retrieved', fines);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getTotalUnpaidFine(req, res) {
    try {
      const userId = req.user.id;

      const total = await fineService.getTotalUnpaidFineForUser(userId);

      return sendSuccessResponse(res, 200, 'Total unpaid fine retrieved', { total });
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async payFine(req, res) {
    try {
      const { fineId } = req.body;

      const fine = await fineService.payFine(parseInt(fineId));

      await auditLogService.logAction(
        req.user.id,
        'UPDATE',
        AUDIT_MODULES.BORROWING,
        `Fine paid: ${fineId}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Fine paid successfully', fine);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getAllFines(req, res) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const fines = await fineService.getAllFines(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'All fines retrieved', fines);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getFineStats(req, res) {
    try {
      const stats = await fineService.getFineStats();

      return sendSuccessResponse(res, 200, 'Fine statistics retrieved', stats);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new FineController();