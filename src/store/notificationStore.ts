import { create } from 'zustand';
import { notificationAPI } from '../services/api.js';
import { Notification, NotificationState } from '../types';

interface NotificationActions {
  fetchNotifications: (page?: number) => Promise<unknown>;
  loadMore: () => void;
  hasMore: () => boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearError: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pagination: null,

  fetchNotifications: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await notificationAPI.getAll({ page });
      set({
        notifications: page === 1 ? data.data : [...get().notifications, ...data.data],
        unreadCount: data.unreadCount,
        pagination: data.pagination,
        isLoading: false
      });
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to fetch notifications', isLoading: false });
    }
  },

  loadMore: () => {
    const { pagination, isLoading } = get();
    if (!pagination || isLoading) return;
    if (pagination.page < pagination.pages) {
      get().fetchNotifications(pagination.page + 1);
    }
  },

  hasMore: () => {
    const { pagination } = get();
    return pagination ? pagination.page < pagination.pages : true;
  },

  markAsRead: async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationAPI.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationAPI.delete(id);
      set((state) => {
        const notification = state.notifications.find((n) => n._id === id);
        return {
          notifications: state.notifications.filter((n) => n._id !== id),
          unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount
        };
      });
    } catch (error) {
      throw error;
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  clearError: () => set({ error: null })
}));

export default useNotificationStore;