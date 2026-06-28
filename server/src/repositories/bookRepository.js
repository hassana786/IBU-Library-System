const prisma = require('../config/database');

class BookRepository {
  async findAll(skip = 0, take = 10) {
    return await prisma.book.findMany({
      skip,
      take,
      include: {
        author: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
      },
    });
  }

  async findByISBN(isbn) {
    return await prisma.book.findUnique({
      where: { isbn },
      include: {
        author: true,
        category: true,
      },
    });
  }

  async search(query, skip = 0, take = 10) {
    return await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { isbn: { contains: query, mode: 'insensitive' } },
          { author: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      skip,
      take,
      include: {
        author: true,
        category: true,
      },
    });
  }

  async findByCategory(categoryId, skip = 0, take = 10) {
    return await prisma.book.findMany({
      where: { categoryId },
      skip,
      take,
      include: {
        author: true,
        category: true,
      },
    });
  }

  async findByAuthor(authorId, skip = 0, take = 10) {
    return await prisma.book.findMany({
      where: { authorId },
      skip,
      take,
      include: {
        author: true,
        category: true,
      },
    });
  }

  async create(data) {
    return await prisma.book.create({
      data,
      include: {
        author: true,
        category: true,
      },
    });
  }

  async update(id, data) {
    return await prisma.book.update({
      where: { id },
      data,
      include: {
        author: true,
        category: true,
      },
    });
  }

  async delete(id) {
    return await prisma.book.delete({
      where: { id },
    });
  }

  async countAll() {
    return await prisma.book.count();
  }

  async countAvailable() {
    return await prisma.book.count({
      where: {
        availableQuantity: { gt: 0 },
      },
    });
  }

  async getTotalQuantity() {
    const result = await prisma.book.aggregate({
      _sum: { quantity: true },
    });
    return result._sum.quantity || 0;
  }
}

module.exports = new BookRepository();