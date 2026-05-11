import { User } from './user';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  assignees: User[];
  dueDate?: string;
  attachments: string[];
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  assignees?: string[];
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignees?: string[];
  dueDate?: string;
}

export interface TaskFilters {
  status: TaskStatus | null;
  assignee: string | null;
  search: string;
  workspaceId?: string;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  pagination: import('./workspace').PaginationInfo | null;
}

export interface ReorderTaskData {
  _id: string;
  status: TaskStatus;
  order: number;
}

export const TASK_STATUS = {
  TODO: 'todo' as TaskStatus,
  IN_PROGRESS: 'in-progress' as TaskStatus,
  DONE: 'done' as TaskStatus,
};

export const TASK_STATUS_LABELS: { [key in TaskStatus]: string } = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done'
};