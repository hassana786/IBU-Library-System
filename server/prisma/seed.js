const prisma = require('../src/config/database');
const { hashPassword } = require('../src/utils/password');

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Create roles
    console.log('Creating roles...');
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin' },
    });

    const librarianRole = await prisma.role.upsert({
      where: { name: 'librarian' },
      update: {},
      create: { name: 'librarian' },
    });

    const studentRole = await prisma.role.upsert({
      where: { name: 'student' },
      update: {},
      create: { name: 'student' },
    });

    // Create users
    console.log('Creating users...');
    const adminPassword = await hashPassword('admin123');
    const librarianPassword = await hashPassword('librarian123');
    const studentPassword = await hashPassword('student123');

    await prisma.user.upsert({
      where: { email: 'admin@ibu.edu.so' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ibu.edu.so',
        password: adminPassword,
        roleId: adminRole.id,
      },
    });

    await prisma.user.upsert({
      where: { email: 'librarian@ibu.edu.so' },
      update: {},
      create: {
        firstName: 'Librarian',
        lastName: 'User',
        email: 'librarian@ibu.edu.so',
        password: librarianPassword,
        roleId: librarianRole.id,
      },
    });

    await prisma.user.upsert({
      where: { email: 'student@ibu.edu.so' },
      update: {},
      create: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'student@ibu.edu.so',
        password: studentPassword,
        roleId: studentRole.id,
      },
    });

    // Create authors
    console.log('Creating authors...');
    const author1 = await prisma.author.upsert({
      where: { name: 'Robert C. Martin' },
      update: {},
      create: { name: 'Robert C. Martin', bio: 'Legendary software engineer and author' },
    });

    const author2 = await prisma.author.upsert({
      where: { name: 'Eric Evans' },
      update: {},
      create: { name: 'Eric Evans', bio: 'Domain-Driven Design pioneer' },
    });

    // Create categories
    console.log('Creating categories...');
    const category1 = await prisma.category.upsert({
      where: { name: 'Programming' },
      update: {},
      create: { name: 'Programming', description: 'Software development and programming books' },
    });

    const category2 = await prisma.category.upsert({
      where: { name: 'Design Patterns' },
      update: {},
      create: { name: 'Design Patterns', description: 'Design patterns and architecture' },
    });

    // Create books
    console.log('Creating books...');
    await prisma.book.upsert({
      where: { isbn: '0132350882' },
      update: {},
      create: {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        isbn: '0132350882',
        description: 'A Handbook of Agile Software Craftsmanship - Learn how to write code that is readable, maintainable, and efficient.',
        authorId: author1.id,
        categoryId: category1.id,
        quantity: 5,
        availableQuantity: 5,
      },
    });

    await prisma.book.upsert({
      where: { isbn: '0321125215' },
      update: {},
      create: {
        title: 'Domain-Driven Design',
        isbn: '0321125215',
        description: 'Tackling Complexity in the Heart of Software - Master the techniques for modeling complex business domains.',
        authorId: author2.id,
        categoryId: category2.id,
        quantity: 3,
        availableQuantity: 3,
      },
    });

    console.log('✓ Database seeded successfully!');
    console.log('\n📝 Default Credentials:');
    console.log('Admin - Email: admin@ibu.edu.so | Password: admin123');
    console.log('Librarian - Email: librarian@ibu.edu.so | Password: librarian123');
    console.log('Student - Email: student@ibu.edu.so | Password: student123');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();