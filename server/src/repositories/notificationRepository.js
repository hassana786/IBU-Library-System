const prisma = require('../config/database');

class NotificationRepository {
  async create(data) {
    return await prisma.notification.create({
      data,
    });
  }

  async findByUserId(userId, skip = 0, take = 10) {
    return await prisma.notification.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return await prisma.notification.findUnique({
      where: { id },
    });
  }

  async findUnreadByUserId(userId) {
    return await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id) {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsReadByUserId(userId) {
    return await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  }

  async delete(id) {
    return await prisma.notification.delete({
      where: { id },
    });
  }

  async countUnreadByUserId(userId) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}

module.exports = new NotificationRepository();