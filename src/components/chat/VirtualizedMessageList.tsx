import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import { Message } from '../../types';

interface MessageComponentProps {
  msg: Message;
  isOwn: boolean;
}

const MessageComponent: React.FC<MessageComponentProps> = memo(({ msg, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
      <div className="flex items-center space-x-2 mb-1">
        {!isOwn && (
          <>
            <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-xs text-white">
              {(msg.sender?.username || 'U').charAt(0)}
            </div>
            <span className="text-sm font-medium text-slate-300">
              {msg.sender?.username || 'Unknown'}
            </span>
          </>
        )}
        <span className="text-xs text-slate-500">
          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div
        className={`px-4 py-3 rounded-2xl ${
          isOwn
            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
            : 'bg-dark-700 text-slate-200'
        }`}
      >
        {msg.content}
      </div>
    </div>
  </div>
));

MessageComponent.displayName = 'MessageComponent';

interface VirtualizedMessageListProps {
  messages: Message[];
  currentUserId?: string;
  typingUsers: Array<{ userId: string; username: string }>;
  onScrollToBottom?: (show: boolean) => void;
  showScrollButton?: boolean;
  unreadCount?: number;
}

const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  currentUserId,
  typingUsers,
  onScrollToBottom,
  showScrollButton,
  unreadCount = 0
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const lastMessageCountRef = useRef(messages.length);

  useEffect(() => {
    if (isNearBottom && parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
      lastMessageCountRef.current = messages.length;
    } else if (messages.length > lastMessageCountRef.current) {
      lastMessageCountRef.current = messages.length;
    }
  }, [messages, isNearBottom]);

  const scrollToBottom = useCallback(() => {
    if (parentRef.current) {
      parentRef.current.scrollTo({
        top: parentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = parentRef.current;
    if (container) {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      const nearBottom = distanceFromBottom <= 100;
      setIsNearBottom(nearBottom);
      if (onScrollToBottom) {
        onScrollToBottom(!nearBottom);
      }
      if (nearBottom) {
        lastMessageCountRef.current = messages.length;
      }
    }
  }, [onScrollToBottom, messages.length]);

  const getTypingText = () => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) return `${typingUsers[0].username} is typing...`;
    if (typingUsers.length === 2) return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
    return 'Several people are typing...';
  };

  return (
    <div className="relative h-full flex flex-col">
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isOwn = (msg.sender?._id ?? msg.sender ?? '') === (currentUserId ?? '');
              return <MessageComponent key={msg._id} msg={msg} isOwn={isOwn} />;
            })}
          </div>
        )}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 bg-dark-700 rounded-full text-slate-400 hover:text-white hover:bg-dark-600 shadow-lg transition-colors"
        >
          <span className="sr-only">Scroll to bottom</span>
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </button>
      )}

      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-slate-400 italic">
          {getTypingText()}
        </div>
      )}
    </div>
  );
};

export default VirtualizedMessageList;