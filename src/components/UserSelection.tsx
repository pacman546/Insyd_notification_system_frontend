import React from 'react';
import { useUser } from '../context/UserContext';
import { User } from '../types';
import { UserCircle2 } from 'lucide-react';
import useWebSocketStore from '../services/websocket';

const UserSelection = () => {
  const { users, currentUser, setCurrentUser } = useUser();
  const { isConnected } = useWebSocketStore();

  const handleUserChange = (userId: string) => {
    if (isConnected) return; // Don't allow user change when connected
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setCurrentUser(selectedUser);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-medium mb-3">Current User</h2>
      <div className="flex space-x-4">
        {users.map((user: User) => (
          <div
            key={user.id}
            onClick={() => handleUserChange(user.id)}
            className={`flex items-center p-3 rounded-md transition-colors ${
              currentUser.id === user.id
                ? 'bg-slate-100 border-slate-300 border'
                : isConnected
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-slate-50 border border-transparent cursor-pointer'
            }`}
          >
            <UserCircle2 className="h-6 w-6 mr-2 text-slate-700" />
            <span className={`font-medium ${currentUser.id === user.id ? 'text-slate-800' : 'text-slate-600'}`}>
              {user.name}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-slate-500">
        Acting as <span className="font-medium">{currentUser.name}</span>
        {isConnected && <span className="ml-2 text-red-500">(Please disconnect to change user)</span>}
      </div>
    </div>
  );
};

export default UserSelection;