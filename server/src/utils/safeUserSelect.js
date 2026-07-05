// Prisma `select` clause for embedding a user in another entity's response
// without leaking the password hash.
const SAFE_USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  roleId: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

module.exports = { SAFE_USER_SELECT };
