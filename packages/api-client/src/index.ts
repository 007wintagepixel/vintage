// ============================================
// @ludo-nexus/api-client - Main Export
// ============================================

// API Client
export { createApiClient, apiClient } from './api-client';

// React Query
export { queryClient, queryKeys } from './query-client';
export { useAuthQueries, useAuthMutations } from './hooks/auth-hooks';
export { useGameQueries, useGameMutations } from './hooks/game-hooks';
export { useRoomQueries, useRoomMutations } from './hooks/room-hooks';
export { useTournamentQueries, useTournamentMutations } from './hooks/tournament-hooks';
export { useWalletQueries, useWalletMutations } from './hooks/wallet-hooks';
export { useFriendQueries, useFriendMutations } from './hooks/friend-hooks';
export { useChatQueries, useChatMutations } from './hooks/chat-hooks';
export { useUserQueries, useUserMutations } from './hooks/user-hooks';
export { useAdminQueries, useAdminMutations } from './hooks/admin-hooks';

// WebSocket
export { createSocketClient, SocketClient } from './socket-client';

// Types
export type { ApiResponse, PaginatedResponse } from '@ludo-nexus/shared-types';