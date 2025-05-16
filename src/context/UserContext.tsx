import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const defaultUsers: User[] = [
  { id: '68275e2c9ec55e236d6151a6', name: 'Alex' },
  { id: '68275e2c9ec55e236d6151a7', name: 'Jiri' },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users] = useState<User[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  return (
    <UserContext.Provider value={{ users, currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};
