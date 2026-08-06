'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  Swords,
  Send,
  Search,
  Globe,
  Circle,
  ArrowLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Hash,
} from 'lucide-react';

type ChatTab = 'global' | 'friends' | 'match';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  type: 'global' | 'dm' | 'group' | 'match';
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

const conversationsByTab: Record<ChatTab, Conversation[]> = {
  global: [
    {
      id: 'global',
      name: 'Global Chat',
      avatar: 'GC',
      lastMessage: 'Anyone up for a quick match?',
      timestamp: '2m',
      unread: 5,
      online: true,
      type: 'global',
    },
    {
      id: 'lounge',
      name: 'Gaming Lounge',
      avatar: 'GL',
      lastMessage: 'New tournament starting soon!',
      timestamp: '15m',
      unread: 0,
      online: true,
      type: 'group',
    },
    {
      id: 'trading',
      name: 'Token Trading',
      avatar: 'TT',
      lastMessage: 'Selling 500 coins for cheap',
      timestamp: '1h',
      unread: 2,
      online: false,
      type: 'group',
    },
  ],
  friends: [
    {
      id: 'p2',
      name: 'PlayerTwo',
      avatar: 'P2',
      lastMessage: 'GG! That was intense 🔥',
      timestamp: '5m',
      unread: 2,
      online: true,
      type: 'dm',
    },
    {
      id: 'p3',
      name: 'PlayerThree',
      avatar: 'P3',
      lastMessage: 'Ready for another round?',
      timestamp: '20m',
      unread: 0,
      online: true,
      type: 'dm',
    },
    {
      id: 'p4',
      name: 'PlayerFour',
      avatar: 'P4',
      lastMessage: 'See you tomorrow',
      timestamp: '2h',
      unread: 0,
      online: false,
      type: 'dm',
    },
    {
      id: 'p5',
      name: 'PlayerFive',
      avatar: 'P5',
      lastMessage: 'Nice move with the 6!',
      timestamp: '5h',
      unread: 0,
      online: false,
      type: 'dm',
    },
  ],
  match: [
    {
      id: 'match1',
      name: 'Match #XK7M2P',
      avatar: 'M1',
      lastMessage: 'Good game everyone!',
      timestamp: '1h',
      unread: 0,
      online: true,
      type: 'match',
    },
    {
      id: 'match2',
      name: 'Match #Q9RT4B',
      avatar: 'M2',
      lastMessage: 'Rematch anyone?',
      timestamp: '3h',
      unread: 0,
      online: false,
      type: 'match',
    },
  ],
};

const mockMessages: Record<string, Message[]> = {
  global: [
    { id: '1', senderId: 'p2', senderName: 'PlayerTwo', avatar: 'P2', content: 'Anyone up for a quick match?', timestamp: '10:30 AM', isMe: false },
    { id: '2', senderId: 'me', senderName: 'You', avatar: 'P1', content: 'I\'m in! Let me create a room', timestamp: '10:31 AM', isMe: true },
    { id: '3', senderId: 'p3', senderName: 'PlayerThree', avatar: 'P3', content: 'Count me in too 🎮', timestamp: '10:32 AM', isMe: false },
    { id: '4', senderId: 'p4', senderName: 'PlayerFour', avatar: 'P4', content: 'What\'s the entry fee?', timestamp: '10:33 AM', isMe: false },
    { id: '5', senderId: 'me', senderName: 'You', avatar: 'P1', content: '100 coins, classic mode', timestamp: '10:33 AM', isMe: true },
    { id: '6', senderId: 'p2', senderName: 'PlayerTwo', avatar: 'P2', content: 'Perfect, sending the code now', timestamp: '10:34 AM', isMe: false },
  ],
  p2: [
    { id: '1', senderId: 'p2', senderName: 'PlayerTwo', avatar: 'P2', content: 'GG! That was intense 🔥', timestamp: '10:25 AM', isMe: false },
    { id: '2', senderId: 'me', senderName: 'You', avatar: 'P1', content: 'Yeah! That last roll was clutch', timestamp: '10:26 AM', isMe: true },
    { id: '3', senderId: 'p2', senderName: 'PlayerTwo', avatar: 'P2', content: 'I almost had you with the capture', timestamp: '10:27 AM', isMe: false },
    { id: '4', senderId: 'me', senderName: 'You', avatar: 'P1', content: 'Lucky I rolled a 6 to escape 😅', timestamp: '10:28 AM', isMe: true },
  ],
};

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<ChatTab>('global');
  const [selectedConversation, setSelectedConversation] = useState<string>('global');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = conversationsByTab[activeTab];
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find((c) => c.id === selectedConversation) || conversations[0];
  const currentMessages = messages[selectedConversation] || [
    { id: '0', senderId: 'system', senderName: 'System', avatar: 'SY', content: 'No messages yet. Start the conversation!', timestamp: 'Now', isMe: false },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      avatar: 'P1',
      content: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }));
    setMessageInput('');
  };

  const handleTabChange = (tab: ChatTab) => {
    setActiveTab(tab);
    setSelectedConversation(conversationsByTab[tab][0].id);
  };

  const tabs: { id: ChatTab; label: string; icon: typeof Globe; count: number }[] = [
    { id: 'global', label: 'Global', icon: Globe, count: conversationsByTab.global.reduce((a, c) => a + c.unread, 0) },
    { id: 'friends', label: 'Friends', icon: Users, count: conversationsByTab.friends.reduce((a, c) => a + c.unread, 0) },
    { id: 'match', label: 'Match', icon: Swords, count: conversationsByTab.match.reduce((a, c) => a + c.unread, 0) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Chat</h1>
          <p className="text-text-secondary mt-1">Stay connected with players and friends</p>
        </div>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        {/* Tabs */}
        <div className="border-b border-surface-border">
          <nav className="flex" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center gap-2 px-6 py-4 text-body-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary-glow bg-primary-glow/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-caption font-medium bg-accent-red text-white">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-glow"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Chat Body */}
        <div className="flex h-[600px]">
          {/* Sidebar - Conversations */}
          <div className="w-72 border-r border-surface-border flex flex-col hidden md:flex">
            {/* Search */}
            <div className="p-4 border-b border-surface-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 py-2 text-body-sm"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {filteredConversations.map((conv, index) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 flex items-center gap-3 text-left transition-all border-b border-surface-border/50 ${
                    selectedConversation === conv.id
                      ? 'bg-primary-glow/10 border-l-2 border-l-primary-glow'
                      : 'hover:bg-surface-tertiary'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-sm text-text-inverse">
                      {conv.avatar}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background-DEFAULT ${
                        conv.online ? 'bg-accent-green' : 'bg-text-muted'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-body-sm text-text-primary truncate">
                        {conv.name}
                      </span>
                      <span className="text-caption text-text-muted flex-shrink-0">{conv.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-body-sm text-text-secondary truncate">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-caption font-medium bg-accent-red text-white flex-shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message View */}
          <div className="flex-1 flex flex-col">
            {/* Conversation Header */}
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="md:hidden btn-ghost p-2 rounded-lg">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-sm text-text-inverse">
                    {currentConversation?.avatar}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background-DEFAULT ${
                      currentConversation?.online ? 'bg-accent-green' : 'bg-text-muted'
                    }`}
                  />
                </div>
                <div>
                  <div className="font-medium text-text-primary flex items-center gap-2">
                    {currentConversation?.type === 'global' && <Hash className="w-3.5 h-3.5 text-text-muted" />}
                    {currentConversation?.name}
                  </div>
                  <div className="text-caption text-text-muted flex items-center gap-1">
                    <Circle className={`w-2 h-2 ${currentConversation?.online ? 'text-accent-green fill-current' : 'text-text-muted fill-current'}`} />
                    {currentConversation?.online ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <button className="btn-ghost p-2 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
              {currentMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-xs text-text-inverse flex-shrink-0">
                    {msg.avatar}
                  </div>
                  <div className={`max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!msg.isMe && (
                      <span className="text-caption text-text-muted mb-1 px-1">{msg.senderName}</span>
                    )}
                    <div
                      className={`glass-card px-4 py-3 rounded-2xl ${
                        msg.isMe
                          ? 'bg-primary-glow/15 border-primary-glow/30 rounded-tr-sm'
                          : 'rounded-tl-sm'
                      }`}
                    >
                      <p className="text-body-sm text-text-primary">{msg.content}</p>
                    </div>
                    <span className="text-caption text-text-muted mt-1 px-1">{msg.timestamp}</span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-surface-border">
              <div className="flex items-center gap-2 glass-card rounded-xl p-2">
                <button className="btn-ghost p-2 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="btn-ghost p-2 rounded-lg">
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none px-2"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
                  className="btn-primary p-2.5 rounded-lg disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}