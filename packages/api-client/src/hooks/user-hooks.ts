// ============================================
// @ludo-nexus/api-client - User Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { KYCSubmission } from '@ludo-nexus/validation';

export function useUserQueries() {
  const stats = useQuery({
    queryKey: queryKeys.user.stats(),
    queryFn: () => apiClient.getStats(),
  });

  const matchHistory = (page = 1, limit = 20) => useQuery({
    queryKey: queryKeys.user.matchHistory(page, limit),
    queryFn: () => apiClient.getMatchHistory(page, limit),
  });

  const achievements = useQuery({
    queryKey: queryKeys.user.achievements(),
    queryFn: () => apiClient.getAchievements(),
  });

  const allAchievements = useQuery({
    queryKey: queryKeys.user.allAchievements(),
    queryFn: () => apiClient.getAllAchievements(),
  });

  const kyc = useQuery({
    queryKey: queryKeys.user.kyc(),
    queryFn: () => apiClient.getKycStatus(),
  });

  return { stats, matchHistory, achievements, allAchievements, kyc };
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const saveKycDraft = useMutation({
    mutationFn: (data: Partial<KYCSubmission>) => apiClient.saveKycDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.kyc() });
    },
  });

  const submitKyc = useMutation({
    mutationFn: (data: KYCSubmission) => apiClient.submitKyc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.kyc() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });

  return { saveKycDraft, submitKyc };
}