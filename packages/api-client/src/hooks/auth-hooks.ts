// ============================================
// @ludo-nexus/api-client - Auth Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { 
  RegisterRequest, LoginRequest, OTPVerify, ForgotPassword, 
  ResetPassword, UpdateProfile, ChangePassword 
} from '@ludo-nexus/validation';

export function useAuthQueries() {
  const profile = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => apiClient.getProfile(),
    staleTime: 10 * 60 * 1000,
  });

  return { profile };
}

export function useAuthMutations() {
  const queryClient = useQueryClient();

  const register = useMutation({
    mutationFn: (data: RegisterRequest) => apiClient.register(data),
    onSuccess: (response) => {
      if (response.data?.accessToken && response.data?.refreshToken) {
        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });

  const login = useMutation({
    mutationFn: (data: LoginRequest) => apiClient.login(data),
    onSuccess: (response) => {
      if (response.data?.accessToken && response.data?.refreshToken) {
        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });

  const verifyOtp = useMutation({
    mutationFn: (data: OTPVerify) => apiClient.verifyOtp(data),
  });

  const resendOtp = useMutation({
    mutationFn: (data: { identifier: string; type: string }) => apiClient.resendOtp(data),
  });

  const forgotPassword = useMutation({
    mutationFn: (data: ForgotPassword) => apiClient.forgotPassword(data),
  });

  const resetPassword = useMutation({
    mutationFn: (data: ResetPassword) => apiClient.resetPassword(data),
  });

  const logout = useMutation({
    mutationFn: (allDevices?: boolean) => apiClient.logout(allDevices),
    onSuccess: () => {
      apiClient.clearTokens();
      queryClient.clear();
    },
  });

  const updateProfile = useMutation({
    mutationFn: (data: UpdateProfile) => apiClient.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });

  const changePassword = useMutation({
    mutationFn: (data: ChangePassword) => apiClient.changePassword(data),
  });

  const uploadAvatar = useMutation({
    mutationFn: (fileUrl: string) => apiClient.uploadAvatar(fileUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });

  return {
    register,
    login,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    changePassword,
    uploadAvatar,
  };
}