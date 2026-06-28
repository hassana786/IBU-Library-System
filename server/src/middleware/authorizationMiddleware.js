const { sendErrorResponse } = require('../utils/errorHandler');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 401, 'User not authenticated');
    }

    if (!roles.includes(req.user.role.name)) {
      return sendErrorResponse(res, 403, 'Insufficient permissions');
    }

    next();
  };
};

module.exports = authorize;