const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateLoginInput = (email, password) => {
  const errors = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateRegisterInput = (firstName, lastName, email, password) => {
  const errors = {};

  if (!firstName || firstName.trim().length === 0) {
    errors.firstName = 'First name is required';
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.lastName = 'Last name is required';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateLoginInput,
  validateRegisterInput,
};