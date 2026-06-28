const prisma = require('../config/database');

class AuthorRepository {
  async findAll(skip = 0, take = 10) {
    return await prisma.author.findMany({
      skip,
      take,
      include: { books: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id) {
    return await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async findByName(name) {
    return await prisma.author.findUnique({
      where: { name },
      include: { books: true },
    });
  }

  async create(data) {
    return await prisma.author.create({
      data,
      include: { books: true },
    });
  }

  async update(id, data) {
    return await prisma.author.update({
      where: { id },
      data,
      include: { books: true },
    });
  }

  async delete(id) {
    return await prisma.author.delete({
      where: { id },
    });
  }

  async countAll() {
    return await prisma.author.count();
  }
}

module.exports = new AuthorRepository();