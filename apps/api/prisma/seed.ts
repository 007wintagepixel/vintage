// ============================================
// Database Seed Script
// ============================================

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default admin user
  const adminPassword = await argon2.hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ludonexus.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ludonexus.com',
      passwordHash: adminPassword,
      fullName: 'Admin User',
      country: 'US',
      mobileNumber: '+15550000000',
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      kycStatus: 'verified',
      level: 100,
      experience: 999999,
      totalMatches: 1000,
      wins: 800,
      losses: 200,
      referralCode: 'ADMIN01',
    },
  });

  // Create demo users
  const demoUsers = [
    {
      username: 'cyber_gamer_99',
      email: 'player1@ludonexus.com',
      fullName: 'Cyber Gamer',
      country: 'US',
      mobileNumber: '+15551111111',
    },
    {
      username: 'dice_master',
      email: 'player2@ludonexus.com',
      fullName: 'Dice Master',
      country: 'IN',
      mobileNumber: '+915552222222',
    },
    {
      username: 'ludo_king_2024',
      email: 'player3@ludonexus.com',
      fullName: 'Ludo King',
      country: 'GB',
      mobileNumber: '+445553333333',
    },
    {
      username: 'token_tactician',
      email: 'player4@ludonexus.com',
      fullName: 'Token Tactician',
      country: 'CA',
      mobileNumber: '+15554444444',
    },
    {
      username: 'board_boss',
      email: 'player5@ludonexus.com',
      fullName: 'Board Boss',
      country: 'AU',
      mobileNumber: '+615555555555',
    },
  ];

  const createdUsers = [];
  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        passwordHash: await argon2.hash('demo123'),
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        kycStatus: 'verified',
        level: Math.floor(Math.random() * 20) + 1,
        experience: Math.floor(Math.random() * 10000),
        totalMatches: Math.floor(Math.random() * 500),
        wins: Math.floor(Math.random() * 300),
        losses: Math.floor(Math.random() * 200),
        referralCode: uuidv4().substring(0, 8).toUpperCase(),
      },
    });
    createdUsers.push(user);

    // Create wallet with initial balance
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        available: 10000,
        bonus: 0,
        locked: 0,
        pending: 0,
      },
    });

    // Create profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        displayName: userData.username,
        bio: `Professional Ludo player. Level ${Math.floor(Math.random() * 20) + 1}`,
        language: 'en',
        privacySettings: { showOnline: true, showStats: true, allowInvites: true },
      },
    });
  }

  // Create some achievements
  const achievements = [
    {
      code: 'FIRST_WIN',
      name: 'First Win',
      description: 'Win your first match',
      icon: '🏆',
      category: 'gameplay',
      requirement: { type: 'wins', value: 1 },
      reward: { type: 'coins', value: 100 },
    },
    {
      code: 'RISING_STAR',
      name: 'Rising Star',
      description: 'Win 10 matches',
      icon: '⭐',
      category: 'gameplay',
      requirement: { type: 'wins', value: 10 },
      reward: { type: 'coins', value: 500 },
    },
    {
      code: 'LUDO_MASTER',
      name: 'Ludo Master',
      description: 'Win 100 matches',
      icon: '👑',
      category: 'gameplay',
      requirement: { type: 'wins', value: 100 },
      reward: { type: 'coins', value: 5000 },
    },
    {
      code: 'STREAK_STARTER',
      name: 'Streak Starter',
      description: 'Win 5 matches in a row',
      icon: '🔥',
      category: 'streak',
      requirement: { type: 'streak', value: 5 },
      reward: { type: 'coins', value: 1000 },
    },
    {
      code: 'COMEBACK_KING',
      name: 'Comeback King',
      description: 'Win after being last',
      icon: '🔄',
      category: 'gameplay',
      requirement: { type: 'comeback', value: 1 },
      reward: { type: 'coins', value: 2000 },
    },
    {
      code: 'TOURNAMENT_CHAMPION',
      name: 'Tournament Champion',
      description: 'Win a tournament',
      icon: '🏅',
      category: 'tournament',
      requirement: { type: 'tournament_wins', value: 1 },
      reward: { type: 'coins', value: 10000 },
    },
    {
      code: 'SOCIAL_BUTTERFLY',
      name: 'Social Butterfly',
      description: 'Add 10 friends',
      icon: '🦋',
      category: 'social',
      requirement: { type: 'friends', value: 10 },
      reward: { type: 'coins', value: 500 },
    },
    {
      code: 'HIGH_ROLLER',
      name: 'High Roller',
      description: 'Win 10,000 coins in a single match',
      icon: '💰',
      category: 'gameplay',
      requirement: { type: 'single_win', value: 10000 },
      reward: { type: 'coins', value: 2000 },
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: {},
      create: ach,
    });
  }

  // Create some fraud alerts for demo
  const fraudAlerts = [
    {
      userId: createdUsers[0].id,
      type: 'multiple_accounts' as const,
      severity: 'high' as const,
      description: 'Multiple accounts detected from same IP',
      evidence: { ips: ['192.168.1.1'], accounts: 3 },
      status: 'open' as const,
    },
    {
      userId: createdUsers[1].id,
      type: 'bot_usage' as const,
      severity: 'critical' as const,
      description: 'Suspicious bot-like gameplay patterns detected',
      evidence: { pattern: 'perfect_moves', confidence: 0.95 },
      status: 'investigating' as const,
    },
  ];

  for (const alert of fraudAlerts) {
    await prisma.fraudAlert.create({
      data: {
        userId: alert.userId,
        type: alert.type,
        severity: alert.severity,
        description: alert.description,
        evidence: alert.evidence,
        status: alert.status,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created admin user: admin@ludonexus.com (password: admin123)`);
  console.log(`Created ${demoUsers.length} demo users (password: demo123)`);
  console.log(`Created ${8} achievements`);
  console.log(`Created ${fraudAlerts.length} fraud alerts`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });