import { io, Socket } from 'socket.io-client';
import { ENV } from '../config/index.js';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error' | 'failed';

type SocketCallback = (data: unknown) => void;

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private url: string = ENV.VITE_SOCKET_URL;
  private connectionState: ConnectionState = 'disconnected';
  private listeners: Map<string, { handler: SocketCallback; socketListener: ((...args: unknown[]) => void) | null }> = new Map();
  private batchedEvents: Map<string, unknown[]> = new Map();
  private batchTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private baseReconnectDelay: number = 1000;
  private subscribers: Set<(state: ConnectionState) => void> = new Set();

  connect(token: string): Socket | undefined {
    if (this.socket?.connected) return this.socket;

    this.connectionState = 'connecting';

    this.socket = io(this.url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.baseReconnectDelay,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connectionState = 'connected';
      this.reconnectAttempts = 0;
      this.notifySubscribers();
      this.flushBatchedEvents();
      // Rejoin user room after reconnection
      if (this.userId) {
        this.joinUser(this.userId);
      }
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
      this.connectionState = 'disconnected';
      this.notifySubscribers();
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error.message);
      this.connectionState = 'error';
      this.reconnectAttempts++;
      const delay = Math.min(
        this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1) * (1 + Math.random()),
        30000
      );
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      this.notifySubscribers();
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      this.connectionState = 'connected';
      this.notifySubscribers();
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after maximum attempts');
      this.connectionState = 'failed';
      this.notifySubscribers();
    });

    return this.socket;
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  onConnectionChange(callback: (state: ConnectionState) => void): () => boolean {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.connectionState));
  }

  batchEvent(event: string, data: unknown): void {
    if (!this.batchedEvents.has(event)) {
      this.batchedEvents.set(event, []);
    }
    this.batchedEvents.get(event)?.push(data);

    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => this.flushBatchedEvents(), 100);
    }
  }

  private flushBatchedEvents(): void {
    this.batchedEvents.forEach((events, event) => {
      if (events.length > 0) {
        const listener = this.listeners.get(event);
        if (listener?.handler) {
          if (events.length === 1) {
            listener.handler(events[0]);
          } else {
            listener.handler({ events, type: 'batch' });
          }
        }
      }
    });
    this.batchedEvents.clear();
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinWorkspace(workspaceId: string): void {
    this.socket?.emit('join:workspace', workspaceId);
  }

  leaveWorkspace(workspaceId: string): void {
    this.socket?.emit('leave:workspace', workspaceId);
  }

  joinUser(userId: string): void {
    this.userId = userId;
    this.socket?.emit('join:user', userId);
  }

  startTyping(workspaceId: string, userId: string, username: string): void {
    this.socket?.emit('typing:start', { workspaceId, userId, username });
  }

  stopTyping(workspaceId: string, userId: string): void {
    this.socket?.emit('typing:stop', { workspaceId, userId });
  }

  onTaskCreated(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('task:created', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('task:created', wrappedCallback);
  }

  onTaskUpdated(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('task:updated', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('task:updated', wrappedCallback);
  }

  onTaskDeleted(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('task:deleted', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('task:deleted', wrappedCallback);
  }

  onTaskMoved(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('task:moved', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('task:moved', wrappedCallback);
  }

  onTaskReordered(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('task:reordered', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('task:reordered', wrappedCallback);
  }

  onMessageNew(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('message:new', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('message:new', wrappedCallback);
  }

  onMessageDeleted(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('message:deleted', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('message:deleted', wrappedCallback);
  }

  onUserTyping(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('user:typing', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('user:typing', wrappedCallback);
  }

  onUserStopTyping(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('user:stopTyping', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('user:stopTyping', wrappedCallback);
  }

  onNotificationNew(callback: SocketCallback): void {
    const wrappedCallback = (data: unknown) => callback(data);
    this.listeners.set('notification:new', { handler: callback, socketListener: wrappedCallback });
    this.socket?.on('notification:new', wrappedCallback);
  }

  removeListener(event: string): void {
    const entry = this.listeners.get(event);
    if (entry) {
      if (entry.socketListener) {
        this.socket?.off(event, entry.socketListener);
      }
      this.listeners.delete(event);
    }
  }

  removeAllListeners(): void {
    this.listeners.forEach((entry, event) => {
      if (entry.socketListener) {
        this.socket?.off(event, entry.socketListener);
      }
    });
    this.listeners.clear();
  }

  get socketInstance(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;