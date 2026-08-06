// ============================================
// @ludo-nexus/api-client - Admin Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';

export function useAdminQueries() {
  const dashboard = useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => apiClient.getDashboardStats(),
    refetchInterval: 60000,
  });

  const users = (filters?: any, page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.admin.users(filters, page, limit),
    queryFn: () => apiClient.getUsers(filters, page, limit),
  });

  const user = (userId: string) => useQuery({
    queryKey: queryKeys.admin.user(userId),
    queryFn: () => apiClient.getUser(userId),
    enabled: !!userId,
  });

  const matches = (filters?: any, page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.admin.matches(filters, page, limit),
    queryFn: () => apiClient.getMatches(filters, page, limit),
  });

  const matchReplay = (matchId: string) => useQuery({
    queryKey: queryKeys.admin.matchReplay(matchId),
    queryFn: () => apiClient.getAdminMatchReplay(matchId),
    enabled: !!matchId,
  });

  const tournaments = (filters?: any, page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.admin.tournaments(filters, page, limit),
    queryFn: () => apiClient.getAdminTournaments(filters, page, limit),
  });

  const transactions = (filters?: any, page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.admin.transactions(filters, page, limit),
    queryFn: () => apiClient.getAdminTransactions(filters, page, limit),
  });

  const withdrawals = (filters?: any, page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.admin.withdrawals(filters, page, limit),
    queryFn: () => apiClient.getAdminWithdrawals(filters, page, limit),
  });

  const pendingKyc = (page = 1, limit = 20) => useQuery({
    queryKey: queryKeys.admin.pendingKyc(page, limit),
    queryFn: () => apiClient.getPendingKyc(page, limit),
  });

  const fraudAlerts = (filters?: any, page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.admin.fraudAlerts(filters, page, limit),
    queryFn: () => apiClient.getFraudAlerts(filters, page, limit),
  });

  const settings = (category?: string) => useQuery({
    queryKey: queryKeys.admin.settings(category),
    queryFn: () => apiClient.getGameSettings(category),
  });

  const auditLogs = (filters?: any, page = 1, limit = 100) => useQuery({
    queryKey: queryKeys.admin.auditLogs(filters, page, limit),
    queryFn: () => apiClient.getAuditLogs(filters, page, limit),
  });

  return { 
    dashboard, users, user, matches, matchReplay, 
    tournaments, transactions, withdrawals, 
    pendingKyc, fraudAlerts, settings, auditLogs 
  };
}

export function useAdminMutations() {
  const queryClient = useQueryClient();

  const banUser = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => 
      apiClient.banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const unbanUser = useMutation({
    mutationFn: (userId: string) => apiClient.unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const createTournament = useMutation({
    mutationFn: (data: any) => apiClient.createAdminTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments'] });
    },
  });

  const approveWithdrawal = useMutation({
    mutationFn: (withdrawalId: string) => apiClient.approveWithdrawal(withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    },
  });

  const rejectWithdrawal = useMutation({
    mutationFn: ({ withdrawalId, reason }: { withdrawalId: string; reason: string }) => 
      apiClient.rejectWithdrawal(withdrawalId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    },
  });

  const reviewKyc = useMutation({
    mutationFn: ({ kycId, action, rejectionReason }: { kycId: string; action: 'approve' | 'reject'; rejectionReason?: string }) => 
      apiClient.reviewKyc(kycId, action, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingKyc'] });
    },
  });

  const updateFraudAlert = useMutation({
    mutationFn: ({ alertId, data }: { alertId: string; data: any }) => 
      apiClient.updateFraudAlert(alertId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'fraudAlerts'] });
    },
  });

  const updateSettings = useMutation({
    mutationFn: (settings: Array<{ key: string; value: any }>) => 
      apiClient.updateGameSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });

  return { 
    banUser, unbanUser, createTournament, 
    approveWithdrawal, rejectWithdrawal, 
    reviewKyc, updateFraudAlert, updateSettings 
  };
}