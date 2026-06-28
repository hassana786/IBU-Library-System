const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');

class AuditLogController {
  async getAuditLogs(req, res) {
    try {
      const { skip = 0, take = 20 } = req.query;

      const logs = await auditLogService.getAuditLogs(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Audit logs retrieved', logs);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getUserAuditLogs(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return sendErrorResponse(res, 400, 'User ID is required');
      }

      const logs = await auditLogService.getUserAuditLogs(parseInt(userId));

      return sendSuccessResponse(res, 200, 'User audit logs retrieved', logs);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getModuleAuditLogs(req, res) {
    try {
      const { module } = req.query;

      if (!module) {
        return sendErrorResponse(res, 400, 'Module is required');
      }

      const logs = await auditLogService.getModuleAuditLogs(module);

      return sendSuccessResponse(res, 200, 'Module audit logs retrieved', logs);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new AuditLogController();