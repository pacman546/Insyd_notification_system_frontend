# Insyd Notification System Frontend

A real-time notification system frontend built for the Insyd Architecture Community platform. This application demonstrates WebSocket integration for real-time notifications with acknowledgment functionality.

## Features

- Real-time notifications via WebSocket connection
- User selection and online/offline status management
- Notification acknowledgment system
- Clean, modern UI with Tailwind CSS
- Responsive layout with scrollable posts and notifications sections
- Automatic WebSocket reconnection handling

## Tech Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Lucide React icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── NotificationPanel.tsx
│   │   ├── PostsList.tsx
│   │   ├── PostItem.tsx
│   │   └── UserSelection.tsx
│   ├── context/            # React Context providers
│   │   ├── UserContext.tsx
│   │   └── NotificationContext.tsx
│   ├── services/          # Services and utilities
│   │   └── websocket.ts   # WebSocket service
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
```

## WebSocket Integration

The application uses WebSocket for real-time notifications with the following features:

### Connection Management
- Secure WebSocket connection (WSS)
- Automatic reconnection on disconnection
- User authentication on connection
- Connection status tracking

### Message Types
1. Authentication Message:
   ```typescript
   {
     type: 'AUTH',
     userId: string
   }
   ```

2. Notification Message:
   ```typescript
   {
     type: 'NOTIFICATION',
     payload: {
       toUserId: string,
       message: string,
       eventType: string,
       timestamp: string,
       notificationId: string,
       status: string
     }
   }
   ```

3. Acknowledgment Message:
   ```typescript
   {
     type: 'ACK',
     notificationId: string
   }
   ```

### State Management
The application uses Zustand for state management with the following store:

```typescript
interface WebSocketStore {
  socket: WebSocket | null;
  notifications: Notification[];
  isConnected: boolean;
  connect: (userId: string) => void;
  disconnect: () => void;
  sendAck: (notificationId: string) => void;
}
```

## Deployment

The application is configured for deployment with the following commands:

- Build: `npm run build`
- Output Directory: `dist`
- Install Dependencies: `npm install`

## How to Use the App 

You can test the real-time notification system using two sample users: **Alex** and **Jiri**. Follow these steps:

1. **Go online as Alex**  
   Open the app and select "Alex" from the user list to connect via WebSocket.

2. **Like a post by Jiri**  
   Perform an action such as liking a post authored by Jiri.

3. **Go offline as Alex, then go online as Jiri**  
   Disconnect Alex and switch to Jiri as the active user.

4. **View the notification**  
   Jiri will receive a notification. You can **acknowledge** it by clicking on it, or leave it unacknowledged.

> You can reverse the flow to send a notification from Jiri to Alex as well.

This flow demonstrates the async queuing, Redis buffering, and real-time delivery powered by WebSockets.

## Environment Variables

No environment variables are required as the WebSocket URL is hardcoded for the production environment
