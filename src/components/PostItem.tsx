import React, { useState } from 'react';
import { Post } from '../types';
import { useUser } from '../context/UserContext';
import { likePost } from '../services/api';
import { Heart } from 'lucide-react';

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
  const { users, currentUser } = useUser();
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeFeedback, setLikeFeedback] = useState(false);

  const authorMap: Record<string, string> = {
  '6826afb70532ad567ffdcf2b': 'Alex',
  '6826afb70532ad567ffdcf2c': 'Jiri',
};

const authorId = post.author?._id;
const authorName = authorMap[authorId] || 'Unknown User';
  
 const handleLike = async () => {
  if (!post?.author?._id) {
    console.error('Post author is missing, cannot like');
    return;
  }

  try {
    setIsLiking(true);
    console.log('Payload for likePost:', {
      actorId: currentUser.id,
      targetId: post.author._id,
      postId: post._id,
      type: 'LIKE',
    });
    await likePost({
      actorId: currentUser.id,
      targetId: post.author._id,
      postId: post._id,
      type: 'LIKE',
    });
    setIsLiked(true);

    // Show feedback that like was successful
    setLikeFeedback(true);
    setTimeout(() => setLikeFeedback(false), 2000);
  } catch (err) {
    console.error('Failed to like post:', err);
  } finally {
    setIsLiking(false);
  }
};

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-2">{post.title}</h3>
      <p className="text-slate-600 mb-4">{post.content}</p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          Posted by <span className="font-medium">{authorName}</span>
        </div>
        <button
          onClick={handleLike}
          disabled={isLiking || currentUser.id === post.createdBy}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            currentUser.id === post.createdBy
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : likeFeedback
              ? 'bg-red-50 text-red-500'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
<span>{isLiking ? 'Liking...' : isLiked ? 'Liked' : 'Like'}</span>
        </button>
      </div>
    </div>
  );
};

export default PostItem;
