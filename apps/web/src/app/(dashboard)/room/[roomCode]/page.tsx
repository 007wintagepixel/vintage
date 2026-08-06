'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  Coins,
  Lock,
  Globe,
  Play,
  Share2,
  LogOut,
  Copy,
  Check,
  Settings,
  UserMinus,
  Crown,
  Wifi,
  Swords,
  ChevronRight,
} from 'lucide-react';

interface RoomPlayer {
  id: string;
  username: string;
  avatar: string;
  color: 'red' | 'green' | 'yellow' | 'blue';
  isHost: boolean;
  isReady: boolean;
  isOnline: boolean;
}

const colorMap = {
  red: { bg: 'bg-player-red', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]', text: 'text-player-red' },
  green: { bg: 'bg-player-green', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.4)]', text: 'text-player-green' },
  yellow: { bg: 'bg-player-yellow', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]', text: 'text-player-yellow' },
  blue: { bg: 'bg-player-blue', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]', text: 'text-player-blue' },
};

export default function RoomLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params?.roomCode as string) || 'UNKNOWN';

  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<RoomPlayer[]>([
    {
      id: '1',
      username: 'You',
      avatar: 'P1',
      color: 'red',
      isHost: true,
      isReady: true,
      isOnline: true,
    },
    {
      id: '2',
      username: 'PlayerTwo',
      avatar: 'P2',
      color: 'blue',
      isHost: false,
      isReady: true,
      isOnline: true,
    },
  ]);

  // Simulate a player joining after 5 seconds
  useEffect(() => {
    if (players.length >= 4) return;
    const timer = setTimeout(() => {
      if (players.length < 3) {
        setPlayers((prev) => [
          ...prev,
          {
            id: '3',
            username: 'PlayerThree',
            avatar: 'P3',
            color: 'green',
            isHost: false,
            isReady: false,
            isOnline: true,
          },
        ]);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [players.length]);

  const maxPlayers = 4;
  const joinedCount = players.length;
  const canStart = joinedCount >= 2 && players.every((p) => p.isReady);
  const matchId = `match-${roomCode.toLowerCase()}`;

  const roomSettings = {
    name: 'Friday Night Ludo',
    mode: 'classic' as const,
    entryFee: 100,
    privacy: 'private' as const,
  };

  const handleShare = async () => {
    const shareText = `Join my Ludo Nexus room! Code: ${roomCode}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Ludo Nexus Room', text: shareText });
      } else {
        await navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled or clipboard unavailable
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleLeave = () => {
    router.push('/game-modes');
  };

  const emptySlots = maxPlayers - joinedCount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-display-md gradient-text">Room</h1>
            <button
              onClick={handleCopyCode}
              className="glass-card px-4 py-2 rounded-xl font-display text-heading-md tracking-widest hover:border-primary-glow transition-all flex items-center gap-2 group"
            >
              {roomCode}
              {copied ? (
                <Check className="w-4 h-4 text-accent-green" />
              ) : (
                <Copy className="w-4 h-4 text-text-muted group-hover:text-primary-glow transition-colors" />
              )}
            </button>
          </div>
          <p className="text-text-secondary">
            {roomSettings.name} • Waiting for players to join
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-3 rounded-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-glow" />
            <span className="font-display text-heading-sm">
              {joinedCount}/{maxPlayers}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="glass-card-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-heading-md">Players</h2>
              <span className="text-body-sm text-text-muted">
                {joinedCount} joined • {emptySlots} waiting
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Joined Players */}
              {players.map((player, index) => {
                const color = colorMap[player.color];
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card-hover p-5 rounded-2xl ${color.glow} border-l-4`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`w-14 h-14 rounded-xl ${color.bg} flex items-center justify-center font-display font-bold text-xl text-white`}
                        >
                          {player.avatar}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent-green border-2 border-background-DEFAULT" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary truncate">{player.username}</span>
                          {player.isHost && (
                            <Crown className="w-4 h-4 text-secondary-glow flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {player.isReady ? (
                            <span className="flex items-center gap-1 text-body-sm text-accent-green">
                              <Check className="w-3.5 h-3.5" />
                              Ready
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-body-sm text-secondary-glow">
                              <Clock className="w-3.5 h-3.5 animate-pulse" />
                              Getting ready...
                            </span>
                          )}
                        </div>
                      </div>
                      {!player.isHost && (
                        <button className="btn-ghost p-2 rounded-lg hover:bg-accent-red/10 hover:text-accent-red">
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Empty Slots */}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <motion.div
                  key={`empty-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card p-5 rounded-2xl border-dashed"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="w-14 h-14 rounded-xl bg-surface-tertiary border-2 border-dashed border-surface-border flex items-center justify-center"
                    >
                      <Users className="w-6 h-6 text-text-muted" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-medium text-text-muted">Waiting for player...</div>
                      <div className="text-body-sm text-text-muted mt-1">Slot {joinedCount + index + 1} of {maxPlayers}</div>
                    </div>
                    <Wifi className="w-5 h-5 text-text-muted/30" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Share Room Code Section */}
            <div className="mt-6 p-4 glass-card rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-glow/10 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-primary-glow" />
                </div>
                <div>
                  <div className="text-body-sm font-medium">Invite your friends</div>
                  <div className="text-caption text-text-muted">Share the code {roomCode} or this link</div>
                </div>
              </div>
              <button onClick={handleShare} className="btn-secondary gap-2 text-body-sm">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Settings & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Room Settings */}
          <div className="glass-card-strong rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-primary-glow" />
              <h3 className="font-display text-heading-sm">Room Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-surface-border">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Mode
                </span>
                <span className="text-body-sm font-medium capitalize">{roomSettings.mode}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-border">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  <Users className="w-4 h-4" /> Max Players
                </span>
                <span className="text-body-sm font-medium">{maxPlayers}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-border">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  <Coins className="w-4 h-4" /> Entry Fee
                </span>
                <span className="text-body-sm font-medium">
                  {roomSettings.entryFee === 0 ? 'Free' : `${roomSettings.entryFee} coins`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-body-sm text-text-muted flex items-center gap-2">
                  {roomSettings.privacy === 'private' ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}{' '}
                  Privacy
                </span>
                <span className="text-body-sm font-medium capitalize">{roomSettings.privacy}</span>
              </div>
            </div>

            {/* Pot Info */}
            <div className="mt-4 p-4 glass-card rounded-xl text-center">
              <div className="text-caption text-text-muted mb-1">Total Prize Pot</div>
              <div className="font-display text-display-sm gradient-text-gold">
                {roomSettings.entryFee * maxPlayers} coins
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/game/${matchId}`}
              className={`w-full gap-2 text-body-lg py-4 ${
                canStart ? 'btn-primary' : 'btn opacity-50 cursor-not-allowed pointer-events-none'
              }`}
              aria-disabled={!canStart}
            >
              <Play className="w-5 h-5" />
              Start Game
            </Link>
            {!canStart && (
              <p className="text-caption text-text-muted text-center">
                {joinedCount < 2
                  ? 'Need at least 2 players to start'
                  : 'Waiting for all players to be ready'}
              </p>
            )}
            <button onClick={handleShare} className="btn-secondary w-full gap-2">
              <Share2 className="w-4 h-4" />
              Share Room Code
            </button>
            <button onClick={handleLeave} className="btn-danger w-full gap-2">
              <LogOut className="w-4 h-4" />
              Leave Room
            </button>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-4">
            <Link
              href="/matchmaking"
              className="flex items-center justify-between text-body-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-primary-glow" />
                Quick Match
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}