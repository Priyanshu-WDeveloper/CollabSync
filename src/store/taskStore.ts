import { create } from 'zustand';
import { taskAPI } from '../services/api.js';
import { Task, TaskFilters, TaskStatus, TaskState } from '../types';

interface TaskActions {
  fetchTasks: (workspaceId: string, filters?: Partial<TaskFilters>, page?: number) => Promise<unknown>;
  loadMore: () => void;
  hasMore: () => boolean;
  createTask: (workspaceId: string, taskData: { title: string; description?: string }) => Promise<unknown>;
  updateTask: (id: string, updates: Record<string, unknown>) => Promise<unknown>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: string) => Promise<unknown>;
  reorderTasks: (workspaceId: string, tasks: Task[]) => Promise<void>;
  handleTaskCreated: (task: Task) => void;
  handleTaskUpdated: (task: Task) => void;
  handleTaskDeleted: (taskId: string) => void;
  handleTaskMoved: (task: Task) => void;
  handleReordered: (updatedTasks: Task[]) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  clearTasks: () => void;
  clearError: () => void;
}

type TaskStore = TaskState & TaskActions;

export const useTaskStore = create<TaskStore>()((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {
    status: null,
    assignee: null,
    search: ''
  },
  pagination: null,

  fetchTasks: async (workspaceId: string, filters: Partial<TaskFilters> = {}, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, unknown> = { page };
      if (filters.status) params.status = filters.status;
      if (filters.assignee) params.assignee = filters.assignee;
      if (filters.search) params.search = filters.search;

      const { data } = await taskAPI.getAll(workspaceId, params);
      set({
        tasks: page === 1 ? data.data : [...get().tasks, ...data.data],
        pagination: data.pagination,
        isLoading: false
      });
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  loadMore: () => {
    const { pagination, isLoading, filters } = get();
    if (!pagination || isLoading) return;
    if (pagination.page < pagination.pages) {
      get().fetchTasks(filters.workspaceId || '', filters, pagination.page + 1);
    }
  },

  hasMore: () => {
    const { pagination } = get();
    return pagination ? pagination.page < pagination.pages : true;
  },

  createTask: async (workspaceId: string, taskData: { title: string; description?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await taskAPI.create(workspaceId, taskData);
      // Add task directly to state
      set((state) => ({
        tasks: [data.data, ...state.tasks],
        isLoading: false
      }));
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to create task', isLoading: false });
      throw error;
    }
  },

  updateTask: async (id: string, updates: Record<string, unknown>) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await taskAPI.update(id, updates);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? data.data : t)),
        currentTask: state.currentTask?._id === id ? data.data : state.currentTask,
        isLoading: false
      }));
      return data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to update task', isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskAPI.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        currentTask: state.currentTask?._id === id ? null : state.currentTask,
        isLoading: false
      }));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || 'Failed to delete task', isLoading: false });
      throw error;
    }
  },

  updateTaskStatus: async (id: string, status: string) => {
    try {
      const { data } = await taskAPI.updateStatus(id, status);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? data.data : t))
      }));
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  reorderTasks: async (workspaceId: string, tasks: Task[]) => {
    try {
      const reorderedTasks = tasks.map((t, i) => ({ _id: t._id, status: t.status, order: i }));
      await taskAPI.reorder(workspaceId, reorderedTasks);
      set({ tasks });
    } catch (error) {
      throw error;
    }
  },

  handleTaskCreated: (task: Task) => {
    // Check if task already exists to prevent duplicates
    const exists = get().tasks.some(t => t._id === task._id);
    if (!exists) {
      set((state) => ({
        tasks: [task, ...state.tasks]
      }));
    }
  },

  handleTaskUpdated: (task: Task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
      currentTask: state.currentTask?._id === task._id ? task : state.currentTask
    }));
  },

  handleTaskDeleted: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
      currentTask: state.currentTask?._id === taskId ? null : state.currentTask
    }));
  },

  handleTaskMoved: (task: Task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t))
    }));
  },

  handleReordered: (updatedTasks: Task[]) => {
    set({ tasks: updatedTasks });
  },

  setFilters: (filters: Partial<TaskFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearFilters: () => {
    set({ filters: { status: null, assignee: null, search: '' } });
  },

  getTasksByStatus: (status: TaskStatus) => {
    return get().tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);
  },

  clearTasks: () => {
    set({ tasks: [], currentTask: null });
  },

  clearError: () => set({ error: null })
}));

export default useTaskStore;