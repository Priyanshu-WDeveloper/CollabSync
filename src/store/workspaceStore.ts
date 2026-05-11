import { create } from 'zustand';
import { workspaceAPI } from '../services/api.js';
import socketService from '../services/socket.js';
import { Workspace, PaginationInfo, WorkspaceState } from '../types';

interface WorkspaceActions {
  fetchWorkspaces: (page?: number) => Promise<unknown>;
  loadMore: () => void;
  hasMore: () => boolean;
  fetchWorkspace: (id: string) => Promise<unknown>;
  createWorkspace: (workspaceData: { name: string; description?: string }) => Promise<unknown>;
  updateWorkspace: (id: string, updates: { name?: string; description?: string }) => Promise<unknown>;
  deleteWorkspace: (id: string) => Promise<void>;
  generateInviteCode: (id: string) => Promise<unknown>;
  joinWorkspace: (code: string) => Promise<unknown>;
  removeMember: (workspaceId: string, userId: string) => Promise<void>;
  updateMemberRole: (workspaceId: string, userId: string, role: string) => Promise<void>;
  leaveWorkspace: () => void;
  clearError: () => void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const useWorkspaceStore = create<WorkspaceStore>()((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchWorkspaces: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await workspaceAPI.getAll({ page });
      set({
        workspaces: page === 1 ? data.data : [...get().workspaces, ...data.data],
        pagination: data.pagination,
        isLoading: false
      });
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to fetch workspaces', isLoading: false });
    }
  },

  loadMore: () => {
    const { pagination, isLoading } = get();
    if (!pagination || isLoading) return;
    if (pagination.page < pagination.pages) {
      get().fetchWorkspaces(pagination.page + 1);
    }
  },

  hasMore: () => {
    const { pagination } = get();
    return pagination ? pagination.page < pagination.pages : true;
  },

  fetchWorkspace: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await workspaceAPI.getOne(id);
      const workspace = data.data;
      set({ currentWorkspace: workspace, isLoading: false });
      socketService.joinWorkspace(id);
      return workspace;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to fetch workspace', isLoading: false });
      throw error;
    }
  },

  createWorkspace: async (workspaceData: { name: string; description?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await workspaceAPI.create(workspaceData);
      set((state) => ({
        workspaces: [data.data, ...state.workspaces],
        isLoading: false
      }));
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to create workspace', isLoading: false });
      throw error;
    }
  },

  updateWorkspace: async (id: string, updates: { name?: string; description?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await workspaceAPI.update(id, updates);
      set((state) => ({
        workspaces: state.workspaces.map((w) => (w._id === id ? data.data : w)),
        currentWorkspace: state.currentWorkspace?._id === id ? data.data : state.currentWorkspace,
        isLoading: false
      }));
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to update workspace', isLoading: false });
      throw error;
    }
  },

  deleteWorkspace: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await workspaceAPI.delete(id);
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w._id !== id),
        currentWorkspace: state.currentWorkspace?._id === id ? null : state.currentWorkspace,
        isLoading: false
      }));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to delete workspace', isLoading: false });
      throw error;
    }
  },

  generateInviteCode: async (id: string) => {
    try {
      const { data } = await workspaceAPI.generateInvite(id);
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  joinWorkspace: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await workspaceAPI.join(code);
      set((state) => ({
        workspaces: [data.data, ...state.workspaces],
        isLoading: false
      }));
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to join workspace', isLoading: false });
      throw error;
    }
  },

  removeMember: async (workspaceId: string, userId: string) => {
    try {
      await workspaceAPI.removeMember(workspaceId, userId);
      const workspace = get().currentWorkspace;
      if (workspace?._id === workspaceId) {
        set({
          currentWorkspace: {
            ...workspace,
            members: workspace.members.filter((m) => m.user._id !== userId)
          }
        });
      }
    } catch (error) {
      throw error;
    }
  },

  updateMemberRole: async (workspaceId: string, userId: string, role: string) => {
    try {
      await workspaceAPI.updateMemberRole(workspaceId, userId, role);
      const workspace = get().currentWorkspace;
      if (workspace?._id === workspaceId) {
        set({
          currentWorkspace: {
            ...workspace,
            members: workspace.members.map((m) =>
              m.user._id === userId ? { ...m, role: role as 'admin' | 'member' } : m
            )
          }
        });
      }
    } catch (error) {
      throw error;
    }
  },

  leaveWorkspace: () => {
    const { currentWorkspace } = get();
    if (currentWorkspace) {
      socketService.leaveWorkspace(currentWorkspace._id);
    }
    set({ currentWorkspace: null });
  },

  clearError: () => set({ error: null })
}));

export default useWorkspaceStore;