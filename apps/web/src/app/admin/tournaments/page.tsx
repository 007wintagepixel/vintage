"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Trophy,
  Plus,
  Users,
  Coins,
  Calendar,
  Play,
  CheckCircle,
  X,
  Crown,
  Settings,
  Eye,
} from "lucide-react";

type TournamentStatus = "live" | "upcoming" | "completed";

interface MockTournament {
  id: string;
  name: string;
  status: TournamentStatus;
  participants: number;
  maxParticipants: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  format: string;
  winner?: string;
}

const mockTournaments: MockTournament[] = [
  {
    id: "T-001",
    name: "New Year Championship",
    status: "live",
    participants: 32,
    maxParticipants: 32,
    prizePool: 100000,
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    format: "Double Elimination",
  },
  {
    id: "T-002",
    name: "Weekend Warriors Cup",
    status: "upcoming",
    participants: 64,
    maxParticipants: 128,
    prizePool: 50000,
    startDate: "2024-01-20",
    endDate: "2024-01-21",
    format: "Single Elimination",
  },
  {
    id: "T-003",
    name: "Pro League Season 3",
    status: "completed",
    participants: 16,
    maxParticipants: 16,
    prizePool: 200000,
    startDate: "2024-01-01",
    endDate: "2024-01-10",
    format: "Round Robin",
    winner: "strategicMind",
  },
  {
    id: "T-004",
    name: "Daily Quick Cup",
    status: "upcoming",
    participants: 8,
    maxParticipants: 16,
    prizePool: 5000,
    startDate: "2024-01-16",
    endDate: "2024-01-16",
    format: "Single Elimination",
  },
  {
    id: "T-005",
    name: "Team Battle Royale",
    status: "upcoming",
    participants: 24,
    maxParticipants: 32,
    prizePool: 30000,
    startDate: "2024-02-03",
    endDate: "2024-02-04",
    format: "Team 2v2",
  },
  {
    id: "T-006",
    name: "Beginner's Luck Open",
    status: "completed",
    participants: 48,
    maxParticipants: 64,
    prizePool: 10000,
    startDate: "2023-12-20",
    endDate: "2023-12-22",
    format: "Swiss",
    winner: "championKing",
  },
];

export default function AdminTournamentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeTournaments = mockTournaments.filter(
    (t) => t.status === "live" || t.status === "upcoming",
  );
  const pastTournaments = mockTournaments.filter(
    (t) => t.status === "completed",
  );

  const getStatusBadge = (status: TournamentStatus) => {
    switch (status) {
      case "live":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green flex items-center gap-1 w-fit">
            <Play className="w-3 h-3" /> Live Now
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow flex items-center gap-1 w-fit">
            <Calendar className="w-3 h-3" /> Upcoming
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-surface-tertiary text-text-muted flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="font-display text-display-md gradient-text">
            Tournament Management
          </h2>
          <p className="text-text-secondary mt-1">
            Create and manage platform tournaments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Tournament
        </button>
      </motion.div>

      {/* Active Tournaments Grid */}
      <div>
        <h3 className="font-display text-heading-sm text-text-primary mb-4">
          Active & Upcoming
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTournaments.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6 rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-glow to-accent-orange flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                {getStatusBadge(t.status)}
              </div>

              {/* Name */}
              <h4 className="font-display text-heading-sm text-text-primary mb-1">
                {t.name}
              </h4>
              <p className="text-caption text-text-muted mb-4">{t.format}</p>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-text-muted flex items-center gap-1">
                    <Users className="w-4 h-4" /> Participants
                  </span>
                  <span className="text-text-primary font-medium">
                    {t.participants}/{t.maxParticipants}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-text-muted flex items-center gap-1">
                    <Coins className="w-4 h-4" /> Prize Pool
                  </span>
                  <span className="text-secondary-glow font-mono font-medium">
                    {t.prizePool.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-text-muted flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Start Date
                  </span>
                  <span className="text-text-secondary">{t.startDate}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(t.participants / t.maxParticipants) * 100}%`,
                  }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  className="h-full bg-gradient-to-r from-primary-glow to-accent-magenta rounded-full"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="btn-ghost flex-1 text-body-sm gap-2">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="btn-ghost text-body-sm p-3" title="Settings">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Past Tournaments */}
      <div>
        <h3 className="font-display text-heading-sm text-text-primary mb-4">
          Past Tournaments
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-strong rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-caption text-text-muted border-b border-surface-border bg-surface-tertiary/30">
                  <th className="py-4 px-4 font-medium">Tournament</th>
                  <th className="py-4 px-4 font-medium">Format</th>
                  <th className="py-4 px-4 font-medium">Participants</th>
                  <th className="py-4 px-4 font-medium">Prize Pool</th>
                  <th className="py-4 px-4 font-medium">Date</th>
                  <th className="py-4 px-4 font-medium">Winner</th>
                  <th className="py-4 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastTournaments.map((t, index) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-surface-border/50 hover:bg-surface-tertiary/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-text-muted flex-shrink-0" />
                        <span className="font-medium text-text-primary text-body-sm">
                          {t.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-body-sm text-text-secondary">
                      {t.format}
                    </td>
                    <td className="py-4 px-4 text-body-sm text-text-secondary">
                      {t.participants}
                    </td>
                    <td className="py-4 px-4 text-body-sm text-secondary-glow font-mono font-medium">
                      {t.prizePool.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-body-sm text-text-muted">
                      {t.startDate} — {t.endDate}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-secondary-glow" />
                        <span className="text-body-sm text-text-primary font-medium">
                          {t.winner}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        className="p-2 rounded-lg text-text-muted hover:text-primary-glow hover:bg-primary-glow/10 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-DEFAULT/80 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-strong p-8 rounded-2xl max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-heading-md gradient-text">
                Create Tournament
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Tournament Name</label>
                <input
                  type="text"
                  placeholder="e.g. Spring Championship"
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Format</label>
                  <select className="input cursor-pointer">
                    <option>Single Elimination</option>
                    <option>Double Elimination</option>
                    <option>Round Robin</option>
                    <option>Swiss</option>
                    <option>Team 2v2</option>
                  </select>
                </div>
                <div>
                  <label className="label">Max Players</label>
                  <select className="input cursor-pointer">
                    <option>8</option>
                    <option>16</option>
                    <option>32</option>
                    <option>64</option>
                    <option>128</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Prize Pool (coins)</label>
                <input type="number" placeholder="50000" className="input" />
              </div>
              <div>
                <label className="label">Start Date</label>
                <input type="date" className="input" />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-primary flex-1 gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
