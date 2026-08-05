// ============================================
// @ludo-nexus/api-client - Game Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { CreateMatch, RollDice, MoveToken } from '@ludo-nexus/validation';

export function useGameQueries() {
  const queryClient = useQueryClient();

  const getMatch = (matchId: string) => useQuery({
    queryKey: queryKeys.game.match(matchId),
    queryFn: () => apiClient.getMatch(matchId),
    enabled: !!matchId,
  });

  const getMatchState = (matchId: string) => useQuery({
    queryKey: queryKeys.game.matchState(matchId),
    queryFn: () => apiClient.getMatchState(matchId),
    enabled: !!matchId,
    refetchInterval: 2000,
  });

  return { getMatch, getMatchState };
}

export function useGameMutations() {
  const queryClient = useQueryClient();

  const createMatch = useMutation({
    mutationFn: (data: CreateMatch) => apiClient.createMatch(data),
    onSuccess: (response) => {
      if (response.data?.matchId) {
        queryClient.invalidateQueries({ queryKey: ['game', 'matches'] });
      }
    },
  });

  const rollDice = useMutation({
    mutationFn: ({ matchId, idempotencyKey }: { matchId: string; idempotencyKey: string }) => 
      apiClient.rollDice(matchId, idempotencyKey),
    onSuccess: (_, { matchId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.matchState(matchId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.game.match(matchId) });
    },
  });

  const moveToken = useMutation({
    mutationFn: ({ matchId, data }: { matchId: string; data: MoveToken }) => 
      apiClient.moveToken(matchId, data),
    onSuccess: (_, { matchId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.game.matchState(matchId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.game.match(matchId) });
    },
  });

  return { createMatch, rollDice, moveToken };
}