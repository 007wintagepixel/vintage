'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  DoorOpen,
  Lock,
  Globe,
  Coins,
  Users,
  Zap,
  Clock,
  ArrowLeft,
  Circle,
  Check,
  Plus,
} from 'lucide-react';

type GameMode = 'classic' | 'quick';
type Privacy = 'public' | 'private';
type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

const playerColors: { id: PlayerColor; label: string; bg: string; border: string; glow: string }[] = [
  { id: 'red', label: 'Red', bg: 'bg-player-red', border: 'border-player-red', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' },
  { id: 'green', label: 'Green', bg: 'bg-player-green', border: 'border-player-green', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-player-yellow', border: 'border-player-yellow', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]' },
  { id: 'blue', label: 'Blue', bg: 'bg-player-blue', border: 'border-player-blue', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
];

const entryFees = [0, 50, 100, 250, 500, 1000];

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [privacy, setPrivacy] = useState<Privacy>('private');
  const [entryFee, setEntryFee] = useState(100);
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('red');

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    router.push(`/room/${code}`);
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
          <h1 className="font-display text-display-md gradient-text">Create Room</h1>
          <p className="text-text-secondary mt-1">Set up a private match and invite your friends</p>
        </div>
        <Link href="/game-modes" className="btn-ghost gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Game Modes
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Room Name */}
          <div className="glass-card-strong rounded-2xl p-6">
            <label className="label flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-primary-glow" />
              Room Name
            </label>
            <input
              type="text"
              placeholder="e.g. Friday Night Ludo"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength={30}
              className="input"
            />
            <p className="text-caption text-text-muted mt-2">{roomName.length}/30 characters</p>
          </div>

          {/* Game Mode */}
          <div className="glass-card-strong rounded-2xl p-6">
            <label className="label">Game Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGameMode('classic')}
                className={`glass-card-hover p-5 rounded-2xl text-left transition-all ${
                  gameMode === 'classic' ? 'border-primary-glow shadow-glow bg-primary-glow/5' : ''
                }`}
              >
                <Clock className="w-6 h-6 text-primary-glow mb-3" />
                <div className="font-display text-heading-sm">Classic</div>
                <p className="text-body-sm text-text-secondary mt-1">Standard rules, all tokens must reach home</p>
              </button>
              <button
                onClick={() => setGameMode('quick')}
                className={`glass-card-hover p-5 rounded-2xl text-left transition-all ${
                  gameMode === 'quick' ? 'border-primary-glow shadow-glow bg-primary-glow/5' : ''
                }`}
              >
                <Zap className="w-6 h-6 text-secondary-glow mb-3" />
                <div className="font-display text-heading-sm">Quick</div>
                <p className="text-body-sm text-text-secondary mt-1">Faster pace, first token to finish wins</p>
              </button>
            </div>
          </div>

          {/* Max Players */}
          <div className="glass-card-strong rounded-2xl p-6">
            <label className="label flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-glow" />
              Max Players
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setMaxPlayers(n)}
                  className={`glass-card-hover p-4 rounded-2xl text-center transition-all ${
                    maxPlayers === n ? 'border-primary-glow shadow-glow bg-primary-glow/5' : ''
                  }`}
                >
                  <div className="font-display text-display-sm">{n}</div>
                  <div className="text-caption text-text-muted mt-1">Players</div>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="glass-card-strong rounded-2xl p-6">
            <label className="label">Privacy</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPrivacy('public')}
                className={`glass-card-hover p-5 rounded-2xl text-left transition-all ${
                  privacy === 'public' ? 'border-primary-glow shadow-glow bg-primary-glow/5' : ''
                }`}
              >
                <Globe className="w-6 h-6 text-accent-green mb-3" />
                <div className="font-display text-heading-sm">Public</div>
                <p className="text-body-sm text-text-secondary mt-1">Anyone can find and join</p>
              </button>
              <button
                onClick={() => setPrivacy('private')}
                className={`glass-card-hover p-5 rounded-2xl text-left transition-all ${
                  privacy === 'private' ? 'border-primary-glow shadow-glow bg-primary-glow/5' : ''
                }`}
              >
                <Lock className="w-6 h-6 text-accent-magenta mb-3" />
                <div className="font-display text-heading-sm">Private</div>
                <p className="text-body-sm text-text-secondary mt-1">Invite only with room code</p>
              </button>
            </div>
          </div>

          {/* Entry Fee */}
          <div className="glass-card-strong rounded-2xl p-6">
            <label className="label flex items-center gap-2">
              <Coins className="w-4 h-4 text-secondary-glow" />
              Entry Fee (Demo Coins)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {entryFees.map((fee) => (
                <button
                  key={fee}
                  onClick={() => setEntryFee(fee)}
                  className={`glass-card-hover p-3 rounded-xl text-center transition-all ${
                    entryFee === fee ? 'border-secondary-glow shadow-glow-gold bg-secondary-glow/5' : ''
                  }`}
                >
                  <div className="font-display text-heading-sm">{fee === 0 ? 'Free' : fee}</div>
                  {fee > 0 && <div className="text-caption text-text-muted">coins</div>}
                </button>
              ))}
            </div>
            <div className="mt-4 glass-card p-3 rounded-xl flex items-center justify-between">
              <span className="text-body-sm text-text-secondary">Total Pot</span>
              <span className="font-display text-heading-md gradient-text-gold">
                {entryFee * maxPlayers} coins
              </span>
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Token Color & Create */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Token Color Selection */}
          <div className="glass-card-strong rounded-2xl p-6">
            <label className="label">Choose Your Token Color</label>
            <div className="grid grid-cols-2 gap-4">
              {playerColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`glass-card-hover p-4 rounded-2xl flex flex-col items-center gap-3 transition-all ${
                    selectedColor === color.id ? `border-2 ${color.border} ${color.glow}` : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center`}>
                    {selectedColor === color.id && <Check className="w-5 h-5 text-white" />}
                  </div>
                  <span className="text-body-sm font-medium">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="glass-card-strong rounded-2xl p-6">
            <h3 className="font-display text-heading-sm mb-4">Room Preview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-body-sm">
                <span className="text-text-muted">Name</span>
                <span className="text-text-primary">{roomName || 'Untitled Room'}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-muted">Mode</span>
                <span className="text-text-primary capitalize">{gameMode}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-muted">Players</span>
                <span className="text-text-primary">{maxPlayers} max</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-muted">Privacy</span>
                <span className="text-text-primary capitalize">{privacy}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-muted">Entry Fee</span>
                <span className="text-text-primary">{entryFee === 0 ? 'Free' : `${entryFee} coins`}</span>
              </div>
              <div className="flex justify-between text-body-sm items-center pt-2 border-t border-surface-border">
                <span className="text-text-muted">Your Color</span>
                <div className="flex items-center gap-2">
                  <Circle
                    className={`w-4 h-4 ${
                      playerColors.find((c) => c.id === selectedColor)?.bg
                    } rounded-full fill-current`}
                  />
                  <span className="text-text-primary capitalize">{selectedColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button onClick={handleCreateRoom} className="btn-primary w-full gap-2 text-body-lg py-4">
            <Plus className="w-5 h-5" />
            Create Room
          </button>
        </motion.div>
      </div>
    </div>
  );
}