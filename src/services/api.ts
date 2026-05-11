import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { ENV } from '../config/index.js';
import { useAuthStore } from '../store/authStore.js';

const api: AxiosInstance = axios.create({
  baseURL: ENV.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state = useAuthStore.getState();
  const token = state.token;
  console.log('[API]', config.url?.substring(0, 50), '| auth:', !!token, '| isAuth:', state.isAuthenticated);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { username?: string; avatar?: string }) =>
    api.put('/auth/profile', data)
};

export const workspaceAPI = {
  getAll: (params?: { page?: number }) =>
    api.get('/workspaces', { params }),
  getOne: (id: string) =>
    api.get(`/workspaces/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/workspaces', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/workspaces/${id}`, data),
  delete: (id: string) =>
    api.delete(`/workspaces/${id}`),
  generateInvite: (id: string) =>
    api.post(`/workspaces/${id}/invite`),
  join: (code: string) =>
    api.post('/workspaces/join', { code }),
  removeMember: (workspaceId: string, userId: string) =>
    api.delete(`/workspaces/${workspaceId}/members/${userId}`),
  updateMemberRole: (workspaceId: string, userId: string, role: string) =>
    api.put(`/workspaces/${workspaceId}/members/${userId}`, { role })
};

export const taskAPI = {
  getAll: (workspaceId: string, params?: Record<string, unknown>) =>
    api.get(`/tasks/workspace/${workspaceId}`, { params }),
  getOne: (id: string) =>
    api.get(`/tasks/${id}`),
  create: (workspaceId: string, data: Record<string, unknown>) =>
    api.post(`/tasks/workspace/${workspaceId}`, data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/tasks/${id}`, data),
  delete: (id: string) =>
    api.delete(`/tasks/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/tasks/${id}/status`, { status }),
  reorder: (workspaceId: string, tasks: Array<{ _id: string; status: string; order: number }>) =>
    api.put('/tasks/reorder', { workspaceId, tasks })
};

export const messageAPI = {
  getAll: (workspaceId: string, params?: { page?: number }) =>
    api.get(`/messages/workspace/${workspaceId}`, { params }),
  send: (workspaceId: string, content: string) =>
    api.post(`/messages/workspace/${workspaceId}`, { content }),
  delete: (id: string) =>
    api.delete(`/messages/${id}`)
};

export const notificationAPI = {
  getAll: (params?: { page?: number }) =>
    api.get('/notifications', { params }),
  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
  delete: (id: string) =>
    api.delete(`/notifications/${id}`)
};

export const uploadAPI = {
  profileImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  attachment: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/attachment', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
};

export default api;