'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Gamepad2,
  Play,
  Flag,
  Ban,
  Eye,
  Clock,
  Users,
  Coins,
  Trophy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
} from 'lucide-react';

type MatchStatus = 'active' | 'completed' | 'cancelled' | 'flagged';

interface MockMatch {
  id: string;
  mode: string;
  players: number;
  maxPlayers: number;
  status: MatchStatus;
  duration: string;
  entryFee: number;
  prizePool: number;
  date: string;
}

const mockMatches: MockMatch[] = [
  { id: 'M-4291', mode: 'Classic 4P', players: 4, maxPlayers: 4, status: 'active', duration: '12:34', entryFee: 500, prizePool: 2000, date: '2024-01-28 14:30' },
  { id: 'M-4290', mode: 'Quick 2P', players: 2, maxPlayers: 2, status: 'active', duration: '05:21', entryFee: 200, prizePool: 400, date: '2024-01-28 14:28' },
  { id: 'M-4289', mode: 'Tournament', players: 4, maxPlayers: 4, status: 'completed', duration: '18:45', entryFee: 1000, prizePool: 5000, date: '2024-01-28 14:15' },
  { id: 'M-4288', mode: 'Classic 4P', players: 4, maxPlayers: 4, status: 'completed', duration: '22:10', entryFee: 500, prizePool: 2000, date: '2024-01-28 14:00' },
  { id: 'M-4287', mode: 'Quick 2P', players: 2, maxPlayers: 2, status: 'cancelled', duration: '—', entryFee: 200, prizePool: 0, date: '2024-01-28 13:45' },
  { id: 'M-4286', mode: 'Team 2v2', players: 4, maxPlayers: 4, status: 'flagged', duration: '15:30', entryFee: 800, prizePool: 3200, date: '2024-01-28 13:30' },
  { id: 'M-4285', mode: 'Classic 4P', players: 4, maxPlayers: 4, status: 'completed', duration: '19:22', entryFee: 500, prizePool: 2000, date: '2024-01-28 13:15' },
  { id: 'M-4284', mode: 'Quick 2P', players: 2, maxPlayers: 2, status: 'completed', duration: '08:14', entryFee: 200, prizePool: 400, date: '2024-01-28 13:00' },
  { id: 'M-4283', mode: 'Tournament', players: 4, maxPlayers: 4, status: 'flagged', duration: '25:40', entryFee: 2500, prizePool: 10000, date: '2024-01-28 12:45' },
  { id: 'M-4282', mode: 'Classic 4P', players: 3, maxPlayers: 4, status: 'cancelled', duration: '—', entryFee: 500, prizePool: 0, date: '2024-01-28 12:30' },
  { id: 'M-4281', mode: 'Team 2v2', players: 4, maxPlayers: 4, status: 'completed', duration: '16:55', entryFee: 800, prizePool: 3200, date: '2024-01-28 12:15' },
  { id: 'M-4280', mode: 'Quick 2P', players: 2, maxPlayers: 2, status: 'active', duration: '03:42', entryFee: 200, prizePool: 400, date: '2024-01-28 12:00' },
];

const filterOptions: { value: MatchStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Matches' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'flagged', label: 'Flagged' },
];

export default function AdminMatchesPage() {
  const [filter, setFilter] = useState<MatchStatus | 'all'>('all');

  const filteredMatches = mockMatches.filter(
    (m) => filter === 'all' || m.status === filter
  );

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green flex items-center gap-1 w-fit"><Play className="w-3 h-3" /> Active</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-red/20 text-accent-red flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case 'flagged':
        return <span className="px-2 py-1 rounded-full text-caption font-medium bg-secondary-glow/20 text-secondary-glow flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Flagged</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-display-md gradient-text">Match Management</h2>
        <p className="text-text-secondary mt-1">
          Monitor and manage all platform matches
        </p>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Matches', value: mockMatches.length, icon: Gamepad2, color: 'text-primary-glow' },
          { label: 'Active Now', value: mockMatches.filter((m) => m.status === 'active').length, icon: Play, color: 'text-accent-green' },
          { label: 'Flagged', value: mockMatches.filter((m) => m.status === 'flagged').length, icon: Flag, color: 'text-secondary-glow' },
          { label: 'Cancelled', value: mockMatches.filter((m) => m.status === 'cancelled').length, icon: Ban, color: 'text-accent-red' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-tertiary flex items-center justify-center">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="font-display text-heading-sm text-text-primary">{stat.value}</div>
              <div className="text-caption text-text-muted">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <div className="flex items-center gap-2 mr-2 text-text-muted">
          <Filter className="w-4 h-4" />
          <span className="text-body-sm">Filter:</span>
        </div>
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-xl text-body-sm font-medium transition-all ${
              filter === opt.value
                ? 'bg-primary-glow/20 text-primary-glow border border-primary-glow/30'
                : 'glass-panel text-text-secondary hover:text-text-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </motion.div>

      {/* Matches Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="text-left text-caption text-text-muted border-b border-surface-border bg-surface-tertiary/30">
                <th className="py-4 px-4 font-medium">Match ID</th>
                <th className="py-4 px-4 font-medium">Mode</th>
                <th className="py-4 px-4 font-medium">Players</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Duration</th>
                <th className="py-4 px-4 font-medium">Entry Fee</th>
                <th className="py-4 px-4 font-medium">Prize Pool</th>
                <th className="py-4 px-4 font-medium">Date</th>
                <th className="py-4 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match, index) => (
                <motion.tr
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-surface-border/50 hover:bg-surface-tertiary/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-body-sm text-text-primary font-medium">{match.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-lg text-caption font-medium bg-surface-tertiary text-text-secondary">
                      {match.mode}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-body-sm text-text-secondary">
                      <Users className="w-4 h-4 text-text-muted" />
                      {match.players}/{match.maxPlayers}
                    </div>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(match.status)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-body-sm text-text-secondary">
                      <Clock className="w-4 h-4 text-text-muted" />
                      {match.duration}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-body-sm text-text-secondary font-mono">
                    {match.entryFee.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-body-sm text-secondary-glow font-mono font-medium">
                    {match.prizePool.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-body-sm text-text-muted">{match.date}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {match.status === 'completed' && (
                        <button className="p-2 rounded-lg text-text-muted hover:text-primary-glow hover:bg-primary-glow/10 transition-all" title="View Replay">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {match.status === 'active' && (
                        <button className="p-2 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all" title="Cancel Match">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      {match.status !== 'flagged' && match.status !== 'cancelled' && (
                        <button className="p-2 rounded-lg text-text-muted hover:text-secondary-glow hover:bg-secondary-glow/10 transition-all" title="Flag for Review">
                          <Flag className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMatches.length === 0 && (
          <div className="py-16 text-center text-text-muted">No matches found for this filter.</div>
        )}
      </motion.div>
    </div>
  );
}