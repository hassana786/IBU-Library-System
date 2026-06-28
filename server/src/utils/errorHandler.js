class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const sendSuccessResponse = (res, statusCode = 200, message = 'Operation successful', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

module.exports = { AppError, sendErrorResponse, sendSuccessResponse };