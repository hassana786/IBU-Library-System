const bookRepository = require('../repositories/bookRepository');
const { validateBookInput } = require('../validators/bookValidator');
const prisma = require('../config/database');

class BookService {
  async getAllBooks(skip = 0, take = 10) {
    const books = await bookRepository.findAll(skip, take);
    const total = await bookRepository.countAll();

    return {
      books,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getBookById(id) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  async searchBooks(query, skip = 0, take = 10) {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const books = await bookRepository.search(query, skip, take);
    const total = await bookRepository.countSearch(query);

    return {
      books,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getBooksByCategory(categoryId, skip = 0, take = 10) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const books = await bookRepository.findByCategory(categoryId, skip, take);
    const total = await bookRepository.countByCategory(categoryId);

    return {
      books,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getBooksByAuthor(authorId, skip = 0, take = 10) {
    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    const books = await bookRepository.findByAuthor(authorId, skip, take);
    const total = await bookRepository.countByAuthor(authorId);

    return {
      books,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async createBook(title, isbn, description, authorId, categoryId, quantity) {
    // Validate input
    const validation = validateBookInput(title, isbn, authorId, categoryId, quantity);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Check if ISBN already exists
    const existingBook = await bookRepository.findByISBN(isbn);
    if (existingBook) {
      throw new Error('Book with this ISBN already exists');
    }

    // Verify author exists
    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });
    if (!author) {
      throw new Error('Author not found');
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }

    // Create book
    return await bookRepository.create({
      title,
      isbn,
      description,
      authorId,
      categoryId,
      quantity,
      availableQuantity: quantity,
    });
  }

  async updateBook(id, data) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    // If ISBN is being updated, check if it's unique
    if (data.isbn && data.isbn !== book.isbn) {
      const existingBook = await bookRepository.findByISBN(data.isbn);
      if (existingBook) {
        throw new Error('Another book with this ISBN already exists');
      }
    }

    // If author is being updated, verify it exists
    if (data.authorId) {
      const author = await prisma.author.findUnique({
        where: { id: data.authorId },
      });
      if (!author) {
        throw new Error('Author not found');
      }
    }

    // If category is being updated, verify it exists
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new Error('Category not found');
      }
    }

    return await bookRepository.update(id, data);
  }

  async deleteBook(id) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    return await bookRepository.delete(id);
  }

  async updateBookQuantity(id, quantity) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    return await bookRepository.update(id, {
      quantity,
      availableQuantity: quantity,
    });
  }

  async getBookStats() {
    const totalBooks = await bookRepository.countAll();
    const availableBooks = await bookRepository.countAvailable();
    const borrowedBooks = totalBooks - availableBooks;
    const totalQuantity = await bookRepository.getTotalQuantity();

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalQuantity,
    };
  }
}

module.exports = new BookService();