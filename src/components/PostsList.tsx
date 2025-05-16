import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { Post } from '../types';
import { fetchPosts } from '../services/api';
import { Loader2 } from 'lucide-react';

const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Posts</h2>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-slate-500">
            No posts found.
          </div>
        ) : (
          posts.map((post) => <PostItem key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default PostsList;