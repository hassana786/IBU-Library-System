const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Admin only
router.get('/', authorize(ROLES.ADMIN), userController.getAllUsers);
router.post('/', authorize(ROLES.ADMIN), userController.createUser);
router.get('/:id', authorize(ROLES.ADMIN), userController.getUserById);
router.put('/:id', authorize(ROLES.ADMIN), userController.updateUser);
router.delete('/:id', authorize(ROLES.ADMIN), userController.deleteUser);
router.get('/stats/dashboard', authorize(ROLES.ADMIN), userController.getDashboardStats);

module.exports = router;