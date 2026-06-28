const prisma = require('../config/database');

class UserRepository {
  async findAll(skip = 0, take = 10) {
    return await prisma.user.findMany({
      skip,
      take,
      include: { role: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: { role: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async findByRole(roleName, skip = 0, take = 10) {
    return await prisma.user.findMany({
      where: {
        role: { name: roleName },
      },
      skip,
      take,
      include: { role: true },
    });
  }

  async countByRole(roleName) {
    return await prisma.user.count({
      where: {
        role: { name: roleName },
      },
    });
  }

  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
  }

  async delete(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  async countAll() {
    return await prisma.user.count();
  }
}

module.exports = new UserRepository();