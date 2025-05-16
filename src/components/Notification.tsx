import React from 'react';
import { format } from 'date-fns';
import useWebSocketStore from '../services/websocket';

const Notification: React.FC = () => {
  const { notifications, sendAck } = useWebSocketStore();

  React.useEffect(() => {
    console.log('Current notifications:', notifications);
    // Mark all visible notifications as seen
    notifications.forEach((notification) => {
      if (notification.status === 'pending') {
        console.log('Sending ACK for notification:', notification.notificationId);
        sendAck(notification.notificationId);
      }
    });
  }, [notifications, sendAck]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.notificationId}
          className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-blue-500"
        >
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(notification.timestamp), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification; 