'use client';

import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, Coins, Share2, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Referral {
  id: string;
  username: string;
  avatar: string;
  joinedDate: string;
  status: 'active' | 'inactive' | 'pending';
  coinsEarned: number;
  level: number;
}

const mockReferrals: Referral[] = [
  { id: '1', username: 'CryptoChamp', avatar: 'CC', joinedDate: '2024-01-10', status: 'active', coinsEarned: 500, level: 12 },
  { id: '2', username: 'DiceMaster', avatar: 'DM', joinedDate: '2024-01-08', status: 'active', coinsEarned: 500, level: 8 },
  { id: '3', username: 'LudoLegend', avatar: 'LL', joinedDate: '2024-01-05', status: 'active', coinsEarned: 500, level: 15 },
  { id: '4', username: 'TokenTaker', avatar: 'TT', joinedDate: '2024-01-03', status: 'active', coinsEarned: 350, level: 6 },
  { id: '5', username: 'BoardBoss', avatar: 'BB', joinedDate: '2023-12-28', status: 'active', coinsEarned: 500, level: 19 },
  { id: '6', username: 'RollRebel', avatar: 'RR', joinedDate: '2023-12-20', status: 'inactive', coinsEarned: 100, level: 2 },
  { id: '7', username: 'StarPlayer', avatar: 'SP', joinedDate: '2023-12-15', status: 'active', coinsEarned: 500, level: 22 },
  { id: '8', username: 'NewbieGamer', avatar: 'NG', joinedDate: '2024-01-14', status: 'pending', coinsEarned: 0, level: 1 },
];

const referralCode = 'NEXUS-AKASH-2024';

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeReferrals = mockReferrals.filter(r => r.status === 'active').length;
  const totalEarned = mockReferrals.reduce((sum, r) => sum + r.coinsEarned, 0);
  const thisMonth = mockReferrals.filter(r => r.joinedDate >= '2024-01-01').length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { color: 'text-accent-green', bg: 'bg-accent-green/20', label: 'Active' };
      case 'inactive': return { color: 'text-text-muted', bg: 'bg-surface-tertiary', label: 'Inactive' };
      case 'pending': return { color: 'text-secondary-glow', bg: 'bg-secondary-glow/20', label: 'Pending' };
      default: return { color: 'text-text-muted', bg: 'bg-surface-tertiary', label: status };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-display-md gradient-text">Refer & Earn</h1>
        <p className="text-text-secondary mt-1">Invite friends and earn coins for every referral</p>
      </motion.div>

      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong rounded-2xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary-glow to-accent-magenta flex items-center justify-center">
            <Gift className="w-8 h-8 text-background" />
          </div>
          <h2 className="font-display text-heading-lg text-text-primary mb-2">Your Referral Code</h2>
          <p className="text-text-secondary text-body mb-6">Share this code with friends. You both earn 500 coins when they reach level 5!</p>
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <div className="glass-panel flex-1 px-6 py-4 rounded-2xl">
              <div className="font-display text-heading-md gradient-text-gold tracking-wider">{referralCode}</div>
            </div>
            <button
              onClick={copyCode}
              className={`btn-primary gap-2 ${copied ? '!bg-accent-green !text-background' : ''}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button className="btn-ghost gap-2 mt-4">
            <Share2 className="w-4 h-4" />
            Share with friends
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Referrals', value: mockReferrals.length, icon: Users, color: 'text-primary-glow' },
          { label: 'Active Referrals', value: activeReferrals, icon: TrendingUp, color: 'text-accent-green' },
          { label: 'Coins Earned', value: totalEarned.toLocaleString(), icon: Coins, color: 'text-secondary-glow' },
          { label: 'This Month', value: thisMonth, icon: Calendar, color: 'text-accent-magenta' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="glass-card-hover p-6 rounded-2xl text-center"
          >
            <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.color}/20`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div className="font-display text-display-sm md:text-display-md">{stat.value}</div>
            <div className="text-text-secondary text-body-sm mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card-strong rounded-2xl p-6"
      >
        <h2 className="font-display text-heading-lg text-text-primary mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: 1, title: 'Share Your Code', desc: 'Send your unique referral code to friends via social media, messaging, or email', icon: Share2, color: 'text-primary-glow' },
            { step: 2, title: 'Friend Joins', desc: 'Your friend signs up using your code and creates their account', icon: Users, color: 'text-accent-magenta' },
            { step: 3, title: 'Both Earn Coins', desc: 'When your friend reaches level 5, you both get 500 coins as a reward', icon: Coins, color: 'text-secondary-glow' },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-card-hover p-6 rounded-2xl text-center relative"
            >
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-glow/20 flex items-center justify-center">
                <span className="font-display text-body-sm text-primary-glow">{item.step}</span>
              </div>
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${item.color}/20 flex items-center justify-center`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <h3 className="font-display text-heading-md text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary text-body-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Referral List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-surface-border">
          <h2 className="font-display text-heading-lg text-text-primary">Your Referrals</h2>
        </div>
        <div className="p-4 space-y-2">
          {mockReferrals.map((ref, index) => {
            const status = getStatusConfig(ref.status);
            return (
              <motion.div
                key={ref.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.04 }}
                className="glass-card-hover p-4 rounded-2xl flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-background flex-shrink-0">
                  {ref.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-text-primary">{ref.username}</span>
                    <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="text-body-sm text-text-muted mt-0.5">
                    Joined {ref.joinedDate} • Level {ref.level}
                  </div>
                </div>

                {/* Coins Earned */}
                <div className="text-right flex-shrink-0">
                  <div className="text-caption text-text-muted">Earned</div>
                  <div className={`font-display flex items-center gap-1 ${ref.coinsEarned > 0 ? 'text-secondary-glow' : 'text-text-muted'}`}>
                    <Coins className="w-3 h-3" />
                    {ref.coinsEarned}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}