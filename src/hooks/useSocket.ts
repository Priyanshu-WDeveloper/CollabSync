import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore.js';
import socketService from '../services/socket.js';

export const useSocket = (workspaceId?: string) => {
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (token && !socketService.socketInstance?.connected) {
      socketService.connect(token);
    }
  }, [token]);

  useEffect(() => {
    if (workspaceId && token) {
      socketService.joinWorkspace(workspaceId);
      return () => {
        socketService.leaveWorkspace(workspaceId);
      };
    }
  }, [workspaceId, token]);

  const startTyping = useCallback(() => {
    if (workspaceId && user) {
      socketService.startTyping(workspaceId, user._id, user.username);
    }
  }, [workspaceId, user]);

  const stopTyping = useCallback(() => {
    if (workspaceId && user) {
      socketService.stopTyping(workspaceId, user._id);
    }
  }, [workspaceId, user]);

  return {
    startTyping,
    stopTyping,
    socket: socketService.socketInstance
  };
};

export default useSocket;