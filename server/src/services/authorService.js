const authorRepository = require('../repositories/authorRepository');
const prisma = require('../config/database');

class AuthorService {
  async getAllAuthors(skip = 0, take = 10) {
    const authors = await authorRepository.findAll(skip, take);
    const total = await authorRepository.countAll();

    return {
      authors,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getAuthorById(id) {
    const author = await authorRepository.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }
    return author;
  }

  async createAuthor(name, bio = null) {
    if (!name || name.trim().length === 0) {
      throw new Error('Author name is required');
    }

    // Check if author already exists
    const existingAuthor = await authorRepository.findByName(name.trim());
    if (existingAuthor) {
      throw new Error('Author already exists');
    }

    return await authorRepository.create({
      name: name.trim(),
      bio,
    });
  }

  async updateAuthor(id, data) {
    const author = await authorRepository.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }

    // If name is being updated, check if it's unique
    if (data.name && data.name !== author.name) {
      const existingAuthor = await authorRepository.findByName(data.name.trim());
      if (existingAuthor) {
        throw new Error('Another author with this name already exists');
      }
    }

    return await authorRepository.update(id, data);
  }

  async deleteAuthor(id) {
    const author = await authorRepository.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }

    // Check if author has books
    if (author.books.length > 0) {
      throw new Error('Cannot delete author with associated books');
    }

    return await authorRepository.delete(id);
  }
}

module.exports = new AuthorService();