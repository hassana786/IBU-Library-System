const prisma = require('../config/database');

class CategoryRepository {
  async findAll(skip = 0, take = 10) {
    return await prisma.category.findMany({
      skip,
      take,
      include: { books: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id) {
    return await prisma.category.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  async findByName(name) {
    return await prisma.category.findUnique({
      where: { name },
      include: { books: true },
    });
  }

  async create(data) {
    return await prisma.category.create({
      data,
      include: { books: true },
    });
  }

  async update(id, data) {
    return await prisma.category.update({
      where: { id },
      data,
      include: { books: true },
    });
  }

  async delete(id) {
    return await prisma.category.delete({
      where: { id },
    });
  }

  async countAll() {
    return await prisma.category.count();
  }
}

module.exports = new CategoryRepository();