// ============================================
// Admin API Client
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAdmin<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('admin_token') 
    : '';
  
  const response = await fetch(`${API_BASE}/admin${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Dashboard
export async function getDashboardStats() {
  return fetchAdmin('/dashboard');
}

// Users
export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  kycStatus?: string;
  status?: string;
}

export async function getUsers(filters: UserFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.search) params.set('search', filters.search);
  if (filters.kycStatus) params.set('kycStatus', filters.kycStatus);
  if (filters.status) params.set('status', filters.status);
  
  return fetchAdmin(`/users?${params.toString()}`);
}

export async function getUserById(userId: string) {
  return fetchAdmin(`/users/${userId}`);
}

export async function banUser(userId: string, reason: string) {
  return fetchAdmin(`/users/${userId}/ban`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function unbanUser(userId: string) {
  return fetchAdmin(`/users/${userId}/unban`, {
    method: 'POST',
  });
}

// Matches
export interface MatchFilters {
  page?: number;
  limit?: number;
  status?: string;
  mode?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getMatches(filters: MatchFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.status) params.set('status', filters.status);
  if (filters.mode) params.set('mode', filters.mode);
  if (filters.userId) params.set('userId', filters.userId);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  
  return fetchAdmin(`/matches?${params.toString()}`);
}

export async function getMatchReplay(matchId: string) {
  return fetchAdmin(`/matches/${matchId}/replay`);
}

// Tournaments
export interface TournamentFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export async function getTournaments(filters: TournamentFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.status) params.set('status', filters.status);
  
  return fetchAdmin(`/tournaments?${params.toString()}`);
}

export async function createTournament(data: any) {
  return fetchAdmin('/tournaments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Transactions
export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getTransactions(filters: TransactionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.type) params.set('type', filters.type);
  if (filters.status) params.set('status', filters.status);
  if (filters.userId) params.set('userId', filters.userId);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  
  return fetchAdmin(`/transactions?${params.toString()}`);
}

// Withdrawals
export interface WithdrawalFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export async function getWithdrawals(filters: WithdrawalFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.status) params.set('status', filters.status);
  
  return fetchAdmin(`/withdrawals?${params.toString()}`);
}

export async function approveWithdrawal(withdrawalId: string) {
  return fetchAdmin(`/withdrawals/${withdrawalId}/approve`, {
    method: 'POST',
  });
}

export async function rejectWithdrawal(withdrawalId: string, reason: string) {
  return fetchAdmin(`/withdrawals/${withdrawalId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

// KYC
export async function getPendingKYC(page = 1, limit = 20) {
  return fetchAdmin(`/kyc/pending?page=${page}&limit=${limit}`);
}

export async function reviewKYC(
  kycId: string,
  action: 'approve' | 'reject',
  rejectionReason?: string
) {
  return fetchAdmin(`/kyc/${kycId}/review`, {
    method: 'POST',
    body: JSON.stringify({ action, rejectionReason }),
  });
}

export async function requestAdditionalInfo(kycId: string, message: string) {
  return fetchAdmin(`/kyc/${kycId}/additional-info`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

// Fraud Alerts
export interface FraudAlertFilters {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  type?: string;
}

export async function getFraudAlerts(filters: FraudAlertFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.status) params.set('status', filters.status);
  if (filters.severity) params.set('severity', filters.severity);
  if (filters.type) params.set('type', filters.type);
  
  return fetchAdmin(`/fraud-alerts?${params.toString()}`);
}

export async function updateFraudAlert(
  alertId: string,
  data: { status?: string; assignedToId?: string }
) {
  return fetchAdmin(`/fraud-alerts/${alertId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Settings
export async function getGameSettings(category?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  return fetchAdmin(`/settings?${params.toString()}`);
}

export async function updateGameSettings(settings: Array<{ key: string; value: any }>) {
  return fetchAdmin('/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  });
}

// Audit Logs
export interface AuditLogFilters {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
}

export async function getAuditLogs(filters: AuditLogFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.adminId) params.set('adminId', filters.adminId);
  if (filters.action) params.set('action', filters.action);
  
  return fetchAdmin(`/audit-logs?${params.toString()}`);
}