import React, { createContext, useContext, useEffect } from 'react';
import useWebSocketStore from '../services/websocket';
import { useUser } from './UserContext';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  acknowledgeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications: wsNotifications, sendAck, isConnected } = useWebSocketStore();
  const { currentUser } = useUser();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  // Clear notifications when disconnecting or changing users
  useEffect(() => {
    if (!isConnected) {
      setNotifications([]);
    }
  }, [isConnected, currentUser.id]);

  useEffect(() => {
    // Convert WebSocket notifications to panel notifications
    const newNotifications = wsNotifications.map(wsNotif => ({
      id: wsNotif.notificationId,
      message: wsNotif.message,
      timestamp: wsNotif.timestamp,
      acknowledged: false // Always start as unacknowledged
    }));

    setNotifications(prev => {
      // Merge with existing notifications, avoiding duplicates
      const existingIds = new Set(prev.map(n => n.id));
      const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
      return [...prev, ...uniqueNewNotifications];
    });
  }, [wsNotifications]);

  const acknowledgeNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, acknowledged: true }
          : notification
      )
    );
    // Only send ACK when user clicks the tick mark
    sendAck(id);
  };

  return (
    <NotificationContext.Provider value={{ notifications, acknowledgeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};