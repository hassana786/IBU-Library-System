const reservationService = require('../services/reservationService');
const auditLogService = require('../services/auditLogService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/errorHandler');
const { AUDIT_MODULES } = require('../constants');

class ReservationController {
  async reserveBook(req, res) {
    try {
      const { bookId } = req.body;
      const userId = req.user.id;

      const reservation = await reservationService.reserveBook(userId, parseInt(bookId));

      await auditLogService.logAction(
        userId,
        'CREATE',
        AUDIT_MODULES.BORROWING,
        `Book reserved: ${bookId}`,
        req.ip
      );

      return sendSuccessResponse(res, 201, 'Book reserved successfully', reservation);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async cancelReservation(req, res) {
    try {
      const { reservationId } = req.body;

      const reservation = await reservationService.cancelReservation(parseInt(reservationId));

      await auditLogService.logAction(
        req.user.id,
        'DELETE',
        AUDIT_MODULES.BORROWING,
        `Reservation cancelled: ${reservationId}`,
        req.ip
      );

      return sendSuccessResponse(res, 200, 'Reservation cancelled successfully', reservation);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getMyReservations(req, res) {
    try {
      const userId = req.user.id;
      const { skip = 0, take = 10 } = req.query;

      const reservations = await reservationService.getReservationsByUser(userId, parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Reservations retrieved', reservations);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getBookReservations(req, res) {
    try {
      const { bookId } = req.params;
      const { skip = 0, take = 10 } = req.query;

      const reservations = await reservationService.getReservationsByBook(parseInt(bookId), parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'Reservations retrieved', reservations);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getAllReservations(req, res) {
    try {
      const { skip = 0, take = 10 } = req.query;

      const reservations = await reservationService.getAllReservations(parseInt(skip), parseInt(take));

      return sendSuccessResponse(res, 200, 'All reservations retrieved', reservations);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }

  async getReservationStats(req, res) {
    try {
      const stats = await reservationService.getReservationStats();

      return sendSuccessResponse(res, 200, 'Reservation statistics retrieved', stats);
    } catch (error) {
      return sendErrorResponse(res, 400, error.message);
    }
  }
}

module.exports = new ReservationController();