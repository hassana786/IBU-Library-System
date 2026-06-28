const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Public (authenticated) routes
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/stats', bookController.getBookStats);
router.get('/:id', bookController.getBookById);

// Protected routes
router.get('/category/:categoryId', bookController.getBooksByCategory);
router.get('/author/:authorId', bookController.getBooksByAuthor);

// Librarian/Admin only
router.post('/', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), bookController.createBook);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), bookController.updateBook);
router.delete('/:id', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), bookController.deleteBook);

module.exports = router;