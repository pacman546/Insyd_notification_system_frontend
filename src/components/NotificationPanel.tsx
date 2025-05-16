import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, Check } from 'lucide-react';

const NotificationPanel = () => {
  const { notifications, acknowledgeNotification } = useNotification();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const unreadCount = notifications.filter(n => !n.acknowledged).length;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Notifications</h2>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
            {unreadCount}
          </div>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-slate-400 h-32">
          <Bell className="h-8 w-8 mb-2" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-md border relative ${
                notification.acknowledged 
                  ? 'bg-slate-50 border-slate-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <p className="text-sm">{notification.message}</p>
              <div className="mt-2 flex justify-between items-center text-xs text-slate-500">
                <span>{formatTime(notification.timestamp)}</span>
                {!notification.acknowledged && (
                  <button
                    onClick={() => acknowledgeNotification(notification.id)}
                    className="text-green-600 hover:text-green-700 p-1 rounded-full hover:bg-green-50 transition-colors"
                    title="Acknowledge"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;