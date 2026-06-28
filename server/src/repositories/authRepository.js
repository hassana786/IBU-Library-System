const prisma = require('../config/database');

class AuthRepository {
  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async createUser(data) {
    return await prisma.user.create({
      data,
      include: { role: true },
    });
  }

  async checkEmailExists(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }
}

module.exports = new AuthRepository();