import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateReferralCode() {
  return 'INDIA' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function main() {
  console.log('Seeding database...\n');

  // Create regular user
  const hashedUserPassword = await bcrypt.hash('user123', 12);
  const userReferralCode = generateReferralCode();
  
  const user = await prisma.user.upsert({
    where: { email: 'player@example.com' },
    update: {},
    create: {
      name: 'Rajesh Kumar',
      email: 'player@example.com',
      phone: '9876543210',
      password: hashedUserPassword,
      role: 'USER',
      balance: 1000,
      bonusBalance: 100,
      totalWinnings: 500,
      gamesPlayed: 25,
      gamesWon: 12,
      referralCode: userReferralCode,
      streak: 5
    }
  });
  console.log('✅ Created Regular User:');
  console.log(`   Email: player@example.com`);
  console.log(`   Password: user123`);
  console.log(`   Role: USER`);
  console.log(`   Balance: ₹${user.balance}`);
  console.log(`   Referral Code: ${user.referralCode}\n`);

  // Create sub-admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);
  const adminReferralCode = generateReferralCode();
  
  const subAdmin = await prisma.user.upsert({
    where: { email: 'subadmin@indiaplay.com' },
    update: {},
    create: {
      name: 'Vikram Singh',
      email: 'subadmin@indiaplay.com',
      phone: '9876543211',
      password: hashedAdminPassword,
      role: 'SUB_ADMIN',
      balance: 0,
      bonusBalance: 0,
      referralCode: adminReferralCode
    }
  });
  console.log('✅ Created Sub-Admin:');
  console.log(`   Email: subadmin@indiaplay.com`);
  console.log(`   Password: admin123`);
  console.log(`   Role: SUB_ADMIN\n`);

  // Create a Super Admin (for testing full admin access)
  const hashedSuperAdminPassword = await bcrypt.hash('super123', 12);
  const superAdminReferralCode = generateReferralCode();
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@indiaplay.com' },
    update: {},
    create: {
      name: 'Admin Master',
      email: 'superadmin@indiaplay.com',
      phone: '9876543212',
      password: hashedSuperAdminPassword,
      role: 'SUPER_ADMIN',
      balance: 0,
      bonusBalance: 0,
      referralCode: superAdminReferralCode
    }
  });
  console.log('✅ Created Super Admin:');
  console.log(`   Email: superadmin@indiaplay.com`);
  console.log(`   Password: super123`);
  console.log(`   Role: SUPER_ADMIN\n`);

  console.log('═══════════════════════════════════════════');
  console.log('          SEEDING COMPLETE!');
  console.log('═══════════════════════════════════════════');
  console.log('\nTest Accounts:');
  console.log('───────────────────────────────────────────');
  console.log('USER:      player@example.com / user123');
  console.log('SUB_ADMIN: subadmin@indiaplay.com / admin123');
  console.log('SUPER_ADMIN: superadmin@indiaplay.com / super123');
  console.log('───────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
