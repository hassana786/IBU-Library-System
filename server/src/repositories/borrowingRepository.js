const prisma = require('../config/database');

class BorrowingRepository {
  async create(data) {
    return await prisma.borrowing.create({
      data,
      include: {
        user: true,
        book: true,
      },
    });
  }

  async findById(id) {
    return await prisma.borrowing.findUnique({
      where: { id },
      include: {
        user: true,
        book: true,
      },
    });
  }

  async findByUserId(userId, skip = 0, take = 10) {
    return await prisma.borrowing.findMany({
      where: { userId },
      skip,
      take,
      include: {
        book: true,
      },
      orderBy: { borrowDate: 'desc' },
    });
  }

  async findActiveByUserId(userId) {
    return await prisma.borrowing.findMany({
      where: {
        userId,
        status: 'active',
      },
      include: {
        book: true,
      },
    });
  }

  async findByBookId(bookId, skip = 0, take = 10) {
    return await prisma.borrowing.findMany({
      where: { bookId },
      skip,
      take,
      include: {
        user: true,
      },
      orderBy: { borrowDate: 'desc' },
    });
  }

  async findOverdue() {
    return await prisma.borrowing.findMany({
      where: {
        status: 'active',
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        user: true,
        book: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.borrowing.update({
      where: { id },
      data,
      include: {
        user: true,
        book: true,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return await prisma.borrowing.findMany({
      skip,
      take,
      include: {
        user: true,
        book: true,
      },
      orderBy: { borrowDate: 'desc' },
    });
  }

  async countAll() {
    return await prisma.borrowing.count();
  }

  async countActive() {
    return await prisma.borrowing.count({
      where: { status: 'active' },
    });
  }

  async countByStatus(status) {
    return await prisma.borrowing.count({
      where: { status },
    });
  }
}

module.exports = new BorrowingRepository();