const express = require('express');
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.post('/borrow', authorize(ROLES.STUDENT), borrowController.borrowBook);
router.post('/return', authorize(ROLES.STUDENT), borrowController.returnBook);
router.get('/my-history', authorize(ROLES.STUDENT), borrowController.getBorrowingHistory);
router.get('/active', authorize(ROLES.STUDENT), borrowController.getActiveBorrowings);

// Librarian/Admin routes
router.get('/', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), borrowController.getAllBorrowings);
router.get('/stats', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), borrowController.getBorrowingStats);

module.exports = router;