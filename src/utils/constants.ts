import { TaskStatus } from '../types';

export const TASK_STATUS = {
  TODO: 'todo' as TaskStatus,
  IN_PROGRESS: 'in-progress' as TaskStatus,
  DONE: 'done' as TaskStatus,
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
};

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  WORKSPACE_INVITE: 'workspace_invite',
  TASK_STATUS_CHANGED: 'task_status_changed',
  NEW_MESSAGE: 'new_message'
};

export const TASK_STATUS_LABELS: { [key in TaskStatus]: string } = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done'
};