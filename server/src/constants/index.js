const ROLES = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  STUDENT: 'student',
};

const BORROWING_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
};

const RESERVATION_STATUS = {
  PENDING: 'pending',
  READY: 'ready',
  CANCELLED: 'cancelled',
};

const FINE_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
};

const NOTIFICATION_TYPES = {
  DUE_DATE_REMINDER: 'due_date_reminder',
  RESERVATION_READY: 'reservation_ready',
  FINE_NOTIFICATION: 'fine_notification',
};

const AUDIT_MODULES = {
  USER: 'user',
  BOOK: 'book',
  BORROWING: 'borrowing',
  RESERVATION: 'reservation',
  FINE: 'fine',
  ROLE: 'role',
};

module.exports = {
  ROLES,
  BORROWING_STATUS,
  RESERVATION_STATUS,
  FINE_STATUS,
  NOTIFICATION_TYPES,
  AUDIT_MODULES,
};