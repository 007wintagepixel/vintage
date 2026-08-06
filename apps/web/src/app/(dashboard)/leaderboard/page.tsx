'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';

type Period = 'today' | 'week' | 'all';

interface Player {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  wins: number;
  losses: number;
  totalMatches: number;
  rating: number;
  trend: 'up' | 'down' | 'same';
  isYou?: boolean;
}

const mockPlayers: Player[] = [
  { id: '1', rank: 1, username: 'QuantumKnight', avatar: 'QK', wins: 487, losses: 102, totalMatches: 589, rating: 2847, trend: 'up' },
  { id: '2', rank: 2, username: 'NeonStriker', avatar: 'NS', wins: 451, losses: 121, totalMatches: 572, rating: 2792, trend: 'up' },
  { id: '3', rank: 3, username: 'VoidWalker', avatar: 'VW', wins: 423, losses: 134, totalMatches: 557, rating: 2715, trend: 'down' },
  { id: '4', rank: 4, username: 'CyberRogue', avatar: 'CR', wins: 398, losses: 145, totalMatches: 543, rating: 2658, trend: 'up' },
  { id: '5', rank: 5, username: 'PixelPhantom', avatar: 'PP', wins: 376, losses: 158, totalMatches: 534, rating: 2601, trend: 'same' },
  { id: '6', rank: 6, username: 'AstroBlitz', avatar: 'AB', wins: 355, losses: 167, totalMatches: 522, rating: 2548, trend: 'down' },
  { id: '7', rank: 7, username: 'ShadowByte', avatar: 'SB', wins: 341, losses: 172, totalMatches: 513, rating: 2492, trend: 'up' },
  { id: '8', rank: 8, username: 'GlitchKing', avatar: 'GK', wins: 328, losses: 181, totalMatches: 509, rating: 2437, trend: 'up' },
  { id: '9', rank: 9, username: 'NovaQueen', avatar: 'NQ', wins: 315, losses: 189, totalMatches: 504, rating: 2388, trend: 'down' },
  { id: '10', rank: 10, username: 'FrostByte', avatar: 'FB', wins: 302, losses: 198, totalMatches: 500, rating: 2341, trend: 'same' },
  { id: '11', rank: 11, username: 'EmberFury', avatar: 'EF', wins: 287, losses: 205, totalMatches: 492, rating: 2298, trend: 'up' },
  { id: '12', rank: 12, username: 'StormRider', avatar: 'SR', wins: 271, losses: 213, totalMatches: 484, rating: 2251, trend: 'down' },
  { id: '13', rank: 13, username: 'You', avatar: 'YO', wins: 258, losses: 142, totalMatches: 400, rating: 2193, trend: 'up', isYou: true },
  { id: '14', rank: 14, username: 'ChromeAce', avatar: 'CA', wins: 245, losses: 228, totalMatches: 473, rating: 2156, trend: 'up' },
  { id: '15', rank: 15, username: 'BlazeRunner', avatar: 'BR', wins: 232, losses: 235, totalMatches: 467, rating: 2104, trend: 'down' },
  { id: '16', rank: 16, username: 'DarkMatter', avatar: 'DM', wins: 218, losses: 243, totalMatches: 461, rating: 2058, trend: 'same' },
  { id: '17', rank: 17, username: 'HoloHunter', avatar: 'HH', wins: 205, losses: 251, totalMatches: 456, rating: 2012, trend: 'up' },
  { id: '18', rank: 18, username: 'RiftWalker', avatar: 'RW', wins: 192, losses: 258, totalMatches: 450, rating: 1976, trend: 'down' },
  { id: '19', rank: 19, username: 'Synthwave', avatar: 'SW', wins: 178, losses: 267, totalMatches: 445, rating: 1934, trend: 'up' },
  { id: '20', rank: 20, username: 'EchoBlade', avatar: 'EB', wins: 165, losses: 275, totalMatches: 440, rating: 1891, trend: 'same' },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('week');

  const top3 = mockPlayers.slice(0, 3);
  const rest = mockPlayers.slice(3);
  const yourRank = mockPlayers.find(p => p.isYou);

  const getWinRate = (p: Player) => Math.round((p.wins / p.totalMatches) * 100);

  const getMedalStyle = (rank: number) => {
    switch (rank) {
      case 1: return { bg: 'from-secondary-glow to-amber-600', ring: 'ring-secondary-glow/50', text: 'text-secondary-glow', label: 'Gold' };
      case 2: return { bg: 'from-gray-300 to-gray-500', ring: 'ring-gray-400/50', text: 'text-gray-300', label: 'Silver' };
      case 3: return { bg: 'from-amber-700 to-amber-900', ring: 'ring-amber-700/50', text: 'text-amber-600', label: 'Bronze' };
      default: return { bg: 'from-primary-glow to-accent-magenta', ring: 'ring-primary-glow/30', text: 'text-primary-glow', label: '' };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-accent-green" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-accent-red" />;
      default: return <Minus className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Leaderboard</h1>
          <p className="text-text-secondary mt-1">Climb the ranks and claim your throne</p>
        </div>
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-glow/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary-glow" />
          </div>
          <div>
            <div className="text-body-sm text-text-muted">Your Rank</div>
            <div className="font-display text-heading-md text-primary-glow">#{yourRank?.rank}</div>
          </div>
        </div>
      </motion.div>

      {/* Time Period Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        {[
          { id: 'today' as Period, label: 'Today' },
          { id: 'week' as Period, label: 'This Week' },
          { id: 'all' as Period, label: 'All Time' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPeriod(tab.id)}
            className={`px-6 py-3 rounded-xl text-body-sm font-medium transition-all ${
              period === tab.id
                ? 'bg-primary-glow/20 text-primary-glow border border-primary-glow/30'
                : 'glass-card text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-hover p-6 rounded-2xl text-center md:mt-8"
        >
          <div className="flex justify-center mb-3">
            <Medal className="w-8 h-8 text-gray-300" />
          </div>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getMedalStyle(2).bg} flex items-center justify-center font-display font-bold text-2xl text-background ring-4 ${getMedalStyle(2).ring}`}>
            {top3[1].avatar}
          </div>
          <h3 className="font-display text-heading-md text-text-primary">{top3[1].username}</h3>
          <div className="font-display text-display-sm text-gray-300 mt-1">#2</div>
          <div className="flex justify-center gap-4 mt-4 text-body-sm">
            <div>
              <div className="text-text-muted">Wins</div>
              <div className="font-display text-text-primary">{top3[1].wins}</div>
            </div>
            <div>
              <div className="text-text-muted">Rating</div>
              <div className="font-display text-text-primary">{top3[1].rating}</div>
            </div>
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card-strong p-6 rounded-2xl text-center ring-2 ring-secondary-glow/40"
        >
          <div className="flex justify-center mb-3">
            <Crown className="w-10 h-10 text-secondary-glow" />
          </div>
          <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getMedalStyle(1).bg} flex items-center justify-center font-display font-bold text-3xl text-background ring-4 ${getMedalStyle(1).ring}`}>
            {top3[0].avatar}
          </div>
          <h3 className="font-display text-heading-lg gradient-text-gold">{top3[0].username}</h3>
          <div className="font-display text-display-md text-secondary-glow mt-1">#1</div>
          <div className="flex justify-center gap-4 mt-4 text-body-sm">
            <div>
              <div className="text-text-muted">Wins</div>
              <div className="font-display text-secondary-glow">{top3[0].wins}</div>
            </div>
            <div>
              <div className="text-text-muted">Rating</div>
              <div className="font-display text-secondary-glow">{top3[0].rating}</div>
            </div>
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card-hover p-6 rounded-2xl text-center md:mt-12"
        >
          <div className="flex justify-center mb-3">
            <Medal className="w-8 h-8 text-amber-600" />
          </div>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getMedalStyle(3).bg} flex items-center justify-center font-display font-bold text-2xl text-background ring-4 ${getMedalStyle(3).ring}`}>
            {top3[2].avatar}
          </div>
          <h3 className="font-display text-heading-md text-text-primary">{top3[2].username}</h3>
          <div className="font-display text-display-sm text-amber-600 mt-1">#3</div>
          <div className="flex justify-center gap-4 mt-4 text-body-sm">
            <div>
              <div className="text-text-muted">Wins</div>
              <div className="font-display text-text-primary">{top3[2].wins}</div>
            </div>
            <div>
              <div className="text-text-muted">Rating</div>
              <div className="font-display text-text-primary">{top3[2].rating}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ranked List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-surface-border">
          <h2 className="font-display text-heading-md text-text-primary">Full Rankings</h2>
        </div>
        <div className="p-4 space-y-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-body-sm text-text-muted font-medium">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Player</div>
            <div className="col-span-2 text-center">Wins</div>
            <div className="col-span-2 text-center">Win Rate</div>
            <div className="col-span-2 text-center">Matches</div>
            <div className="col-span-2 text-center">Rating</div>
          </div>

          {/* Player Rows */}
          {rest.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.04 }}
              className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-xl items-center transition-all ${
                player.isYou
                  ? 'glass-card-hover ring-1 ring-primary-glow/50 bg-primary-glow/5'
                  : 'hover:bg-surface-tertiary'
              }`}
            >
              <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                <span className="font-display text-heading-md text-text-secondary">{player.rank}</span>
                {getTrendIcon(player.trend)}
              </div>
              <div className="col-span-7 md:col-span-3 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-sm text-background flex-shrink-0">
                  {player.avatar}
                </div>
                <span className="font-medium text-text-primary truncate">
                  {player.username}
                  {player.isYou && <span className="text-primary-glow text-body-sm ml-2">(You)</span>}
                </span>
              </div>
              <div className="col-span-1 md:col-span-2 text-center">
                <span className="font-display text-text-primary">{player.wins}</span>
              </div>
              <div className="hidden md:block col-span-2 text-center">
                <span className={`font-display ${getWinRate(player) >= 60 ? 'text-accent-green' : getWinRate(player) >= 40 ? 'text-secondary-glow' : 'text-accent-red'}`}>
                  {getWinRate(player)}%
                </span>
              </div>
              <div className="hidden md:block col-span-2 text-center">
                <span className="text-text-secondary">{player.totalMatches}</span>
              </div>
              <div className="col-span-2 md:col-span-2 text-center">
                <span className="font-display text-primary-glow">{player.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}