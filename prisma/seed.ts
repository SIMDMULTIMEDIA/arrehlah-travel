import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator role with full access',
      permissions: ['*'],
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: {
      name: 'CUSTOMER',
      description: 'Standard customer role',
      permissions: ['read:own_bookings', 'create:bookings'],
    },
  });

  // Example User (Admin)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@arrehlah.com' },
    update: {},
    create: {
      email: 'admin@arrehlah.com',
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole.id,
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
