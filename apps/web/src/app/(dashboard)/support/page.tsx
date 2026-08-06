'use client';

import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, ChevronDown, Send, FileText, Shield, Gamepad2, Wallet, Trophy, Lock, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    id: '1',
    category: 'Gameplay',
    question: 'How do I move my tokens in the game?',
    answer: 'Tap on a token to select it, then tap the dice to roll. The selected token will move automatically based on the dice value. You need a 6 to move a token out of the starting area. Landing on an opponent\'s token sends them back to start.',
  },
  {
    id: '2',
    category: 'Account',
    question: 'How do I change my username or password?',
    answer: 'Go to Settings > Profile to update your username. For password changes, go to Settings > Security. You\'ll need to verify your email before the change takes effect. Usernames can only be changed once every 30 days.',
  },
  {
    id: '3',
    category: 'Wallet',
    question: 'How do I deposit or withdraw coins?',
    answer: 'Navigate to the Wallet page and click "Deposit" to add coins via supported payment methods. For withdrawals, click "Withdraw" and enter your preferred payout method. Withdrawals are processed within 24-48 hours and may require KYC verification for large amounts.',
  },
  {
    id: '4',
    category: 'Tournaments',
    question: 'How do tournament registrations and prizes work?',
    answer: 'Browse available tournaments on the Tournaments page. Click "Register" and pay the entry fee if applicable. You must check in before the tournament starts. Prize pools are distributed based on your final placement. Tournament winnings are credited to your wallet within 1 hour of completion.',
  },
  {
    id: '5',
    category: 'Fair Play',
    question: 'What happens if someone cheats or disconnects?',
    answer: 'We take fair play seriously. If a player disconnects mid-game, the match continues and the disconnected player forfeits their turns. Repeated disconnections may result in penalties. Report cheating via the in-game report button or through this support page. Our team reviews all reports within 48 hours.',
  },
  {
    id: '6',
    category: 'Technical',
    question: 'The game is lagging or won\'t load. What should I do?',
    answer: 'Try refreshing the page first. If the issue persists, clear your browser cache and cookies, then restart your browser. Ensure you have a stable internet connection. If problems continue, try a different browser or device. You can also report the issue using the contact form below with details about your device and browser.',
  },
];

const mockTickets = [
  { id: 'TK-4821', subject: 'Unable to withdraw coins', status: 'open', priority: 'high', created: '2 days ago', lastUpdate: '5 hours ago' },
  { id: 'TK-4798', subject: 'Tournament registration issue', status: 'in_progress', priority: 'medium', created: '5 days ago', lastUpdate: '1 day ago' },
  { id: 'TK-4755', subject: 'Friend request not showing', status: 'resolved', priority: 'low', created: '1 week ago', lastUpdate: '5 days ago' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | null>('1');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('gameplay');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setMessage('');
    }, 3000);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { color: 'text-primary-glow', bg: 'bg-primary-glow/20', label: 'Open' };
      case 'in_progress': return { color: 'text-secondary-glow', bg: 'bg-secondary-glow/20', label: 'In Progress' };
      case 'resolved': return { color: 'text-accent-green', bg: 'bg-accent-green/20', label: 'Resolved' };
      default: return { color: 'text-text-muted', bg: 'bg-surface-tertiary', label: status };
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Gameplay': return Gamepad2;
      case 'Account': return Shield;
      case 'Wallet': return Wallet;
      case 'Tournaments': return Trophy;
      case 'Fair Play': return Lock;
      case 'Technical': return HelpCircle;
      default: return HelpCircle;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-display-md gradient-text">Support</h1>
        <p className="text-text-secondary mt-1">Get help, find answers, and contact our team</p>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-surface-border">
          <h2 className="font-display text-heading-lg text-text-primary flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary-glow" />
            Frequently Asked Questions
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {faqs.map((faq, index) => {
            const CatIcon = getCategoryIcon(faq.category);
            const isOpen = openFaq === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 flex items-center gap-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center flex-shrink-0">
                    <CatIcon className="w-5 h-5 text-primary-glow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-caption text-text-muted mb-0.5">{faq.category}</div>
                    <div className="font-medium text-text-primary">{faq.question}</div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-4 pb-4"
                  >
                    <div className="pl-14 text-body text-text-secondary border-l-2 border-primary-glow/20 ml-4 pl-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Contact Form & Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-strong rounded-2xl p-6"
        >
          <h2 className="font-display text-heading-lg text-text-primary flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-primary-glow" />
            Contact Support
          </h2>
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-green/20 flex items-center justify-center">
                <Send className="w-8 h-8 text-accent-green" />
              </div>
              <h3 className="font-display text-heading-md text-text-primary mb-2">Message Sent!</h3>
              <p className="text-text-secondary text-body">We&apos;ll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe your issue"
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input w-full"
                >
                  <option value="gameplay">Gameplay</option>
                  <option value="account">Account</option>
                  <option value="wallet">Wallet</option>
                  <option value="tournaments">Tournaments</option>
                  <option value="fair_play">Fair Play</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  className="input w-full resize-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </motion.div>

        {/* Support Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card-strong rounded-2xl p-6"
        >
          <h2 className="font-display text-heading-lg text-text-primary mb-6">Your Support Tickets</h2>
          <div className="space-y-3">
            {mockTickets.map((ticket, index) => {
              const status = getStatusConfig(ticket.status);
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="glass-card-hover p-4 rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0">
                      <div className="text-caption text-text-muted">{ticket.id}</div>
                      <div className="font-medium text-text-primary truncate">{ticket.subject}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-caption font-medium ${status.bg} ${status.color} flex-shrink-0`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-caption text-text-muted">
                    <span>Priority: <span className={ticket.priority === 'high' ? 'text-accent-red' : ticket.priority === 'medium' ? 'text-secondary-glow' : 'text-accent-green'}>{ticket.priority}</span></span>
                    <span>Created: {ticket.created}</span>
                    <span>Last update: {ticket.lastUpdate}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Policy Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong rounded-2xl p-6"
      >
        <h2 className="font-display text-heading-md text-text-primary mb-4">Policies & Resources</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Terms of Service', icon: FileText },
            { label: 'Privacy Policy', icon: Shield },
            { label: 'Responsible Gaming', icon: Gamepad2 },
            { label: 'Fair Play Policy', icon: Lock },
          ].map((link) => (
            <button
              key={link.label}
              className="glass-card-hover p-4 rounded-2xl flex items-center gap-3 text-left hover:text-primary-glow transition-all"
            >
              <link.icon className="w-5 h-5 text-text-muted flex-shrink-0" />
              <span className="text-body-sm font-medium text-text-primary flex-1">{link.label}</span>
              <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}