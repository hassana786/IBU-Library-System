const categoryService = require('../services/categoryService');
const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { AUDIT_MODULES } = require('../constants');

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const categories = await categoryService.getAllCategories(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Categories retrieved successfully', categories);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      const category = await categoryService.getCategoryById(parseInt(id));

      return sendSuccessResponse(res, 200, 'Category retrieved successfully', category);
    } catch (error) {
      return sendErrorResponse(res, 404, error.message);
    }
  }

  async createCategory(req, res) {
    try {
      const { name, description } = req.body;

      const category = await categoryService.createCategory(name, description);

      await auditLogService.logAction(
        req.user.id,
        'CREATE',
        AUDIT_MODULES.USER,
        `Category created: ${name}`,
        req.ip
      );

      return sendSuccessResponse(res, 201, 'Category created successfully', category);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await categoryService.updateCategory(parseInt(id), updateData);

      await auditLogService.logAction(
        req.user.id,
        'UPDATE',
        AUDIT_MODULES.USER,
        `Category updated: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Category updated successfully', category);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      await categoryService.deleteCategory(parseInt(id));

      await auditLogService.logAction(
        req.user.id,
        'DELETE',
        AUDIT_MODULES.USER,
        `Category deleted: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Category deleted successfully');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new CategoryController();