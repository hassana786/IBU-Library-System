const express = require('express');
const fineController = require('../controllers/fineController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.get('/my-fines', authorize(ROLES.STUDENT), fineController.getMyFines);
router.get('/unpaid', authorize(ROLES.STUDENT), fineController.getUnpaidFines);
router.get('/total-unpaid', authorize(ROLES.STUDENT), fineController.getTotalUnpaidFine);
router.post('/pay', authorize(ROLES.STUDENT), fineController.payFine);

// Librarian/Admin routes
router.get('/', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), fineController.getAllFines);
router.get('/stats', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), fineController.getFineStats);

module.exports = router;