import { User } from './user';

export interface Message {
  _id: string;
  content: string;
  sender: User;
  workspaceId: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  content: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  typingUsers: TypingUser[];
  pagination: import('./workspace').PaginationInfo | null;
  unreadCount: number;
}

export interface TypingUser {
  userId: string;
  username: string;
}