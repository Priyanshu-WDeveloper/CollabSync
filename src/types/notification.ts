export type NotificationType =
  | 'task_assigned'
  | 'workspace_invite'
  | 'task_status_changed'
  | 'new_message';

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  data?: {
    taskId?: string;
    workspaceId?: string;
    senderId?: string;
  };
  link?: string;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: import('./workspace').PaginationInfo | null;
}

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned' as NotificationType,
  WORKSPACE_INVITE: 'workspace_invite' as NotificationType,
  TASK_STATUS_CHANGED: 'task_status_changed' as NotificationType,
  NEW_MESSAGE: 'new_message' as NotificationType,
};