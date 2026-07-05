const fineRepository = require('../repositories/fineRepository');
const prisma = require('../config/database');
const { ROLES } = require('../constants');

class FineService {
  async getFinesForUser(userId, skip = 0, take = 10) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const fines = await fineRepository.findByUserId(userId, skip, take);
    const total = await fineRepository.countByUserId(userId);

    return {
      fines,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getUnpaidFinesForUser(userId) {
    return await fineRepository.findUnpaidByUserId(userId);
  }

  async getTotalUnpaidFineForUser(userId) {
    return await fineRepository.getTotalUnpaidByUserId(userId);
  }

  async payFine(fineId, requestingUser) {
    const fine = await fineRepository.findById(fineId);
    if (!fine) {
      throw new Error('Fine not found');
    }

    if (requestingUser.role.name === ROLES.STUDENT && fine.userId !== requestingUser.id) {
      throw new Error('You are not authorized to pay this fine');
    }

    if (fine.status === 'paid') {
      throw new Error('Fine is already paid');
    }

    return await fineRepository.update(fineId, {
      status: 'paid',
      paidDate: new Date(),
    });
  }

  async getAllFines(skip = 0, take = 10) {
    const fines = await fineRepository.findAll(skip, take);
    const total = await fineRepository.countAll();

    return {
      fines,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getFineStats() {
    const totalUnpaid = await fineRepository.countUnpaid();
    const totalAmount = await fineRepository.getTotalUnpaid();

    return {
      totalUnpaidFines: totalUnpaid,
      totalUnpaidAmount: totalAmount,
    };
  }
}

module.exports = new FineService();