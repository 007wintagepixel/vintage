// ============================================
// @ludo-nexus/api-client - Chat Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../index';
import type { SendMessage, CreateConversation } from '@ludo-nexus/validation';

export function useChatQueries() {
  const conversations = (page = 1, limit = 20) => useQuery({
    queryKey: queryKeys.chat.conversations(page, limit),
    queryFn: () => apiClient.getConversations(page, limit),
    refetchInterval: 30000,
  });

  const conversation = (conversationId: string) => useQuery({
    queryKey: queryKeys.chat.conversation(conversationId),
    queryFn: () => apiClient.getConversation(conversationId),
    enabled: !!conversationId,
  });

  const messages = (conversationId: string, before?: string, limit = 50) => useQuery({
    queryKey: queryKeys.chat.messages(conversationId, before, limit),
    queryFn: () => apiClient.getMessages(conversationId, before, limit),
    enabled: !!conversationId,
    refetchInterval: 5000,
  });

  const globalMessages = (page = 1, limit = 50) => useQuery({
    queryKey: queryKeys.chat.global(page, limit),
    queryFn: () => apiClient.getGlobalMessages(page, limit),
    refetchInterval: 10000,
  });

  return { conversations, conversation, messages, globalMessages };
}

export function useChatMutations() {
  const queryClient = useQueryClient();

  const createConversation = useMutation({
    mutationFn: (data: CreateConversation) => apiClient.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });

  const leaveConversation = useMutation({
    mutationFn: (conversationId: string) => apiClient.leaveConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });

  const sendMessage = useMutation({
    mutationFn: (data: SendMessage) => apiClient.sendMessage(data),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });

  const editMessage = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) => 
      apiClient.editMessage(messageId, content),
  });

  const deleteMessage = useMutation({
    mutationFn: (messageId: string) => apiClient.deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] });
    },
  });

  const sendGlobalMessage = useMutation({
    mutationFn: (content: string) => apiClient.sendGlobalMessage(content),
  });

  return { createConversation, leaveConversation, sendMessage, editMessage, deleteMessage, sendGlobalMessage };
}