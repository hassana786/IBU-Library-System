const bookRepository = require('../repositories/bookRepository');
const userRepository = require('../repositories/userRepository');
const borrowingRepository = require('../repositories/borrowingRepository');
const reservationRepository = require('../repositories/reservationRepository');
const fineRepository = require('../repositories/fineRepository');
const auditLogRepository = require('../repositories/auditLogRepository');

class DashboardService {
  async getDashboardData() {
    // Get book statistics
    const bookStats = {
      totalBooks: await bookRepository.countAll(),
      availableBooks: await bookRepository.countAvailable(),
      borrowedBooks: await bookRepository.countAll() - await bookRepository.countAvailable(),
    };

    // Get user statistics
    const userStats = {
      totalUsers: await userRepository.countAll(),
      admins: await userRepository.countByRole('admin'),
      librarians: await userRepository.countByRole('librarian'),
      students: await userRepository.countByRole('student'),
    };

    // Get borrowing statistics
    const borrowingStats = {
      totalBorrowings: await borrowingRepository.countAll(),
      activeBorrowings: await borrowingRepository.countActive(),
    };

    // Get reservation statistics
    const reservationStats = {
      totalReservations: await reservationRepository.countAll(),
      pendingReservations: await reservationRepository.countByStatus('pending'),
      readyReservations: await reservationRepository.countByStatus('ready'),
    };

    // Get fine statistics
    const fineStats = {
      unpaidFines: await fineRepository.countUnpaid(),
      totalUnpaidAmount: await fineRepository.getTotalUnpaid(),
    };

    // Get recent activities
    const recentActivities = await auditLogRepository.findAll(0, 10);

    return {
      bookStats,
      userStats,
      borrowingStats,
      reservationStats,
      fineStats,
      recentActivities,
    };
  }

  async getAdminDashboard() {
    return await this.getDashboardData();
  }

  async getLibrarianDashboard() {
    // Librarian sees book and borrowing stats mainly
    const bookStats = {
      totalBooks: await bookRepository.countAll(),
      availableBooks: await bookRepository.countAvailable(),
    };

    const borrowingStats = {
      activeBorrowings: await borrowingRepository.countActive(),
    };

    const reservationStats = {
      pendingReservations: await reservationRepository.countByStatus('pending'),
    };

    const recentActivities = await auditLogRepository.findAll(0, 5);

    return {
      bookStats,
      borrowingStats,
      reservationStats,
      recentActivities,
    };
  }

  async getStudentDashboard(userId) {
    // Get student's own borrowings and reservations
    const borrowings = await borrowingRepository.findByUserId(userId, 0, 5);
    const reservations = await reservationRepository.findByUserId(userId, 0, 5);

    return {
      recentBorrowings: borrowings,
      reservations,
    };
  }
}

module.exports = new DashboardService();