import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../store/notificationStore.js';
import socketService from '../services/socket.js';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  } = useNotificationStore();

  const addRef = useRef(addNotification);

  useEffect(() => {
    // Fetch on mount
    fetchNotifications();

    // Create handler that doesn't depend on closure
    const handleNotification = (data: unknown) => {
      console.log('[Socket] notification:new received:', data);
      addRef.current(data as Parameters<typeof addRef.current>[0]);
    };

    socketService.onNotificationNew(handleNotification);
    console.log('[useNotifications] listener registered');

    return () => {
      socketService.removeListener('notification:new');
      console.log('[useNotifications] listener removed');
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export default useNotifications;