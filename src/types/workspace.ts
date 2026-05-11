import { User } from './user';

export type UserRole = 'admin' | 'member';

export interface Member {
  _id?: string;
  user: User;
  role: UserRole;
  joinedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: Member[];
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceData {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceData {
  name?: string;
  description?: string;
}

export interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
}

export interface PaginationInfo {
  page: number;
  pages: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface InviteCodeResponse {
  code: string;
  expiresAt: string;
}

export interface JoinWorkspaceData {
  code: string;
}