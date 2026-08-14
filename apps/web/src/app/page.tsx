"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Dice1,
  Users,
  Trophy,
  Zap,
  Shield,
  Play,
  ArrowRight,
  Star,
  Target,
  Brain,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-neon-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-glow/10 via-transparent to-accent-magenta/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-glow/5 rounded-full blur-3xl" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-surface-border mx-4 mt-4 rounded-xl max-w-7xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
              <Dice1 className="w-6 h-6 text-text-inverse" />
            </div>
            <span className="font-display text-heading-lg gradient-text">
              Ludo Nexus
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-text-secondary hover:text-text-primary transition-colors text-body-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#game-modes"
              className="text-text-secondary hover:text-text-primary transition-colors text-body-sm font-medium"
            >
              Game Modes
            </Link>
            <Link
              href="#tech"
              className="text-text-secondary hover:text-text-primary transition-colors text-body-sm font-medium"
            >
              Technology
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn-ghost text-body-sm hidden sm:inline-flex"
            >
              Sign In
            </Link>
            <Link href="/register" className="btn-primary text-body-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
        <div className="max-w-7xl w-full">
          <div className="text-center animate-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-glass backdrop-blur-glass border border-surface-borderGlow mb-8"
            >
              <Zap className="w-4 h-4 text-primary-glow animate-pulse" />
              <span className="text-body-sm text-text-secondary">
                Version 1.0 • Demo Mode Active
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-display text-display-xl md:text-display-lg lg:text-display-xl mb-6 text-balance"
            >
              <span className="block">Experience</span>
              <span className="block gradient-text">Ludo</span>
              <span className="block">Like Never Before</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-10 text-balance"
            >
              Futuristic cyber-gaming interface meets classic Ludo strategy.
              Real-time multiplayer, AI opponents, tournaments, and a premium
              wallet system — all in one stunning platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link
                href="/register"
                className="btn-primary px-10 py-4 text-body-lg group"
              >
                <Play className="w-5 h-5" />
                <span>Start Playing Free</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#game-modes"
                className="btn-secondary px-10 py-4 text-body-lg"
              >
                Explore Game Modes
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-8 text-body-sm text-text-muted"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-glow" />
                <span>Secure & Fair Play</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent-cyan" />
                <span>Cross-Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-secondary-glow" />
                <span>Demo Coins Only</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-green" />
                <span>Skill-Based Matchmaking</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-body-sm text-primary-glow font-medium uppercase tracking-wider">
              Features
            </span>
            <h2 className="font-display text-display-md mt-2 mb-4 gradient-text">
              Built for Champions
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Every feature crafted for competitive play, stunning visuals, and
              seamless experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card-hover group p-8 h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-glow/20 to-accent-magenta/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-glow" />
                </div>
                <h3 className="font-display text-heading-md mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-body mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-body-sm text-text-muted"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-glow" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section id="game-modes" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-body-sm text-secondary-glow font-medium uppercase tracking-wider">
              Game Modes
            </span>
            <h2 className="font-display text-display-md mt-2 mb-4 gradient-text-gold">
              Choose Your Battle
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              From casual AI practice to high-stakes tournaments — find your
              perfect match.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card-hover group relative overflow-hidden p-0 h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/5 via-transparent to-accent-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-caption font-medium bg-surface-tertiary text-text-secondary">
                      {mode.players}
                    </span>
                    <span className="px-3 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow">
                      {mode.difficulty}
                    </span>
                  </div>

                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <mode.icon className="w-20 h-20 text-primary-glow opacity-80 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary-glow/30 animate-pulse-glow" />
                  </div>

                  <h3 className="font-display text-heading-lg text-center mb-2">
                    {mode.title}
                  </h3>
                  <p className="text-text-secondary text-center text-body mb-6 flex-1">
                    {mode.description}
                  </p>

                  <div className="space-y-3 mb-6 border-t border-surface-border pt-6">
                    {mode.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-body-sm text-text-muted"
                      >
                        <span className="w-5 h-5 rounded-lg bg-surface-tertiary flex items-center justify-center text-primary-glow">
                          <Check className="w-3 h-3" />
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/game-modes/${mode.id}`}
                    className="btn-primary w-full justify-center group-hover:scale-[1.02] transition-transform"
                  >
                    Play Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-body-sm text-accent-cyan font-medium uppercase tracking-wider">
              Technology
            </span>
            <h2 className="font-display text-display-md mt-2 mb-4 gradient-text">
              Engineered for Excellence
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Modern stack, real-time architecture, and server-authoritative
              game logic.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card-hover p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-glow/20 to-accent-magenta/20 flex items-center justify-center">
                  <tech.icon className="w-8 h-8 text-primary-glow" />
                </div>
                <h3 className="font-display text-heading-sm mb-2">
                  {tech.title}
                </h3>
                <p className="text-text-secondary text-body-sm">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div className="glass-panel-strong p-12 md:p-16 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-30" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-glow via-accent-magenta to-secondary-glow" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="font-display text-display-md mb-4 gradient-text">
                Ready to Play?
              </h2>
              <p className="text-body-lg text-text-secondary mb-8 max-w-xl mx-auto">
                Join thousands of players in the most advanced Ludo experience
                ever built. Free to play, forever fair.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="btn-primary px-10 py-4 text-body-lg group"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#game-modes"
                  className="btn-ghost px-10 py-4 text-body-lg border border-surface-borderGlow"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
                  <Dice1 className="w-6 h-6 text-text-inverse" />
                </div>
                <span className="font-display text-heading-md gradient-text">
                  Ludo Nexus
                </span>
              </Link>
              <p className="text-text-muted text-body-sm">
                Futuristic Ludo gaming platform with real-time multiplayer,
                tournaments, and AI opponents.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-4">Game</h4>
              <ul className="space-y-2 text-body-sm text-text-secondary">
                <li>
                  <Link
                    href="/game-modes/vs-ai"
                    className="hover:text-primary-glow transition-colors"
                  >
                    vs AI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/game-modes/vs-human"
                    className="hover:text-primary-glow transition-colors"
                  >
                    vs Human
                  </Link>
                </li>
                <li>
                  <Link
                    href="/game-modes/tournament"
                    className="hover:text-primary-glow transition-colors"
                  >
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/game-modes/team"
                    className="hover:text-primary-glow transition-colors"
                  >
                    Team Match
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-4">Resources</h4>
              <ul className="space-y-2 text-body-sm text-text-secondary">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-primary-glow transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary-glow transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary-glow transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/responsible-gaming"
                    className="hover:text-primary-glow transition-colors"
                  >
                    Responsible Gaming
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-4">Legal</h4>
              <p className="text-body-sm text-text-muted mb-4">
                Demo mode only. No real money gambling. All balances shown as
                "Demo Coins".
              </p>
              <p className="text-body-xs text-text-muted">
                Must be 18+ to play. Play responsibly.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-body-sm text-text-muted">
              © 2024 Ludo Nexus. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-text-muted hover:text-primary-glow transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-primary-glow transition-colors"
                aria-label="Discord"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.38-.444.864-.608 1.25a18.27 18.27 0 0 0-5.067 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.084.084 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.007-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.645.77 1.253 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.417-4.514-.392-9.014-3.547-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-primary-glow transition-colors"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Data
const features = [
  {
    title: "Real-Time Multiplayer",
    icon: Users,
    description:
      "Play instantly with friends or matchmake globally with sub-100ms latency.",
    details: [
      "WebSocket-powered real-time sync",
      "Skill-based matchmaking (ELO)",
      "Reconnection with state recovery",
      "Spectator mode support",
    ],
  },
  {
    title: "Advanced AI Opponents",
    icon: Brain,
    description:
      "Three difficulty levels with human-like decision making and strategy.",
    details: [
      "Easy: Learning the basics",
      "Medium: Tactical captures & safety",
      "Hard: Risk assessment & blocking",
      "Offline practice mode",
    ],
  },
  {
    title: "Tournament System",
    icon: Trophy,
    description:
      "Knockout & scheduled tournaments with brackets, prizes, and leaderboards.",
    details: [
      "Automated bracket generation",
      "Check-in & walkover handling",
      "Prize pool distribution",
      "Tournament history & stats",
    ],
  },
  {
    title: "Premium Wallet",
    icon: Shield,
    description:
      "Demo coin system with double-entry ledger, deposits, withdrawals & audit trail.",
    details: [
      "Server-authoritative balances",
      "Immutable transaction log",
      "Mock payment sandbox",
      "Responsible gaming limits",
    ],
  },
  {
    title: "Social Features",
    icon: Globe,
    description: "Friends, chat, invites, and team play built for community.",
    details: [
      "Friend requests & online status",
      "Global, match & private chat",
      "Team 2v2 mode with partner invite",
      "Invite links & QR codes",
    ],
  },
  {
    title: "Cross-Platform PWA",
    icon: Smartphone,
    description:
      "Installable on mobile, tablet, desktop — same experience everywhere.",
    details: [
      "Responsive: 320px to 4K+",
      "Offline-capable with service worker",
      "Native app feel on all devices",
      "Touch & mouse optimized",
    ],
  },
];

// Game Modes Data
const gameModes = [
  {
    id: "vs-ai",
    title: "Practice vs AI",
    icon: Brain,
    players: "1 Player + Bots",
    difficulty: "Easy • Medium • Hard",
    description:
      "Perfect your strategy against intelligent bots. Pause, resume, and learn at your own pace.",
    features: [
      "3 difficulty levels",
      "Offline play supported",
      "Local statistics tracking",
      "No entry fee",
      "Instant start",
    ],
  },
  {
    id: "vs-human",
    title: "Quick Match",
    icon: Users,
    players: "2-4 Players",
    difficulty: "Skill-Based",
    description:
      "Enter the queue and get matched with players of similar skill. Fair, fast, competitive.",
    features: [
      "ELO-based matchmaking",
      "~30 second avg wait",
      "Demo coin entry fees",
      "Real-time chat",
      "Replay system",
    ],
  },
  {
    id: "group",
    title: "Private Room",
    icon: Target,
    players: "2-4 Players",
    difficulty: "Custom Rules",
    description:
      "Create your own room with custom rules, invite friends, and play on your terms.",
    features: [
      "Public or private rooms",
      "Custom game rules",
      "Password protection",
      "Spectator slots",
      "Bot fill option",
    ],
  },
  {
    id: "tournament",
    title: "Tournaments",
    icon: Trophy,
    players: "8-256 Players",
    difficulty: "Knockout Bracket",
    description:
      "Compete in scheduled tournaments for glory and massive demo coin prizes.",
    features: [
      "Automated brackets",
      "Registration & check-in",
      "Prize pool distribution",
      "Spectator viewing",
      "Winner showcase",
    ],
  },
  {
    id: "team",
    title: "Team Battle 2v2",
    icon: Users,
    players: "2v2 Teams",
    difficulty: "Partner Strategy",
    description:
      "Partner with a friend or get matched. Coordinate captures and defend together.",
    features: [
      "Invite partner or random",
      "Team chat channel",
      "Shared victory condition",
      "Team leaderboards",
      "Rematch option",
    ],
  },
  {
    id: "private",
    title: "Private Match",
    icon: Shield,
    players: "2-4 Friends",
    difficulty: "Invite Only",
    description:
      "Exclusive matches with secure invite links. No strangers, just your circle.",
    features: [
      "Secure invite links",
      "QR code sharing",
      "Invite expiration",
      "Host controls",
      "Rematch button",
    ],
  },
];

// Tech Stack Data
const techStack = [
  {
    title: "Next.js 15 + React 18",
    icon: Monitor,
    description:
      "App Router, Server Components, and edge-ready for global performance.",
  },
  {
    title: "NestJS + TypeScript",
    icon: Brain,
    description:
      "Modular backend with dependency injection, WebSockets, and type safety.",
  },
  {
    title: "PostgreSQL + Prisma",
    icon: Shield,
    description:
      "ACID-compliant database with type-safe ORM and migration system.",
  },
  {
    title: "Socket.IO + Redis",
    icon: Zap,
    description:
      "Real-time multiplayer with horizontal scaling and pub/sub architecture.",
  },
];

// Import Check icon
import { Check } from "lucide-react";
