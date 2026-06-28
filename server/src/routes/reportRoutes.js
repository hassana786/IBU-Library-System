const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication and admin/librarian role
router.use(authMiddleware);
router.use(authorize(ROLES.ADMIN, ROLES.LIBRARIAN));

// Report routes
router.get('/daily', reportController.getDailyReport);
router.get('/monthly', reportController.getMonthlyReport);
router.get('/borrowing', reportController.getBorrowingReport);
router.get('/student', reportController.getStudentReport);
router.get('/book', reportController.getBookReport);
router.get('/statistics/monthly', reportController.getMonthlyStatistics);

module.exports = router;