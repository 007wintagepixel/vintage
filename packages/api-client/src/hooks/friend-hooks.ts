// ============================================
// @ludo-nexus/api-client - Friend Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { SendFriendRequest, FriendAction, UserSearch } from '@ludo-nexus/validation';

export function useFriendQueries() {
  const friends = (page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.friends.list(page, limit),
    queryFn: () => apiClient.getFriends(page, limit),
  });

  const requests = (type: 'received' | 'sent' = 'received') => useQuery({
    queryKey: queryKeys.friends.requests(type),
    queryFn: () => apiClient.getFriendRequests(type),
  });

  const blocked = useQuery({
    queryKey: queryKeys.friends.blocked(),
    queryFn: () => apiClient.getBlockedUsers(),
  });

  const search = (query: string, limit = 20) => useQuery({
    queryKey: queryKeys.friends.search(query, limit),
    queryFn: () => apiClient.searchUsers(query, limit),
    enabled: query.length >= 2,
  });

  return { friends, requests, blocked, search };
}

export function useFriendMutations() {
  const queryClient = useQueryClient();

  const sendRequest = useMutation({
    mutationFn: (data: SendFriendRequest) => apiClient.sendFriendRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', 'requests'] });
    },
  });

  const performAction = useMutation({
    mutationFn: (data: FriendAction) => apiClient.performFriendAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['friends', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends', 'blocked'] });
    },
  });

  return { sendRequest, performAction };
}