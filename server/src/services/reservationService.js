const reservationRepository = require('../repositories/reservationRepository');
const bookRepository = require('../repositories/bookRepository');
const notificationRepository = require('../repositories/notificationRepository');
const prisma = require('../config/database');
const { ROLES } = require('../constants');

class ReservationService {
  async reserveBook(userId, bookId) {
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

    // Check if user already has an active reservation for this book
    const existingReservation = await reservationRepository.findActiveByUserAndBook(userId, bookId);
    if (existingReservation) {
      throw new Error('User already has an active reservation for this book');
    }

    // Create reservation
    return await reservationRepository.create({
      userId,
      bookId,
    });
  }

  async cancelReservation(reservationId, requestingUser) {
    const reservation = await reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (requestingUser.role.name === ROLES.STUDENT && reservation.userId !== requestingUser.id) {
      throw new Error('You are not authorized to cancel this reservation');
    }

    if (reservation.status === 'cancelled') {
      throw new Error('Reservation is already cancelled');
    }

    return await reservationRepository.update(reservationId, {
      status: 'cancelled',
    });
  }

  async getReservationsByUser(userId, skip = 0, take = 10) {
    const reservations = await reservationRepository.findByUserId(userId, skip, take);
    const total = await reservationRepository.countByUserId(userId);

    return {
      reservations,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getReservationsByBook(bookId, skip = 0, take = 10) {
    const reservations = await reservationRepository.findByBookId(bookId, skip, take);
    const total = await reservationRepository.countByBookId(bookId);

    return {
      reservations,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getAllReservations(skip = 0, take = 10) {
    const reservations = await reservationRepository.findAll(skip, take);
    const total = await reservationRepository.countAll();

    return {
      reservations,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async notifyReservationReady(bookId) {
    const reservations = await reservationRepository.findPendingByBookId(bookId);

    if (reservations.length === 0) {
      return;
    }

    // Notify first reservation
    const firstReservation = reservations[0];
    await reservationRepository.update(firstReservation.id, {
      status: 'ready',
      notificationSent: true,
    });

    await notificationRepository.create({
      userId: firstReservation.userId,
      type: 'reservation_ready',
      title: 'Book Reserved Ready for Pickup',
      message: `The book "${bookId}" is now available for pickup`,
    });
  }

  async getReservationStats() {
    const totalReservations = await reservationRepository.countAll();
    const pendingReservations = await reservationRepository.countByStatus('pending');
    const readyReservations = await reservationRepository.countByStatus('ready');

    return {
      totalReservations,
      pendingReservations,
      readyReservations,
    };
  }
}

module.exports = new ReservationService();