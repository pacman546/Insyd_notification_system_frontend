import { create } from 'zustand';

interface Notification {
  toUserId: string;
  message: string;
  eventType: string;
  timestamp: string;
  notificationId: string;
  status: string;
}

interface WebSocketStore {
  socket: WebSocket | null;
  notifications: Notification[];
  isConnected: boolean;
  connect: (userId: string) => void;
  disconnect: () => void;
  sendAck: (notificationId: string) => void;
}

const RECONNECT_DELAY = 3000; // 3 seconds
let reconnectTimeout: number | null = null;
let currentUserId: string | null = null;

const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  notifications: [],
  isConnected: false,
  connect: (userId: string) => {
    currentUserId = userId;
    const connectWebSocket = () => {
      console.log('Connecting to WebSocket...');
      const socket = new WebSocket('wss://insydnotificationsystem-backend-production-6025.up.railway.app');

      socket.onopen = () => {
        console.log('WebSocket connected');
        set({ isConnected: true });
        const authMessage = {
          type: 'AUTH',
          userId: userId,
        };
        console.log('Sending auth message:', authMessage);
        socket.send(JSON.stringify(authMessage));
      };

      socket.onmessage = (event) => {
        console.log('Received WebSocket message:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed message:', data);
          if (data.type === 'NOTIFICATION') {
            console.log('Received notification:', data.payload);
            set((state) => ({
              notifications: [...state.notifications, data.payload],
            }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        set({ socket: null, isConnected: false });
        
        // Attempt to reconnect if we have a userId
        if (currentUserId) {
          if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
          }
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, RECONNECT_DELAY);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      set({ socket });
    };

    connectWebSocket();
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    currentUserId = null;
  },
  sendAck: (notificationId: string) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'ACK',
        notificationId,
      }));
    }
  },
}));

export default useWebSocketStore; 