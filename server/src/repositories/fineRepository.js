const prisma = require('../config/database');

class FineRepository {
  async create(data) {
    return await prisma.fine.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async findById(id) {
    return await prisma.fine.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId, skip = 0, take = 10) {
    return await prisma.fine.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnpaidByUserId(userId) {
    return await prisma.fine.findMany({
      where: {
        userId,
        status: 'unpaid',
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getTotalUnpaidByUserId(userId) {
    const result = await prisma.fine.aggregate({
      where: {
        userId,
        status: 'unpaid',
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async update(id, data) {
    return await prisma.fine.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return await prisma.fine.findMany({
      skip,
      take,
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countUnpaid() {
    return await prisma.fine.count({
      where: { status: 'unpaid' },
    });
  }

  async getTotalUnpaid() {
    const result = await prisma.fine.aggregate({
      where: { status: 'unpaid' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}

module.exports = new FineRepository();