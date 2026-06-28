const auditLogRepository = require('../repositories/auditLogRepository');
const prisma = require('../config/database');

class AuditLogService {
  async logAction(userId, action, module, details = null, ipAddress = null) {
    return await auditLogRepository.create(userId, action, module, details, ipAddress);
  }

  async getAuditLogs(skip = 0, take = 20) {
    const logs = await auditLogRepository.findAll(skip, take);
    const total = await auditLogRepository.countAll();

    return {
      logs,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getUserAuditLogs(userId, skip = 0, take = 20) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await auditLogRepository.findByUserId(userId, skip, take);
  }

  async getModuleAuditLogs(module, skip = 0, take = 20) {
    return await auditLogRepository.findByModule(module, skip, take);
  }
}

module.exports = new AuditLogService();