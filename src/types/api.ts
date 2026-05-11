import { AxiosResponse } from 'axios';
import { User, AuthResponse, ProfileUpdateData } from './user';
import { Workspace, CreateWorkspaceData, UpdateWorkspaceData, PaginatedResponse, InviteCodeResponse } from './workspace';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters } from './task';
import { Message } from './message';
import { Notification } from './notification';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedDataResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    pages: number;
    limit: number;
    total: number;
  };
}

export interface AuthApiResponse extends AxiosResponse<AuthResponse> {}

export interface WorkspaceApiResponse extends AxiosResponse<Workspace> {}
export interface WorkspaceListApiResponse extends AxiosResponse<PaginatedDataResponse<Workspace[]>> {}
export interface WorkspaceInviteApiResponse extends AxiosResponse<InviteCodeResponse> {}

export interface TaskApiResponse extends AxiosResponse<Task> {}
export interface TaskListApiResponse extends AxiosResponse<PaginatedDataResponse<Task[]>> {}

export interface MessageApiResponse extends AxiosResponse<Message> {}
export interface MessageListApiResponse extends AxiosResponse<PaginatedDataResponse<Message[]>> {}

export interface NotificationListApiResponse extends AxiosResponse<PaginatedDataResponse<Notification[]> & { unreadCount: number }> {}

// API function signatures
export interface AuthAPI {
  register: (data: { username: string; email: string; password: string }) => Promise<AuthApiResponse>;
  login: (data: { email: string; password: string }) => Promise<AuthApiResponse>;
  logout: () => Promise<void>;
  getMe: () => Promise<AxiosResponse<User>>;
  updateProfile: (data: ProfileUpdateData) => Promise<AxiosResponse<User>>;
}

export interface WorkspaceAPI {
  getAll: (params?: { page?: number }) => Promise<WorkspaceListApiResponse>;
  getOne: (id: string) => Promise<AxiosResponse<PaginatedDataResponse<Workspace>>>;
  create: (data: CreateWorkspaceData) => Promise<WorkspaceApiResponse>;
  update: (id: string, data: UpdateWorkspaceData) => Promise<WorkspaceApiResponse>;
  delete: (id: string) => Promise<void>;
  generateInvite: (id: string) => Promise<WorkspaceInviteApiResponse>;
  join: (code: string) => Promise<WorkspaceApiResponse>;
  removeMember: (workspaceId: string, userId: string) => Promise<void>;
  updateMemberRole: (workspaceId: string, userId: string, role: string) => Promise<void>;
}

export interface TaskAPI {
  getAll: (workspaceId: string, params?: { page?: number; status?: string; assignee?: string; search?: string }) => Promise<TaskListApiResponse>;
  getOne: (id: string) => Promise<TaskApiResponse>;
  create: (workspaceId: string, data: CreateTaskData) => Promise<TaskApiResponse>;
  update: (id: string, data: UpdateTaskData) => Promise<TaskApiResponse>;
  delete: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<TaskApiResponse>;
  reorder: (workspaceId: string, tasks: Array<{ _id: string; status: string; order: number }>) => Promise<void>;
}

export interface MessageAPI {
  getAll: (workspaceId: string, params?: { page?: number }) => Promise<MessageListApiResponse>;
  send: (workspaceId: string, content: string) => Promise<MessageApiResponse>;
  delete: (id: string) => Promise<void>;
}

export interface NotificationAPI {
  getAll: (params?: { page?: number }) => Promise<NotificationListApiResponse>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export interface UploadAPI {
  profileImage: (file: File) => Promise<AxiosResponse<{ url: string }>>;
  attachment: (file: File) => Promise<AxiosResponse<{ url: string }>>;
}