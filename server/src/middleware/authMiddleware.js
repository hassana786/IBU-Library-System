const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/database');
const { sendErrorResponse } = require('../utils/errorHandler');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendErrorResponse(res, 401, 'Authorization header missing');
    }

    // 2. Check Bearer format
    if (!authHeader.startsWith('Bearer ')) {
      return sendErrorResponse(res, 401, 'Invalid token format');
    }

    // 3. Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendErrorResponse(res, 401, 'Token not provided');
    }

    // 4. Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return sendErrorResponse(res, 401, 'Invalid or expired token');
    }

    // 5. Debug (optional but very useful)
    console.log("DECODED TOKEN:", decoded);

    // 6. Find user in DB
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id || decoded.userId, // supports both formats
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return sendErrorResponse(res, 401, 'User not found');
    }

    // 7. Check if active
    if (!user.isActive) {
      return sendErrorResponse(res, 401, 'User account is inactive');
    }

    // 8. Attach user to request
    req.user = user;

    // 9. Continue
    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return sendErrorResponse(res, 401, 'Authentication failed');
  }
};

module.exports = authMiddleware;