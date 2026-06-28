const express = require('express');
const authorController = require('../controllers/authorController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Public (authenticated) routes
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// Librarian/Admin only
router.post('/', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), authorController.createAuthor);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), authorController.updateAuthor);
router.delete('/:id', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), authorController.deleteAuthor);

module.exports = router;