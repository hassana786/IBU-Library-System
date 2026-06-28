const authRepository = require('../repositories/authRepository');
const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { validateLoginInput, validateRegisterInput } = require('../validators/authValidator');
const prisma = require('../config/database');

class AuthService {
  async register(firstName, lastName, email, password, phone = null, address = null) {
    // Validate input
    const validation = validateRegisterInput(firstName, lastName, email, password);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Check if email already exists
    const existingUser = await authRepository.checkEmailExists(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Get student role
    const studentRole = await prisma.role.findUnique({
      where: { name: 'student' },
    });

    if (!studentRole) {
      throw new Error('Student role not found');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await authRepository.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      roleId: studentRole.id,
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      },
      token,
    };
  }

  async login(email, password) {
    // Validate input
    const validation = validateLoginInput(email, password);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Find user
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Compare password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      },
      token,
    };
  }

  async getProfile(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Both current and new passwords are required');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const passwordMatch = await comparePassword(currentPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}

module.exports = new AuthService();