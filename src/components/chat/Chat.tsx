import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, Image, Smile } from 'lucide-react';
import { useChat } from '../../hooks/useChat.js';
import { useAuthStore } from '../../store/authStore.js';
import { Spinner } from '../ui/index.js';
import VirtualizedMessageList from './VirtualizedMessageList.jsx';

interface ChatProps {
  workspaceId: string;
  onUnreadCountChange?: (count: number) => void;
}

const Chat: React.FC<ChatProps> = ({ workspaceId, onUnreadCountChange }) => {
  const { user } = useAuthStore();
  const { messages, isLoading, isSending, typingUsers, unreadCount, send, clearMessages, startTyping, stopTyping, clearUnreadCount } = useChat(workspaceId);
  const [message, setMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  useEffect(() => {
    return () => {
      clearMessages();
      clearUnreadCount();
    };
  }, [workspaceId, clearMessages, clearUnreadCount]);

  const handleScrollToBottom = (show: boolean) => {
    setShowScrollButton(show);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (user?._id && user?.username) {
      startTyping(user._id, user.username);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (user?._id) {
        stopTyping(user._id);
      }
    }, 3000);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (user?._id) {
      stopTyping(user._id);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      await send(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as FormEvent);
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="bg-dark-800/50 rounded-2xl border border-dark-600 h-[600px] flex flex-col"
      role="region"
      aria-label="Team chat"
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {typingUsers.length > 0 && `${typingUsers.length} user${typingUsers.length > 1 ? 's are' : ' is'} typing`}
      </div>

      <VirtualizedMessageList
        messages={messages}
        currentUserId={user?._id}
        typingUsers={typingUsers}
        onScrollToBottom={handleScrollToBottom}
        showScrollButton={showScrollButton}
        unreadCount={unreadCount}
      />

      <form onSubmit={handleSend} className="p-4 border-t border-dark-600" role="form" aria-label="Message form">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            aria-label="Attach image"
            className="p-2 text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Image size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Add emoji"
            className="p-2 text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Smile size={20} aria-hidden="true" />
          </button>
          <label htmlFor="chat-message-input" className="sr-only">Type a message</label>
          <input
            id="chat-message-input"
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-describedby="chat-hint"
          />
          <span id="chat-hint" className="sr-only">Press Enter to send, Shift+Enter for new line</span>
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            aria-label="Send message"
            className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
          >
            <Send size={20} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;