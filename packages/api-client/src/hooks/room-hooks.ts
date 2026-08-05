// ============================================
// @ludo-nexus/api-client - Room Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { CreateRoom, JoinRoom, RoomAction } from '@ludo-nexus/validation';

export function useRoomQueries() {
  const getRoom = (roomId: string) => useQuery({
    queryKey: queryKeys.room.detail(roomId),
    queryFn: () => apiClient.getRoom(roomId),
    enabled: !!roomId,
    refetchInterval: 3000,
  });

  const getRoomByCode = (code: string) => useQuery({
    queryKey: queryKeys.room.byCode(code),
    queryFn: () => apiClient.getRoomByCode(code),
    enabled: !!code,
  });

  const getPublicRooms = (page = 1, limit = 20) => useQuery({
    queryKey: queryKeys.room.public(page, limit),
    queryFn: () => apiClient.getPublicRooms(page, limit),
  });

  return { getRoom, getRoomByCode, getPublicRooms };
}

export function useRoomMutations() {
  const queryClient = useQueryClient();

  const createRoom = useMutation({
    mutationFn: (data: CreateRoom) => apiClient.createRoom(data),
    onSuccess: (response) => {
      if (response.data?.id) {
        queryClient.invalidateQueries({ queryKey: ['room', 'public'] });
      }
    },
  });

  const joinRoom = useMutation({
    mutationFn: (data: JoinRoom) => apiClient.joinRoom(data),
    onSuccess: (_, { roomCode }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.room.byCode(roomCode) });
    },
  });

  const leaveRoom = useMutation({
    mutationFn: (roomId: string) => apiClient.leaveRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', 'public'] });
    },
  });

  const deleteRoom = useMutation({
    mutationFn: (roomId: string) => apiClient.deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', 'public'] });
    },
  });

  const performRoomAction = useMutation({
    mutationFn: (data: RoomAction) => apiClient.performRoomAction(data),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.room.detail(roomId) });
    },
  });

  return { createRoom, joinRoom, leaveRoom, deleteRoom, performRoomAction };
}