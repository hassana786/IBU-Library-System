const borrowingRepository = require('../repositories/borrowingRepository');
const bookRepository = require('../repositories/bookRepository');
const fineRepository = require('../repositories/fineRepository');
const notificationRepository = require('../repositories/notificationRepository');
const prisma = require('../config/database');
const { ROLES } = require('../constants');

class BorrowingService {
  async borrowBook(userId, bookId, dueDays = 14) {
    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Validate book exists
    const book = await bookRepository.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    // Check book availability
    if (book.availableQuantity <= 0) {
      throw new Error('Book is not available');
    }

    // Check if user already borrowed this book
    const activeBoorrowing = await borrowingRepository.findActiveByUserId(userId);
    const alreadyBorrowed = activeBoorrowing.some(b => b.bookId === bookId);
    if (alreadyBorrowed) {
      throw new Error('User already has an active borrowing for this book');
    }

    // Calculate due date
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + dueDays * 24 * 60 * 60 * 1000);

    // Create borrowing record
    const borrowing = await borrowingRepository.create({
      userId,
      bookId,
      dueDate,
    });

    // Update book availability
    await bookRepository.update(bookId, {
      availableQuantity: book.availableQuantity - 1,
    });

    return borrowing;
  }

  async returnBook(borrowingId, requestingUser) {
    const borrowing = await borrowingRepository.findById(borrowingId);
    if (!borrowing) {
      throw new Error('Borrowing record not found');
    }

    if (requestingUser.role.name === ROLES.STUDENT && borrowing.userId !== requestingUser.id) {
      throw new Error('You are not authorized to return this borrowing');
    }

    if (borrowing.status !== 'active') {
      throw new Error('This book has already been returned');
    }

    const returnDate = new Date();
    const book = await bookRepository.findById(borrowing.bookId);

    // Update borrowing record
    const updatedBorrowing = await borrowingRepository.update(borrowingId, {
      returnDate,
      status: 'returned',
    });

    // Update book availability
    await bookRepository.update(borrowing.bookId, {
      availableQuantity: book.availableQuantity + 1,
    });

    // Check for overdue and create fine if necessary
    if (returnDate > borrowing.dueDate) {
      const daysOverdue = Math.ceil((returnDate - borrowing.dueDate) / (1000 * 60 * 60 * 24));
      const fineAmount = daysOverdue * parseInt(process.env.FINE_PER_DAY || 50);

      await fineRepository.create({
        userId: borrowing.userId,
        amount: fineAmount,
        reason: `Overdue for ${daysOverdue} days`,
        dueDate: new Date(returnDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      });

      // Create fine notification
      await notificationRepository.create({
        userId: borrowing.userId,
        type: 'fine_notification',
        title: 'Fine Generated',
        message: `A fine of ${fineAmount} has been generated for overdue book return`,
      });
    }

    return updatedBorrowing;
  }

  async getBorrowingHistory(userId, skip = 0, take = 10) {
    const borrowings = await borrowingRepository.findByUserId(userId, skip, take);
    const total = await borrowingRepository.countByUserId(userId);

    return {
      borrowings,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getActiveBorrowings(userId) {
    return await borrowingRepository.findActiveByUserId(userId);
  }

  async getAllBorrowings(skip = 0, take = 10) {
    const borrowings = await borrowingRepository.findAll(skip, take);
    const total = await borrowingRepository.countAll();

    return {
      borrowings,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async processOverdueBooks() {
    const overdueBorrowings = await borrowingRepository.findOverdue();

    for (const borrowing of overdueBorrowings) {
      // Check if fine already exists for this borrowing
      const existingFine = await fineRepository.findUnpaidByUserId(borrowing.userId);
      const fineExists = existingFine.some(f => f.reason.includes('Overdue'));

      if (!fineExists) {
        const now = new Date();
        const daysOverdue = Math.ceil((now - borrowing.dueDate) / (1000 * 60 * 60 * 24));
        const fineAmount = daysOverdue * parseInt(process.env.FINE_PER_DAY || 50);

        await fineRepository.create({
          userId: borrowing.userId,
          amount: fineAmount,
          reason: `Overdue for ${daysOverdue} days`,
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        });

        // Create notification
        await notificationRepository.create({
          userId: borrowing.userId,
          type: 'due_date_reminder',
          title: 'Book Overdue',
          message: `Book "${borrowing.book.title}" is overdue. Please return it immediately.`,
        });
      }
    }
  }

  async getBorrowingStats() {
    const totalBorrowings = await borrowingRepository.countAll();
    const activeBorrowings = await borrowingRepository.countActive();
    const returnedBorrowings = await borrowingRepository.countByStatus('returned');

    return {
      totalBorrowings,
      activeBorrowings,
      returnedBorrowings,
    };
  }
}

module.exports = new BorrowingService();