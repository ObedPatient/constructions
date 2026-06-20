const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Admin user - using the correct model name and field
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@real.rw' },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@real.rw',
      passwordHash: adminPassword,  // ✅ Correct field name
      role: 'admin',  // ✅ Use 'admin' not 'ADMIN'
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('   Password:', process.env.ADMIN_PASSWORD || 'admin123');
  console.log('🌱 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });