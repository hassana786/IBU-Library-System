const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User notification routes
router.get('/', notificationController.getNotifications);
router.get('/unread', notificationController.getUnreadNotifications);
router.get('/unread/count', notificationController.countUnread);
router.post('/mark-read', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.post('/delete', notificationController.deleteNotification);

module.exports = router;