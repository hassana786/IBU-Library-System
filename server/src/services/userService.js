const userRepository = require('../repositories/userRepository');
const prisma = require('../config/database');
const { hashPassword } = require('../utils/password');

class UserService {
  async getAllUsers(skip = 0, take = 10) {
    const users = await userRepository.findAll(skip, take);
    const total = await userRepository.countAll();

    return {
      users,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUsersByRole(roleName, skip = 0, take = 10) {
    const users = await userRepository.findByRole(roleName, skip, take);
    const total = await userRepository.countByRole(roleName);

    return {
      users,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async createUser(firstName, lastName, email, password, roleId, phone = null, address = null) {
    // Validate input
    if (!firstName || !lastName || !email || !password || !roleId) {
      throw new Error('All required fields must be provided');
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    return await userRepository.findById((await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId,
        phone,
        address,
      },
    })).id);
  }

  async updateUser(id, data) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // If email is being updated, check if it's unique
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    return await userRepository.update(id, data);
  }

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await userRepository.delete(id);
  }

  async getDashboardStats() {
    const totalUsers = await userRepository.countAll();
    const adminCount = await userRepository.countByRole('admin');
    const librarianCount = await userRepository.countByRole('librarian');
    const studentCount = await userRepository.countByRole('student');

    return {
      totalUsers,
      admins: adminCount,
      librarians: librarianCount,
      students: studentCount,
    };
  }
}

module.exports = new UserService();