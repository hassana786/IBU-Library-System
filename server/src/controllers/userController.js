const userService = require('../services/userService');
const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { AUDIT_MODULES } = require('../constants');

class UserController {
  async getAllUsers(req, res) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const users = await userService.getAllUsers(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(parseInt(id));

      return sendSuccessResponse(res, 200, 'User retrieved successfully', user);
    } catch (error) {
      return sendErrorResponse(res, 404, error.message);
    }
  }

  async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, roleId, phone, address } = req.body;

      const user = await userService.createUser(firstName, lastName, email, password, parseInt(roleId), phone, address);

      await auditLogService.logAction(
        req.user.id,
        'CREATE',
        AUDIT_MODULES.USER,
        `User created: ${email}`,
        req.ip
      );

      return sendSuccessResponse(res, 201, 'User created successfully', user);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await userService.updateUser(parseInt(id), updateData);

      await auditLogService.logAction(
        req.user.id,
        'UPDATE',
        AUDIT_MODULES.USER,
        `User updated: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'User updated successfully', user);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await userService.deleteUser(parseInt(id));

      await auditLogService.logAction(
        req.user.id,
        'DELETE',
        AUDIT_MODULES.USER,
        `User deleted: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'User deleted successfully');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getDashboardStats(req, res) {
    try {
      const stats = await userService.getDashboardStats();

      return sendSuccessResponse(res, 200, 'Dashboard statistics retrieved', stats);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new UserController();