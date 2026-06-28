const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Public (authenticated) routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Librarian/Admin only
router.post('/', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), categoryController.createCategory);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), categoryController.updateCategory);
router.delete('/:id', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), categoryController.deleteCategory);

module.exports = router;