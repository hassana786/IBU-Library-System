const authorService = require('../services/authorService');
const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { AUDIT_MODULES } = require('../constants');

class AuthorController {
  async getAllAuthors(req, res) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const authors = await authorService.getAllAuthors(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Authors retrieved successfully', authors);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getAuthorById(req, res) {
    try {
      const { id } = req.params;

      const author = await authorService.getAuthorById(parseInt(id));

      return sendSuccessResponse(res, 200, 'Author retrieved successfully', author);
    } catch (error) {
      return sendErrorResponse(res, 404, error.message);
    }
  }

  async createAuthor(req, res) {
    try {
      const { name, bio } = req.body;

      const author = await authorService.createAuthor(name, bio);

      await auditLogService.logAction(
        req.user.id,
        'CREATE',
        AUDIT_MODULES.USER,
        `Author created: ${name}`,
        req.ip
      );

      return sendSuccessResponse(res, 201, 'Author created successfully', author);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async updateAuthor(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const author = await authorService.updateAuthor(parseInt(id), updateData);

      await auditLogService.logAction(
        req.user.id,
        'UPDATE',
        AUDIT_MODULES.USER,
        `Author updated: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Author updated successfully', author);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async deleteAuthor(req, res) {
    try {
      const { id } = req.params;

      await authorService.deleteAuthor(parseInt(id));

      await auditLogService.logAction(
        req.user.id,
        'DELETE',
        AUDIT_MODULES.USER,
        `Author deleted: ${id}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Author deleted successfully');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new AuthorController();