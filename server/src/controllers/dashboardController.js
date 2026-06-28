const dashboardService = require('../services/dashboardService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { ROLES } = require('../constants');

class DashboardController {
  async getDashboard(req, res) {
    try {
      const userRole = req.user.role.name;

      let data;

      if (userRole === ROLES.ADMIN) {
        data = await dashboardService.getAdminDashboard();
      } else if (userRole === ROLES.LIBRARIAN) {
        data = await dashboardService.getLibrarianDashboard();
      } else if (userRole === ROLES.STUDENT) {
        data = await dashboardService.getStudentDashboard(req.user.id);
      }

      return sendSuccessResponse(res, 200, 'Dashboard data retrieved', data);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new DashboardController();