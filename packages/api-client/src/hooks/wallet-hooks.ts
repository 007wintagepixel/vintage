// ============================================
// @ludo-nexus/api-client - Wallet Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { Deposit, Withdrawal } from '@ludo-nexus/validation';

export function useWalletQueries() {
  const balance = useQuery({
    queryKey: queryKeys.wallet.balance(),
    queryFn: () => apiClient.getBalance(),
    refetchInterval: 30000,
  });

  const demoBalance = useQuery({
    queryKey: queryKeys.wallet.demoBalance(),
    queryFn: () => apiClient.getDemoBalance(),
    refetchInterval: 10000,
  });

  const transactions = (filters?: any, page = 1, limit = 20) => useQuery({
    queryKey: queryKeys.wallet.transactions(filters, page, limit),
    queryFn: () => apiClient.getTransactions(filters, page, limit),
  });

  const transaction = (transactionId: string) => useQuery({
    queryKey: queryKeys.wallet.transaction(transactionId),
    queryFn: () => apiClient.getTransaction(transactionId),
    enabled: !!transactionId,
  });

  const withdrawals = (page = 1, limit = 20) => useQuery({
    queryKey: queryKeys.wallet.withdrawals(page, limit),
    queryFn: () => apiClient.getWithdrawals(page, limit),
  });

  const withdrawal = (withdrawalId: string) => useQuery({
    queryKey: queryKeys.wallet.withdrawal(withdrawalId),
    queryFn: () => apiClient.getWithdrawal(withdrawalId),
    enabled: !!withdrawalId,
  });

  return { balance, demoBalance, transactions, transaction, withdrawals, withdrawal };
}

export function useWalletMutations() {
  const queryClient = useQueryClient();

  const deposit = useMutation({
    mutationFn: (data: Deposit) => apiClient.deposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.demoBalance() });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
    },
  });

  const withdraw = useMutation({
    mutationFn: (data: Withdrawal) => apiClient.withdraw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.demoBalance() });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] });
    },
  });

  return { deposit, withdraw };
}