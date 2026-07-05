const authService = require('../services/authService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');

class AuthController {
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, phone, address } = req.body;

      const result = await authService.register(firstName, lastName, email, password, phone, address);

      return sendSuccessResponse(res, 201, 'Registration successful', result);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return sendSuccessResponse(res, 200, 'Login successful', result);
    } catch (error) {
      return sendErrorResponse(res, 401, error.message);
    }
  }

  async getMe(req, res) {
    try {
      const profile = await authService.getProfile(req.user.id);

      return sendSuccessResponse(res, 200, 'Profile retrieved successfully', profile);
    } catch (error) {
      return sendErrorResponse(res, 404, error.message);
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(req.user.id, currentPassword, newPassword);

      return sendSuccessResponse(res, 200, 'Password changed successfully');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new AuthController();
