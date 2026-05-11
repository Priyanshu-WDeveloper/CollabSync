import { create } from 'zustand';
import { authAPI } from '../services/api.js';
import socketService from '../services/socket.js';
import { User, AuthState } from '../types';

interface AuthActions {
  register: (username: string, email: string, password: string) => Promise<unknown>;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: { username?: string; avatar?: string }) => Promise<unknown>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        token: parsed.state?.token || null,
        user: parsed.state?.user || null,
      };
    }
  } catch {
    // ignore
  }
  return { token: null, user: null };
};

const storedAuth = getStoredAuth();

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: !!(storedAuth.token && storedAuth.user),
  isLoading: false,
  error: null,

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({ username, email, password });
      const { data } = response;
      const user = data.data?.user;
      const token = data.data?.token;

      localStorage.setItem('auth-storage', JSON.stringify({ state: { token, user } }));
      set({ user, token, isAuthenticated: true, isLoading: false });
      socketService.connect(token);
      if (user?._id) socketService.joinUser(user._id);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { data } = response;
      const user = data.data?.user;
      const token = data.data?.token;

      localStorage.setItem('auth-storage', JSON.stringify({ state: { token, user } }));
      set({ user, token, isAuthenticated: true, isLoading: false });
      socketService.connect(token);
      if (user?._id) socketService.joinUser(user._id);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue with local logout even if API fails
    }
    localStorage.removeItem('auth-storage');
    socketService.disconnect();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await authAPI.getMe();
      set({ user: data, isAuthenticated: true, isLoading: false });
      socketService.connect(token);
      if (data?._id) socketService.joinUser(data._id);
    } catch {
      localStorage.removeItem('auth-storage');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (updates: { username?: string; avatar?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.updateProfile(updates);
      const user = data.data || data;
      set({ user, isLoading: false });
      // Update localStorage
      const currentState = get();
      if (currentState.token) {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: { token: currentState.token, user }
        }));
      }
      return user;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Update failed', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;