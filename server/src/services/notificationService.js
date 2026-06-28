const notificationRepository = require('../repositories/notificationRepository');
const prisma = require('../config/database');

class NotificationService {
  async getNotificationsForUser(userId, skip = 0, take = 10) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const notifications = await notificationRepository.findByUserId(userId, skip, take);
    const total = notifications.length;

    return {
      notifications,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getUnreadNotificationsForUser(userId) {
    return await notificationRepository.findUnreadByUserId(userId);
  }

  async countUnreadNotifications(userId) {
    return await notificationRepository.countUnreadByUserId(userId);
  }

  async markNotificationAsRead(notificationId) {
    const notification = await notificationRepository.markAsRead(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  async markAllNotificationsAsRead(userId) {
    return await notificationRepository.markAllAsReadByUserId(userId);
  }

  async deleteNotification(notificationId) {
    return await notificationRepository.delete(notificationId);
  }
}

module.exports = new NotificationService();