const prisma = require('../config/database');
const { SAFE_USER_SELECT } = require('../utils/safeUserSelect');

class ReservationRepository {
  async create(data) {
    return await prisma.reservation.create({
      data,
      include: {
        user: { select: SAFE_USER_SELECT },
        book: true,
      },
    });
  }

  async findById(id) {
    return await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: { select: SAFE_USER_SELECT },
        book: true,
      },
    });
  }

  async findByUserId(userId, skip = 0, take = 10) {
    return await prisma.reservation.findMany({
      where: { userId },
      skip,
      take,
      include: {
        book: true,
      },
      orderBy: { reservationDate: 'desc' },
    });
  }

  async findByBookId(bookId, skip = 0, take = 10) {
    return await prisma.reservation.findMany({
      where: { bookId },
      skip,
      take,
      include: {
        user: { select: SAFE_USER_SELECT },
      },
      orderBy: { reservationDate: 'asc' },
    });
  }

  async findPendingByBookId(bookId) {
    return await prisma.reservation.findMany({
      where: {
        bookId,
        status: 'pending',
      },
      include: {
        user: { select: SAFE_USER_SELECT },
      },
      orderBy: { reservationDate: 'asc' },
    });
  }

  async findActiveByUserAndBook(userId, bookId) {
    return await prisma.reservation.findFirst({
      where: {
        userId,
        bookId,
        status: { in: ['pending', 'ready'] },
      },
    });
  }

  async update(id, data) {
    return await prisma.reservation.update({
      where: { id },
      data,
      include: {
        user: { select: SAFE_USER_SELECT },
        book: true,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return await prisma.reservation.findMany({
      skip,
      take,
      include: {
        user: { select: SAFE_USER_SELECT },
        book: true,
      },
      orderBy: { reservationDate: 'desc' },
    });
  }

  async countAll() {
    return await prisma.reservation.count();
  }

  async countByUserId(userId) {
    return await prisma.reservation.count({ where: { userId } });
  }

  async countByBookId(bookId) {
    return await prisma.reservation.count({ where: { bookId } });
  }

  async countByStatus(status) {
    return await prisma.reservation.count({
      where: { status },
    });
  }

  async delete(id) {
    return await prisma.reservation.delete({
      where: { id },
    });
  }
}

module.exports = new ReservationRepository();