import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chatStore.js';
import socketService from '../services/socket.js';

export const useChat = (workspaceId?: string) => {
  const {
    messages,
    isLoading,
    isSending,
    error,
    typingUsers,
    unreadCount,
    fetchMessages,
    sendMessage,
    deleteMessage,
    handleNewMessage,
    handleMessageDeleted,
    handleUserTyping,
    handleUserStopTyping,
    clearTyping,
    clearMessages,
    clearUnreadCount
  } = useChatStore();

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!workspaceId) return;

    clearMessages();
    clearUnreadCount();
    socketService.joinWorkspace(workspaceId);

    const handleNew = handleNewMessage as Parameters<typeof socketService.onMessageNew>[0];
    const handleDeleted = handleMessageDeleted as Parameters<typeof socketService.onMessageDeleted>[0];
    const handleTyping = handleUserTyping as Parameters<typeof socketService.onUserTyping>[0];
    const handleStopTyping = handleUserStopTyping as Parameters<typeof socketService.onUserStopTyping>[0];

    socketService.onMessageNew(handleNew);
    socketService.onMessageDeleted(handleDeleted);
    socketService.onUserTyping(handleTyping);
    socketService.onUserStopTyping(handleStopTyping);

    initializedRef.current = true;

    return () => {
      socketService.leaveWorkspace(workspaceId);
      socketService.removeListener('message:new');
      socketService.removeListener('message:deleted');
      socketService.removeListener('user:typing');
      socketService.removeListener('user:stopTyping');
    };
  }, [workspaceId, clearMessages, clearUnreadCount, handleNewMessage, handleMessageDeleted, handleUserTyping, handleUserStopTyping]);

  useEffect(() => {
    if (workspaceId && initializedRef.current) {
      fetchMessages(workspaceId);
    }
  }, [workspaceId]);

  const send = useCallback(async (content: string) => {
    const message = await sendMessage(workspaceId!, content);
    clearTyping();
    return message;
  }, [workspaceId, sendMessage, clearTyping]);

  const startTyping = (userId: string, username: string) => {
    handleUserTyping({ userId, username });
  };

  const stopTyping = (userId: string) => {
    handleUserStopTyping({ userId });
  };

  return {
    messages,
    isLoading,
    isSending,
    error,
    typingUsers,
    unreadCount,
    send,
    deleteMessage,
    clearMessages,
    clearUnreadCount,
    startTyping,
    stopTyping
  };
};

export default useChat;