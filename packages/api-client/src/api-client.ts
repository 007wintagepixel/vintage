// ============================================
// @ludo-nexus/api-client - API Client
// ============================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import type { ApiResponse, UUID } from '@ludo-nexus/shared-types';

const API_BASE_URL = typeof window !== 'undefined' 
  ? (window.location.origin.includes('localhost') ? 'http://localhost:3001' : '/api')
  : process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor for auth
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      config.headers['X-Request-ID'] = crypto.randomUUID();
      return config;
    });

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true;
          
          try {
            await this.refreshAccessToken();
            if (this.accessToken) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            }
            return this.client(originalRequest);
          } catch {
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  getAccessToken() {
    return this.accessToken;
  }

  async refreshAccessToken() {
    if (!this.refreshToken) throw new Error('No refresh token');
    
    const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${API_BASE_URL}/api/auth/refresh`,
      { refreshToken: this.refreshToken },
      { withCredentials: true }
    );
    
    const { accessToken, refreshToken } = response.data.data!;
    this.setTokens(accessToken, refreshToken);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Auth endpoints
  async register(data: any) {
    return this.post('/api/auth/register', data);
  }

  async login(data: any) {
    const response = await this.post('/api/auth/login', data);
    if (response.data?.accessToken && response.data?.refreshToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  }

  async verifyOtp(data: any) {
    return this.post('/api/auth/verify-otp', data);
  }

  async resendOtp(data: any) {
    return this.post('/api/auth/resend-otp', data);
  }

  async forgotPassword(data: any) {
    return this.post('/api/auth/forgot-password', data);
  }

  async resetPassword(data: any) {
    return this.post('/api/auth/reset-password', data);
  }

  async logout(allDevices = false) {
    return this.post('/api/auth/logout', { allDevices });
  }

  // User endpoints
  async getProfile() {
    return this.get('/api/user/profile');
  }

  async getPublicProfile(userId: UUID) {
    return this.get(`/api/user/profile/${userId}`);
  }

  async updateProfile(data: any) {
    return this.put('/api/user/profile', data);
  }

  async getStats() {
    return this.get('/api/user/stats');
  }

  async getMatchmakingHistory(page = 1, limit = 20) {
    return this.get('/api/user/matches', { params: { page, limit } });
  }

  async uploadAvatar(fileUrl: string) {
    return this.post('/api/user/avatar', { fileUrl });
  }

  async changePassword(data: any) {
    return this.post('/api/user/password', data);
  }

  // Game endpoints
  async createMatch(data: any) {
    return this.post('/api/game/matches', data);
  }

  async getMatch(matchId: UUID) {
    return this.get(`/api/game/matches/${matchId}`);
  }

  async getMatchState(matchId: UUID) {
    return this.get(`/api/game/matches/${matchId}/state`);
  }

  async rollDice(matchId: UUID, idempotencyKey: string) {
    return this.post(`/api/game/matches/${matchId}/roll-dice`, { idempotencyKey });
  }

  async moveToken(matchId: UUID, data: any) {
    return this.post(`/api/game/matches/${matchId}/move-token`, data);
  }

  // Matchmaking endpoints
  async joinQueue(data: any) {
    return this.post('/api/match/matchmaking/join', data);
  }

  async leaveQueue() {
    return this.post('/api/match/matchmaking/leave');
  }

  async getQueueStatus() {
    return this.get('/api/match/matchmaking/status');
  }

  async getMatchHistory(page = 1, limit = 20) {
    return this.get('/api/match/history', { params: { page, limit } });
  }

  async getAdminMatchReplay(matchId: UUID) {
    return this.get(`/api/match/replay/${matchId}`);
  }

  async getLiveMatches() {
    return this.get('/api/match/live');
  }

  // Room endpoints
  async createRoom(data: any) {
    return this.post('/api/room', data);
  }

  async getRoom(roomId: UUID) {
    return this.get(`/api/room/${roomId}`);
  }

  async getRoomByCode(code: string) {
    return this.get(`/api/room/code/${code}`);
  }

  async joinRoom(data: any) {
    return this.post('/api/room/join', data);
  }

  async leaveRoom(roomId: UUID) {
    return this.post(`/api/room/leave/${roomId}`);
  }

  async deleteRoom(roomId: UUID) {
    return this.delete(`/api/room/${roomId}`);
  }

  async performRoomAction(data: any) {
    return this.post('/api/room/action', data);
  }

  async getPublicRooms(page = 1, limit = 20) {
    return this.get('/api/room/public/list', { params: { page, limit } });
  }

  // Tournament endpoints
  async createTournament(data: any) {
    return this.post('/api/tournament', data);
  }

  async getTournaments(status?: string, page = 1, limit = 20) {
    return this.get('/api/tournament', { params: { status, page, limit } });
  }

  async getTournament(tournamentId: UUID) {
    return this.get(`/api/tournament/${tournamentId}`);
  }

  async performTournamentAction(data: any) {
    return this.post('/api/tournament/action', data);
  }

  async getTournamentBracket(tournamentId: UUID) {
    return this.get(`/api/tournament/${tournamentId}/bracket`);
  }

  // Wallet endpoints
  async getBalance() {
    return this.get('/api/wallet/balance');
  }

  async getDemoBalance() {
    return this.get('/api/wallet/demo-balance');
  }

  async getTransactions(filters?: any, page = 1, limit = 20) {
    return this.get('/api/wallet/transactions', { params: { ...filters, page, limit } });
  }

  async getTransaction(transactionId: UUID) {
    return this.get(`/api/wallet/transactions/${transactionId}`);
  }

  async deposit(data: any) {
    return this.post('/api/wallet/deposit', data);
  }

  async withdraw(data: any) {
    return this.post('/api/wallet/withdraw', data);
  }

  async getWithdrawals(page = 1, limit = 20) {
    return this.get('/api/wallet/withdrawals', { params: { page, limit } });
  }

  async getWithdrawal(withdrawalId: UUID) {
    return this.get(`/api/wallet/withdrawals/${withdrawalId}`);
  }

  // Friend endpoints
  async getFriends(page = 1, limit = 50) {
    return this.get('/api/friends', { params: { page, limit } });
  }

  async getFriendRequests(type = 'received') {
    return this.get('/api/friends/requests', { params: { type } });
  }

  async getBlockedUsers() {
    return this.get('/api/friends/blocked');
  }

  async sendFriendRequest(data: any) {
    return this.post('/api/friends/request', data);
  }

  async performFriendAction(data: any) {
    return this.post('/api/friends/action', data);
  }

  async searchUsers(query: string, limit = 20) {
    return this.get('/api/friends/search', { params: { query, limit } });
  }

  // Chat endpoints
  async getConversations(page = 1, limit = 20) {
    return this.get('/api/chat/conversations', { params: { page, limit } });
  }

  async getConversation(conversationId: UUID) {
    return this.get(`/api/chat/conversations/${conversationId}`);
  }

  async createConversation(data: any) {
    return this.post('/api/chat/conversations', data);
  }

  async leaveConversation(conversationId: UUID) {
    return this.post(`/api/chat/conversations/${conversationId}/leave`);
  }

  async getMessages(conversationId: UUID, before?: string, limit = 50) {
    return this.get(`/api/chat/conversations/${conversationId}/messages`, { params: { before, limit } });
  }

  async sendMessage(data: any) {
    return this.post('/api/chat/conversations/messages', data);
  }

  async editMessage(messageId: UUID, content: string) {
    return this.patch(`/api/chat/messages/${messageId}`, { content });
  }

  async deleteMessage(messageId: UUID) {
    return this.delete(`/api/chat/messages/${messageId}`);
  }

  async getGlobalMessages(page = 1, limit = 50) {
    return this.get('/api/chat/global', { params: { page, limit } });
  }

  async sendGlobalMessage(content: string) {
    return this.post('/api/chat/global', { content });
  }

  // Achievement endpoints
  async getAchievements() {
    return this.get('/api/user/achievements');
  }

  async getAllAchievements() {
    return this.get('/api/user/achievements/all');
  }

  // KYC endpoints
  async getKycStatus() {
    return this.get('/api/user/kyc');
  }

  async saveKycDraft(data: any) {
    return this.post('/api/user/kyc/draft', data);
  }

  async submitKyc(data: any) {
    return this.post('/api/user/kyc/submit', data);
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.get('/api/admin/dashboard');
  }

  async getUsers(filters?: any, page = 1, limit = 50) {
    return this.get('/api/admin/users', { params: { ...filters, page, limit } });
  }

  async getUser(userId: UUID) {
    return this.get(`/api/admin/users/${userId}`);
  }

  async banUser(userId: UUID, reason: string) {
    return this.post(`/api/admin/users/${userId}/ban`, { reason });
  }

  async unbanUser(userId: UUID) {
    return this.post(`/api/admin/users/${userId}/unban`);
  }

  async getMatches(filters?: any, page = 1, limit = 50) {
    return this.get('/api/admin/matches', { params: { ...filters, page, limit } });
  }

  async getMatchReplay(matchId: UUID) {
    return this.get(`/api/admin/matches/${matchId}/replay`);
  }

  async getAdminTournaments(filters?: any, page = 1, limit = 50) {
    return this.get('/api/admin/tournaments', { params: { ...filters, page, limit } });
  }

  async createAdminTournament(data: any) {
    return this.post('/api/admin/tournaments', data);
  }

  async getAdminTransactions(filters?: any, page = 1, limit = 50) {
    return this.get('/api/admin/transactions', { params: { ...filters, page, limit } });
  }

  async getAdminWithdrawals(filters?: any, page = 1, limit = 50) {
    return this.get('/api/admin/withdrawals', { params: { ...filters, page, limit } });
  }

  async approveWithdrawal(withdrawalId: UUID) {
    return this.post(`/api/admin/withdrawals/${withdrawalId}/approve`);
  }

  async rejectWithdrawal(withdrawalId: UUID, reason: string) {
    return this.post(`/api/admin/withdrawals/${withdrawalId}/reject`, { reason });
  }

  async getPendingKyc(page = 1, limit = 20) {
    return this.get('/api/admin/kyc/pending', { params: { page, limit } });
  }

  async reviewKyc(kycId: UUID, action: 'approve' | 'reject', rejectionReason?: string) {
    return this.post(`/api/admin/kyc/${kycId}/review`, { action, rejectionReason });
  }

  async getFraudAlerts(filters?: any, page = 1, limit = 50) {
    return this.get('/api/admin/fraud-alerts', { params: { ...filters, page, limit } });
  }

  async updateFraudAlert(alertId: UUID, data: any) {
    return this.put(`/api/admin/fraud-alerts/${alertId}`, data);
  }

  async getGameSettings(category?: string) {
    return this.get('/api/admin/settings', { params: { category } });
  }

  async updateGameSettings(settings: Array<{ key: string; value: any }>) {
    return this.put('/api/admin/settings', { settings });
  }

  async getAuditLogs(filters?: any, page = 1, limit = 100) {
    return this.get('/api/admin/audit-logs', { params: { ...filters, page, limit } });
  }
}

export const apiClient = new ApiClient();

export function createApiClient(baseURL?: string) {
  return new ApiClient(baseURL);
}