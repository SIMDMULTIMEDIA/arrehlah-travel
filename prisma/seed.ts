import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Example User (Admin)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@arrehlah.com' },
    update: {},
    create: {
      email: 'admin@arrehlah.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
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
