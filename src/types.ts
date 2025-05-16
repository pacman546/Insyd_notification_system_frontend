export interface User {
  id: string;
  name: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
}

export interface LikePayload {
  actorId: string;
  targetId: string;
  postId: string;
  type: 'LIKE';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  status: string;
  acknowledged: boolean;
}