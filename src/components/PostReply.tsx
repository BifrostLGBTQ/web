import React from 'react';
import CreatePost from './CreatePost';

interface PostReplyProps {
  onReply?: (content: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const PostReply: React.FC<PostReplyProps> = ({ onReply, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <CreatePost 
      title="Reply" 
      canClose={true}
      onClose={onClose}
      placeholder="Write a reply..."
      buttonText="Reply"
    />
  );
};

export default PostReply;