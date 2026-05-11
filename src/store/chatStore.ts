import { create } from 'zustand';
import { messageAPI } from '../services/api.js';
import { useAuthStore } from './authStore.js';
import { Message, TypingUser, ChatState } from '../types';

interface ChatActions {
  fetchMessages: (workspaceId: string, page?: number) => Promise<unknown>;
  sendMessage: (workspaceId: string, content: string) => Promise<unknown>;
  deleteMessage: (id: string) => Promise<void>;
  handleNewMessage: (message: Message) => void;
  handleMessageDeleted: (messageId: string) => void;
  handleUserTyping: (data: TypingUser) => void;
  handleUserStopTyping: (data: { userId: string }) => void;
  clearTyping: () => void;
  clearMessages: () => void;
  clearUnreadCount: () => void;
  clearError: () => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()((set, get) => ({
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,
  typingUsers: [],
  pagination: null,
  unreadCount: 0,

  fetchMessages: async (workspaceId: string, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await messageAPI.getAll(workspaceId, { page });
      set({
        messages: page === 1 ? data.data : [...get().messages, ...data.data],
        pagination: data.pagination,
        isLoading: false
      });
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to fetch messages', isLoading: false });
    }
  },

  sendMessage: async (workspaceId: string, content: string) => {
    set({ isSending: true, error: null });
    try {
      const { data } = await messageAPI.send(workspaceId, content);
      set((state) => ({
        messages: [...state.messages, data.data],
        isSending: false
      }));
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to send message', isSending: false });
      throw error;
    }
  },

  deleteMessage: async (id: string) => {
    try {
      await messageAPI.delete(id);
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== id)
      }));
    } catch (error) {
      throw error;
    }
  },

  handleNewMessage: (message: Message) => {
    const currentUserId = useAuthStore.getState().user?._id;
    const isOwnMessage = message.sender?._id === currentUserId;

    set((state) => {
      if (state.messages.some((m) => m._id === message._id)) return state;
      return {
        messages: [...state.messages, message],
        unreadCount: isOwnMessage ? state.unreadCount : state.unreadCount + 1
      };
    });
  },

  handleMessageDeleted: (messageId: string) => {
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== messageId)
    }));
  },

  handleUserTyping: ({ userId, username }: TypingUser) => {
    set((state) => {
      if (state.typingUsers.some((u) => u.userId === userId)) return state;
      return { typingUsers: [...state.typingUsers, { userId, username }] };
    });
  },

  handleUserStopTyping: ({ userId }: { userId: string }) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u.userId !== userId)
    }));
  },

  clearTyping: () => set({ typingUsers: [] }),

  clearMessages: () => {
    set({ messages: [], pagination: null, typingUsers: [] });
  },

  clearUnreadCount: () => set({ unreadCount: 0 }),

  clearError: () => set({ error: null })
}));

export default useChatStore;