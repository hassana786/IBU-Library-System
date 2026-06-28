const borrowingRepository = require('../repositories/borrowingRepository');
const bookRepository = require('../repositories/bookRepository');
const prisma = require('../config/database');

class ReportService {
  async getDailyReport(date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const borrowings = await prisma.borrowing.findMany({
      where: {
        borrowDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        book: true,
      },
    });

    const returns = await prisma.borrowing.findMany({
      where: {
        returnDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        book: true,
      },
    });

    return {
      date,
      borrowings: borrowings.length,
      returns: returns.length,
      details: {
        borrowedBooks: borrowings,
        returnedBooks: returns,
      },
    };
  }

  async getMonthlyReport(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const borrowings = await prisma.borrowing.findMany({
      where: {
        borrowDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        book: true,
      },
    });

    const returns = await prisma.borrowing.findMany({
      where: {
        returnDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        book: true,
      },
    });

    return {
      period: `${year}-${String(month).padStart(2, '0')}`,
      totalBorrowings: borrowings.length,
      totalReturns: returns.length,
      details: {
        borrowedBooks: borrowings,
        returnedBooks: returns,
      },
    };
  }

  async getBorrowingReport(skip = 0, take = 20) {
    const borrowings = await borrowingRepository.findAll(skip, take);
    const total = await borrowingRepository.countAll();

    return {
      borrowings,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getStudentReport(studentId) {
    const borrowings = await borrowingRepository.findByUserId(studentId, 0, 100);
    const totalBorrowed = borrowings.length;
    const returned = borrowings.filter(b => b.status === 'returned').length;
    const active = borrowings.filter(b => b.status === 'active').length;

    return {
      studentId,
      totalBorrowed,
      returned,
      active,
      borrowings,
    };
  }

  async getBookReport(bookId) {
    const book = await bookRepository.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const borrowings = await borrowingRepository.findByBookId(bookId, 0, 100);
    const totalBorrowed = borrowings.length;
    const returned = borrowings.filter(b => b.status === 'returned').length;
    const active = borrowings.filter(b => b.status === 'active').length;

    return {
      bookId,
      bookTitle: book.title,
      totalQuantity: book.quantity,
      availableQuantity: book.availableQuantity,
      totalBorrowed,
      returned,
      active,
      borrowingHistory: borrowings,
    };
  }

  async getMonthlyStatistics(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const borrowings = await prisma.borrowing.findMany({
      where: {
        borrowDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        book: true,
      },
    });

    // Group by book
    const bookStats = {};
    borrowings.forEach(b => {
      if (!bookStats[b.book.id]) {
        bookStats[b.book.id] = {
          title: b.book.title,
          count: 0,
        };
      }
      bookStats[b.book.id].count++;
    });

    return {
      period: `${year}-${String(month).padStart(2, '0')}`,
      totalBorrowings: borrowings.length,
      popularBooks: Object.values(bookStats).sort((a, b) => b.count - a.count).slice(0, 10),
    };
  }
}

module.exports = new ReportService();