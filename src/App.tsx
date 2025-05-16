import React, { useState, useEffect } from 'react';
import UserSelection from './components/UserSelection';
import PostsList from './components/PostsList';
import NotificationPanel from './components/NotificationPanel';
import { UserProvider, useUser } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import { WebSocketProvider } from './context/WebSocketContext';
import Header from './components/Header';
import useWebSocketStore from './services/websocket';

function AppContent() {
  const [isOnline, setIsOnline] = useState(false);
  const { connect, disconnect } = useWebSocketStore();
  const { currentUser } = useUser();

  const handleGoOnline = () => {
    if (currentUser) {
      connect(currentUser.id);
      setIsOnline(true);
    }
  };

  const handleGoOffline = () => {
    disconnect();
    setIsOnline(false);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <WebSocketProvider isConnected={isOnline}>
      <NotificationProvider>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <main className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <UserSelection />
                  <div className="mt-4">
                    {!isOnline ? (
                      <button
                        onClick={handleGoOnline}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Go Online
                      </button>
                    ) : (
                      <button
                        onClick={handleGoOffline}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Go Offline
                      </button>
                    )}
                    {isOnline && (
                      <span className="ml-3 text-green-600 inline-flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                        Connected
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <PostsList />
                </div>
              </div>
              <div>
                <NotificationPanel />
              </div>
            </div>
          </main>
        </div>
      </NotificationProvider>
    </WebSocketProvider>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;