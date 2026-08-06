'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Dice1, Brain, Users, Trophy, Target, Shield,
  Play, ArrowRight, Check, X, Settings, Info,
  RotateCcw, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function GameModesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-neon-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-glow/10 via-transparent to-accent-magenta/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta/10 rounded-full blur-3xl animate-float-slow" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-surface-border mx-4 mt-4 rounded-xl max-w-7xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
              <Dice1 className="w-6 h-6 text-text-inverse" />
            </div>
            <span className="font-display text-heading-lg gradient-text">Ludo Nexus</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-body-sm hidden sm:inline-flex">Sign In</Link>
            <Link href="/register" className="btn-primary text-body-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-body-sm text-primary-glow font-medium uppercase tracking-wider"
          >
            Game Modes
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-display-lg mt-2 mb-4 gradient-text"
          >
            Choose Your Battle
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-body-lg text-text-secondary max-w-2xl mx-auto"
          >
            From solo practice to competitive tournaments — every mode crafted for fair, exciting gameplay.
          </motion.p>
        </div>
      </header>

      {/* Game Mode Cards */}
      <main className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card-hover group relative overflow-hidden h-full flex flex-col"
              >
                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/5 via-transparent to-accent-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-full text-caption font-medium bg-surface-tertiary text-text-secondary">
                      {mode.players}
                    </span>
                    <span className="px-3 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow">
                      {mode.difficulty}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-8 relative">
                    <mode.icon className="w-24 h-24 text-primary-glow opacity-80 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary-glow/30 animate-pulse-glow" />
                    <div className="absolute inset-4 rounded-full border border-surface-borderGlow/50" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-heading-lg text-center mb-3">{mode.title}</h3>
                  <p className="text-text-secondary text-center text-body mb-8 flex-1">{mode.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-8 border-t border-surface-border pt-6">
                    {mode.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-body-sm text-text-muted">
                        <span className="w-5 h-5 rounded-lg bg-surface-tertiary flex items-center justify-center text-primary-glow">
                          <Check className="w-3 h-3" />
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-border">
                    <Link 
                      href={`/game-modes/${mode.id}`}
                      className="btn-primary w-full justify-center group-hover:scale-[1.02] transition-transform"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play {mode.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                      href={`/game-modes/${mode.id}/rules`}
                      className="btn-ghost w-full justify-center border border-surface-borderGlow"
                    >
                      <Info className="w-4 h-4" />
                      View Rules
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Comparison Table */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-display-md gradient-text">Quick Comparison</h2>
            <p className="text-body-lg text-text-secondary mt-2">Compare all modes at a glance</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full glass-card-strong rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-surface-tertiary/50 border-b border-surface-border">
                  <th className="px-6 py-4 text-left font-medium text-text-primary">Feature</th>
                  {gameModes.map(mode => (
                    <th key={mode.id} className="px-4 py-4 text-center font-medium text-text-primary">
                      {mode.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, rowIndex) => (
                  <tr key={row.feature} className="border-b border-surface-border/50 transition-colors hover:bg-surface-tertiary/30">
                    <td className="px-6 py-4 font-medium text-text-primary">{row.feature}</td>
                    {row.values.map((value, colIndex) => (
                      <td key={colIndex} className="px-4 py-4 text-center">
                        {value === true ? (
                          <Check className="w-5 h-5 text-accent-green mx-auto" />
                        ) : value === false ? (
                          <X className="w-5 h-5 text-text-muted mx-auto" />
                        ) : (
                          <span className="text-body-sm text-text-secondary">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Rules Overview */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-display-md gradient-text">Core Ludo Rules</h2>
            <p className="text-body-lg text-text-secondary mt-2">Applies to all game modes</p>
          </motion.div>

          <div className="glass-panel p-8 space-y-6">
            {coreRules.map((rule, index) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl bg-surface-tertiary/50 border border-surface-border hover:border-surface-borderGlow transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-glow/20 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-6 h-6 text-primary-glow" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1">{rule.title}</h4>
                  <p className="text-text-secondary text-body-sm">{rule.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div className="glass-panel-strong p-12 md:p-16 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-30" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-glow via-accent-magenta to-secondary-glow" />
            
            <div className="relative z-10">
              <h2 className="font-display text-display-md mb-4 gradient-text">Ready to Roll?</h2>
              <p className="text-body-lg text-text-secondary mb-8 max-w-xl mx-auto">
                Pick a mode, invite friends, or test your skills against AI. Your first game is just a click away.
              </p>
              <Link href="/register" className="btn-primary px-10 py-4 text-body-lg inline-flex group">
                Create Free Account & Play
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-body-sm text-text-muted">
          <p>© 2024 Ludo Nexus. Demo mode only. Play responsibly.</p>
        </div>
      </footer>
    </div>
  );
}

// Game Modes Data (same as home page)
const gameModes = [
  {
    id: 'vs-ai',
    title: 'Practice vs AI',
    icon: Brain,
    players: '1 Player + Bots',
    difficulty: 'Easy • Medium • Hard',
    description: 'Perfect your strategy against intelligent bots. Pause, resume, and learn at your own pace.',
    features: [
      '3 difficulty levels',
      'Offline play supported',
      'Local statistics tracking',
      'No entry fee',
      'Instant start',
    ],
  },
  {
    id: 'vs-human',
    title: 'Quick Match',
    icon: Users,
    players: '2-4 Players',
    difficulty: 'Skill-Based',
    description: 'Enter the queue and get matched with players of similar skill. Fair, fast, competitive.',
    features: [
      'ELO-based matchmaking',
      '~30 second avg wait',
      'Demo coin entry fees',
      'Real-time chat',
      'Replay system',
    ],
  },
  {
    id: 'group',
    title: 'Private Room',
    icon: Target,
    players: '2-4 Players',
    difficulty: 'Custom Rules',
    description: 'Create your own room with custom rules, invite friends, and play on your terms.',
    features: [
      'Public or private rooms',
      'Custom game rules',
      'Password protection',
      'Spectator slots',
      'Bot fill option',
    ],
  },
  {
    id: 'tournament',
    title: 'Tournaments',
    icon: Trophy,
    players: '8-256 Players',
    difficulty: 'Knockout Bracket',
    description: 'Compete in scheduled tournaments for glory and massive demo coin prizes.',
    features: [
      'Automated brackets',
      'Registration & check-in',
      'Prize pool distribution',
      'Spectator viewing',
      'Winner showcase',
    ],
  },
  {
    id: 'team',
    title: 'Team Battle 2v2',
    icon: Users,
    players: '2v2 Teams',
    difficulty: 'Partner Strategy',
    description: 'Partner with a friend or get matched. Coordinate captures and defend together.',
    features: [
      'Invite partner or random',
      'Team chat channel',
      'Shared victory condition',
      'Team leaderboards',
      'Rematch option',
    ],
  },
  {
    id: 'private',
    title: 'Private Match',
    icon: Shield,
    players: '2-4 Friends',
    difficulty: 'Invite Only',
    description: 'Exclusive matches with secure invite links. No strangers, just your circle.',
    features: [
      'Secure invite links',
      'QR code sharing',
      'Invite expiration',
      'Host controls',
      'Rematch button',
    ],
  },
];

// Comparison Table Data
const comparisonRows = [
  { feature: 'Entry Fee', values: ['Free', 'Demo Coins', 'Demo Coins', 'Demo Coins', 'Demo Coins', 'Demo Coins'] },
  { feature: 'Player Count', values: ['1-4', '2-4', '2-4', '8-256', '4 (2v2)', '2-4'] },
  { feature: 'Skill Matchmaking', values: [false, true, false, true, true, false] },
  { feature: 'Custom Rules', values: [true, false, true, false, false, false] },
  { feature: 'Tournaments', values: [false, false, false, true, false, false] },
  { feature: 'Team Play', values: [false, false, false, false, true, false] },
  { feature: 'Spectators', values: [false, false, true, true, true, false] },
  { feature: 'Bots Allowed', values: [true, false, true, false, true, false] },
  { feature: 'Offline Play', values: [true, false, false, false, false, false] },
  { feature: 'Chat', values: [false, true, true, true, true, true] },
  { feature: 'Replay System', values: [true, true, true, true, true, true] },
  { feature: 'Leaderboards', values: [false, true, false, true, true, false] },
];

// Core Rules
const coreRules = [
  {
    title: 'Four Tokens Per Player',
    description: 'Each player starts with 4 tokens in their home base. All must reach the center to win.',
  },
  {
    title: 'Enter on Six',
    description: 'A token leaves home only when you roll a 6 (configurable). Rolling 6 grants an extra turn.',
  },
  {
    title: 'Capture Opponents',
    description: 'Land on an opponent\'s token to send it back to their home. Capturing grants an extra turn.',
  },
  {
    title: 'Safe Cells Protected',
    description: 'Colored safe cells (start positions and 4 others) protect tokens from capture.',
  },
  {
    title: 'Exact Roll to Finish',
    description: 'Tokens must roll the exact number to enter the final home position. Overshooting cancels the move.',
  },
  {
    title: 'Three Sixes Rule',
    description: 'Rolling three 6s in a row cancels the turn and passes to the next player (configurable).',
  },
  {
    title: 'Blockades Optional',
    description: 'Two tokens of same color on one cell can form a blockade that cannot be passed (optional rule).',
  },
  {
    title: 'Turn Timeout',
    description: 'Each turn has a time limit (default 30s). Auto-move triggers if only one legal move exists.',
  },
];