// ============================================
// @ludo-nexus/api-client - Query Client & Keys
// ============================================

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  // Auth
  auth: {
    profile: () => ['auth', 'profile'] as const,
    sessions: () => ['auth', 'sessions'] as const,
  },
  
  // User
  user: {
    profile: (userId?: string) => ['user', 'profile', userId ?? 'me'] as const,
    stats: (userId?: string) => ['user', 'stats', userId ?? 'me'] as const,
    matchHistory: (page: number, limit: number) => ['user', 'matchHistory', page, limit] as const,
    achievements: (userId?: string) => ['user', 'achievements', userId ?? 'me'] as const,
    allAchievements: () => ['user', 'achievements', 'all'] as const,
    kyc: (userId?: string) => ['user', 'kyc', userId ?? 'me'] as const,
  },
  
  // Game
  game: {
    match: (matchId: string) => ['game', 'match', matchId] as const,
    matchState: (matchId: string) => ['game', 'matchState', matchId] as const,
    matches: (page: number, limit: number) => ['game', 'matches', page, limit] as const,
  },
  
  // Matchmaking
  matchmaking: {
    status: () => ['matchmaking', 'status'] as const,
    queue: () => ['matchmaking', 'queue'] as const,
    history: (page: number, limit: number) => ['matchmaking', 'history', page, limit] as const,
    replay: (matchId: string) => ['matchmaking', 'replay', matchId] as const,
    live: () => ['matchmaking', 'live'] as const,
  },
  
  // Room
  room: {
    detail: (roomId: string) => ['room', 'detail', roomId] as const,
    byCode: (code: string) => ['room', 'byCode', code] as const,
    public: (page: number, limit: number) => ['room', 'public', page, limit] as const,
  },
  
  // Tournament
  tournament: {
    list: (status?: string, page: number = 1, limit: number = 20) => 
      ['tournament', 'list', status, page, limit] as const,
    detail: (tournamentId: string) => ['tournament', 'detail', tournamentId] as const,
    bracket: (tournamentId: string) => ['tournament', 'bracket', tournamentId] as const,
  },
  
  // Wallet
  wallet: {
    balance: () => ['wallet', 'balance'] as const,
    demoBalance: () => ['wallet', 'demoBalance'] as const,
    transactions: (filters?: any, page: number = 1, limit: number = 20) => 
      ['wallet', 'transactions', filters, page, limit] as const,
    transaction: (transactionId: string) => ['wallet', 'transaction', transactionId] as const,
    withdrawals: (page: number = 1, limit: number = 20) => 
      ['wallet', 'withdrawals', page, limit] as const,
    withdrawal: (withdrawalId: string) => ['wallet', 'withdrawal', withdrawalId] as const,
  },
  
  // Friends
  friends: {
    list: (page: number = 1, limit: number = 50) => ['friends', 'list', page, limit] as const,
    requests: (type: 'received' | 'sent' = 'received') => ['friends', 'requests', type] as const,
    blocked: () => ['friends', 'blocked'] as const,
    search: (query: string, limit: number = 20) => ['friends', 'search', query, limit] as const,
  },
  
  // Chat
  chat: {
    conversations: (page: number = 1, limit: number = 20) => ['chat', 'conversations', page, limit] as const,
    conversation: (conversationId: string) => ['chat', 'conversation', conversationId] as const,
    messages: (conversationId: string, before?: string, limit: number = 50) => 
      ['chat', 'messages', conversationId, before, limit] as const,
    global: (page: number = 1, limit: number = 50) => ['chat', 'global', page, limit] as const,
  },
  
  // Admin
  admin: {
    dashboard: () => ['admin', 'dashboard'] as const,
    users: (filters?: any, page: number = 1, limit: number = 50) => 
      ['admin', 'users', filters, page, limit] as const,
    user: (userId: string) => ['admin', 'user', userId] as const,
    matches: (filters?: any, page: number = 1, limit: number = 50) => 
      ['admin', 'matches', filters, page, limit] as const,
    matchReplay: (matchId: string) => ['admin', 'matchReplay', matchId] as const,
    tournaments: (filters?: any, page: number = 1, limit: number = 50) => 
      ['admin', 'tournaments', filters, page, limit] as const,
    transactions: (filters?: any, page: number = 1, limit: number = 50) => 
      ['admin', 'transactions', filters, page, limit] as const,
    withdrawals: (filters?: any, page: number = 1, limit: number = 50) => 
      ['admin', 'withdrawals', filters, page, limit] as const,
    pendingKyc: (page: number = 1, limit: number = 20) => 
      ['admin', 'pendingKyc', page, limit] as const,
    fraudAlerts: (filters?: any, page: number = 1, limit: number = 50) => 
      ['admin', 'fraudAlerts', filters, page, limit] as const,
    settings: (category?: string) => ['admin', 'settings', category] as const,
    auditLogs: (filters?: any, page: number = 1, limit: number = 100) => 
      ['admin', 'auditLogs', filters, page, limit] as const,
  },
};