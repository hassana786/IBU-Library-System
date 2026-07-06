const notificationService = require('../services/notificationService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { skip = 0, take = 10 } = req.query;

      const notifications = await notificationService.getNotificationsForUser(userId, parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Notifications retrieved', notifications);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getUnreadNotifications(req, res) {
    try {
      const userId = req.user.id;

      const notifications = await notificationService.getUnreadNotificationsForUser(userId);

      return sendSuccessResponse(res, 200, 'Unread notifications retrieved', notifications);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async countUnread(req, res) {
    try {
      const userId = req.user.id;

      const count = await notificationService.countUnreadNotifications(userId);

      return sendSuccessResponse(res, 200, 'Unread count retrieved', { count });
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async markAsRead(req, res) {
    try {
      const { notificationId } = req.body;

      await notificationService.markNotificationAsRead(parseInt(notificationId), req.user.id);

      return sendSuccessResponse(res, 200, 'Notification marked as read');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      await notificationService.markAllNotificationsAsRead(userId);

      return sendSuccessResponse(res, 200, 'All notifications marked as read');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async deleteNotification(req, res) {
    try {
      const { notificationId } = req.body;

      await notificationService.deleteNotification(parseInt(notificationId), req.user.id);

      return sendSuccessResponse(res, 200, 'Notification deleted');
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new NotificationController();