'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dice1, User, Wallet, History, Users, Trophy, Settings, LogOut, ChevronRight, Bell, Shield, Star, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function DashboardProfilePage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'LUDO-NEXUS-7X9K';

  const copyReferral = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'Games Played', value: '147', icon: Dice1, color: 'text-primary-glow' },
    { label: 'Win Rate', value: '62%', icon: Trophy, color: 'text-accent-gold' },
    { label: 'Tournaments Won', value: '8', icon: Star, color: 'text-secondary-glow' },
    { label: 'Demo Coins', value: '12,345', icon: Wallet, color: 'text-accent-green' },
  ];

  const achievements = [
    { name: 'First Victory', desc: 'Win your first game', icon: Trophy, unlocked: true, progress: 100 },
    { name: 'Streak Master', desc: 'Win 5 games in a row', icon: Star, unlocked: true, progress: 100 },
    { name: 'Tournament Champion', desc: 'Win a tournament', icon: Star, unlocked: true, progress: 100 },
    { name: 'Social Butterfly', desc: 'Add 10 friends', icon: Users, unlocked: true, progress: 100 },
    { name: 'High Roller', desc: 'Bet 10,000 coins in one game', icon: Wallet, unlocked: false, progress: 65 },
    { name: 'Grandmaster', desc: 'Reach 2000 ELO rating', icon: Shield, unlocked: false, progress: 23 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Profile</h1>
          <p className="text-text-secondary mt-1">Manage your account and view your stats</p>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong p-6 md:p-8 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center text-4xl font-display font-bold text-text-inverse">
              P1
            </div>
            <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-surface-tertiary border border-surface-border flex items-center justify-center hover:bg-surface-hover transition-colors">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="font-display text-heading-xl gradient-text">PlayerOne</h2>
              <span className="px-3 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow">Demo Player</span>
            </div>
            <p className="text-text-secondary text-body mb-4">playerone@ludonexus.com</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Link href="/dashboard/settings" className="btn-ghost gap-2 text-body-sm">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button className="btn-secondary gap-2 text-body-sm">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass-card-hover p-6 rounded-2xl text-center"
          >
            <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.color}/20`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div className="font-display text-display-sm mb-1">{stat.value}</div>
            <div className="text-text-secondary text-body-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Referral Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-display text-heading-md mb-1">Invite Friends</h3>
            <p className="text-text-secondary text-body-sm">Share your code, earn 500 coins per referral!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 md:w-64">
              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="input bg-surface-tertiary pr-14 font-mono text-center"
                />
                <button
                  onClick={copyReferral}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-glow transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-accent-green" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button className="btn-primary whitespace-nowrap">
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display text-heading-lg mb-6 gradient-text">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`glass-card-hover p-5 rounded-2xl ${achievement.unlocked ? '' : 'opacity-60'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${achievement.unlocked ? 'bg-gradient-to-br from-accent-gold to-secondary-glow' : 'bg-surface-tertiary'}`}>
                  <achievement.icon className={`w-7 h-7 ${achievement.unlocked ? 'text-text-inverse' : 'text-text-muted'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-display text-heading-sm ${achievement.unlocked ? 'text-text-primary' : 'text-text-muted'}`}>{achievement.name}</h3>
                  <p className="text-text-secondary text-body-sm mt-1">{achievement.desc}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-caption mb-1">
                      <span className="text-text-muted">Progress</span>
                      <span className={achievement.unlocked ? 'text-accent-green' : 'text-primary-glow'}>{achievement.progress}%</span>
                    </div>
                    <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.8 }}
                        className={`h-full rounded-full ${achievement.unlocked ? 'bg-gradient-to-r from-accent-gold to-secondary-glow' : 'bg-primary-glow/50'}`}
                      />
                    </div>
                  </div>
                </div>
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05, type: 'spring' }}
                    className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}