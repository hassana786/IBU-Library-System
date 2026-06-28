const validateBookInput = (title, isbn, authorId, categoryId, quantity) => {
  const errors = {};

  if (!title || title.trim().length === 0) {
    errors.title = 'Book title is required';
  }

  if (!isbn || isbn.trim().length === 0) {
    errors.isbn = 'ISBN is required';
  }

  if (!authorId || authorId <= 0) {
    errors.authorId = 'Valid author ID is required';
  }

  if (!categoryId || categoryId <= 0) {
    errors.categoryId = 'Valid category ID is required';
  }

  if (quantity === undefined || quantity < 0) {
    errors.quantity = 'Quantity must be a non-negative number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateBookInput };