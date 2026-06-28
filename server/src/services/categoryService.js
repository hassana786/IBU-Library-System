const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
  async getAllCategories(skip = 0, take = 10) {
    const categories = await categoryRepository.findAll(skip, take);
    const total = await categoryRepository.countAll();

    return {
      categories,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(name, description = null) {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    // Check if category already exists
    const existingCategory = await categoryRepository.findByName(name.trim());
    if (existingCategory) {
      throw new Error('Category already exists');
    }

    return await categoryRepository.create({
      name: name.trim(),
      description,
    });
  }

  async updateCategory(id, data) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // If name is being updated, check if it's unique
    if (data.name && data.name !== category.name) {
      const existingCategory = await categoryRepository.findByName(data.name.trim());
      if (existingCategory) {
        throw new Error('Another category with this name already exists');
      }
    }

    return await categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category has books
    if (category.books.length > 0) {
      throw new Error('Cannot delete category with associated books');
    }

    return await categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();