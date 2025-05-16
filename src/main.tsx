import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './mock/mockSocket.ts'; // Import mock WebSocket implementation

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);