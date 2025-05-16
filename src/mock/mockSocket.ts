/**
 * This file provides a mock WebSocket implementation for demo purposes,
 * simulating server responses locally.
 * 
 * In a real application, this would be replaced with a connection to the actual WebSocket server.
 */

export class MockWebSocket extends EventTarget {
  url: string;
  readyState: number = WebSocket.CONNECTING;
  CONNECTING: number = WebSocket.CONNECTING;
  OPEN: number = WebSocket.OPEN;
  CLOSING: number = WebSocket.CLOSING;
  CLOSED: number = WebSocket.CLOSED;
  
  private currentUserId: string | null = null;
  private mockPosts = [
    { id: 'post1', title: 'Minimalist Office Design', createdBy: '6826afb70532ad567ffdcf2b' }, // Bob
    { id: 'post2', title: 'Sustainable Urban Planning', createdBy: '1111' }, // Alice
    { id: 'post3', title: 'Innovative Residential Concepts', createdBy: '6826afb70532ad567ffdcf2b' }, // Bob
    { id: 'post4', title: 'Historic Preservation Techniques', createdBy: '1111' } // Alice
  ];

  constructor(url: string) {
    super();
    this.url = url;
    
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.dispatchEvent(new Event('open'));
    }, 500);
  }

  send(data: string): void {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'AUTH') {
        this.currentUserId = message.userId;
        console.log(`Mock WebSocket: User ${this.currentUserId} authenticated`);
      }
      else if (message.type === 'ACK') {
        console.log(`Mock WebSocket: Notification ${message.notificationId} acknowledged`);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  close(): void {
    this.readyState = WebSocket.CLOSING;
    
    setTimeout(() => {
      this.readyState = WebSocket.CLOSED;
      this.dispatchEvent(new Event('close'));
    }, 100);
  }

  // Method to simulate receiving a like notification
  simulateLikeNotification(actorId: string, actorName: string, postId: string): void {
    if (this.readyState !== WebSocket.OPEN || !this.currentUserId) return;
    
    const post = this.mockPosts.find(p => p.id === postId);
    if (!post || post.createdBy !== this.currentUserId) return;
    
    const notification = {
      type: 'NOTIFICATION',
      payload: {
        toUserId: this.currentUserId,
        message: `${actorName} liked your post titled '${post.title}'`,
        eventType: 'LIKE',
        timestamp: new Date().toISOString(),
        notificationId: `note-${Date.now()}`,
        status: 'pending'
      }
    };
    
    const event = new MessageEvent('message', {
      data: JSON.stringify(notification)
    });
    
    this.dispatchEvent(event);
  }
}

// Replace the real WebSocket with mock implementation in development
// if (import.meta.env.DEV) {
//   (window as any).OriginalWebSocket = window.WebSocket;
//   window.WebSocket = MockWebSocket as any;
// }