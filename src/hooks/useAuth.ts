import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import socketService from '../services/socket.js';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    loadUser,
    updateProfile,
    error,
    clearError
  } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
    }
  }, [isAuthenticated, token]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    error,
    clearError
  };
};

export default useAuth;