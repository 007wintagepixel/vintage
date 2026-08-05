// ============================================
// @ludo-nexus/api-client - Tournament Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { CreateTournament, TournamentAction } from '@ludo-nexus/validation';

export function useTournamentQueries() {
  const getTournaments = (status?: string, page = 1, limit = 20) => useQuery({
    queryKey: queryKeys.tournament.list(status, page, limit),
    queryFn: () => apiClient.getTournaments(status, page, limit),
  });

  const getTournament = (tournamentId: string) => useQuery({
    queryKey: queryKeys.tournament.detail(tournamentId),
    queryFn: () => apiClient.getTournament(tournamentId),
    enabled: !!tournamentId,
    refetchInterval: 5000,
  });

  const getTournamentBracket = (tournamentId: string) => useQuery({
    queryKey: queryKeys.tournament.bracket(tournamentId),
    queryFn: () => apiClient.getTournamentBracket(tournamentId),
    enabled: !!tournamentId,
    refetchInterval: 10000,
  });

  return { getTournaments, getTournament, getTournamentBracket };
}

export function useTournamentMutations() {
  const queryClient = useQueryClient();

  const createTournament = useMutation({
    mutationFn: (data: CreateTournament) => apiClient.createTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', 'list'] });
    },
  });

  const performTournamentAction = useMutation({
    mutationFn: (data: TournamentAction) => apiClient.performTournamentAction(data),
    onSuccess: (_, { tournamentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tournament.detail(tournamentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tournament.bracket(tournamentId) });
      queryClient.invalidateQueries({ queryKey: ['tournament', 'list'] });
    },
  });

  return { createTournament, performTournamentAction };
}