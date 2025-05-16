import { Post, LikePayload } from '../types';

const API_BASE_URL = 'https://insydnotificationsystem-backend-production.up.railway.app';

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const likePost = async (payload: LikePayload): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Failed to like post: ${response.status} - ${errorBody.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending like:', error);
    throw error;
  }
};
