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

// Book reservations
router.get('/book/:bookId', reservationController.getBookReservations);

// Librarian/Admin routes
router.get('/', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), reservationController.getAllReservations);
router.get('/stats', authorize(ROLES.ADMIN, ROLES.LIBRARIAN), reservationController.getReservationStats);

module.exports = router;