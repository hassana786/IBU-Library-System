const express = require('express');
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizationMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.post('/', authorize(ROLES.STUDENT), reservationController.reserveBook);
router.delete('/', authorize(ROLES.STUDENT), reservationController.cancelReservation);
router.get('/my-reservations', authorize(ROLES.STUDENT), reservationController.getMyReservations);

// Librarian/Admin routes
router.get('/book/:bookId', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), reservationController.getBookReservations);
router.get('/', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), reservationController.getAllReservations);
router.get('/stats', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), reservationController.getReservationStats);

module.exports = router;