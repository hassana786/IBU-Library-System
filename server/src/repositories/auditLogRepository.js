const prisma = require('../config/database');

class AuditLogRepository {
  async create(userId, action, module, details, ipAddress) {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        module,
        details,
        ipAddress,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return await prisma.auditLog.findMany({
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countAll() {
    return await prisma.auditLog.count();
  }

  async findByUserId(userId, skip = 0, take = 10) {
    return await prisma.auditLog.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByModule(module, skip = 0, take = 10) {
    return await prisma.auditLog.findMany({
      where: { module },
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new AuditLogRepository();