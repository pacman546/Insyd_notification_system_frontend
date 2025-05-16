import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from './UserContext';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  isConnected: boolean;
}

export const WebSocketProvider = ({ children, isConnected }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { currentUser } = useUser();

  useEffect(() => {
    if (isConnected && !socket) {
      const wsUrl = 'wss://insydnotificationsystem-backend-production-6025.up.railway.app:3000';
      const newSocket = new WebSocket(wsUrl);
      
      newSocket.onopen = () => {
        console.log('WebSocket connection established');
        newSocket.send(JSON.stringify({
          type: 'AUTH',
          userId: currentUser.id,
        }));
      };
      
      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
      };
      
      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setSocket(newSocket);
    } else if (!isConnected && socket) {
      socket.close();
      setSocket(null);
    }
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isConnected, currentUser.id]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'AUTH',
        userId: currentUser.id,
      }));
    }
  }, [currentUser.id, socket]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  
  return context;
};
