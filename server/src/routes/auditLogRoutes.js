const express = require('express');
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(authorize(ROLES.ADMIN));

// Audit log routes
router.get('/', auditLogController.getAuditLogs);
router.get('/user', auditLogController.getUserAuditLogs);
router.get('/module', auditLogController.getModuleAuditLogs);

module.exports = router;