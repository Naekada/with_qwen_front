import { useState, useEffect } from 'react';
import type { Comment, User } from '@/types';
import { CommentItem } from './CommentItem';
import { getUserById } from '@/api/users';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface CommentListProps {
  comments: Comment[];
  onCommentUpdate?: (comment: Comment) => void;
  onCommentDelete?: (commentId: number) => void;
}

export function CommentList({ comments, onCommentUpdate, onCommentDelete }: CommentListProps) {
  const [authors, setAuthors] = useState<Record<number, User>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      const uniqueAuthorIds = [...new Set(comments.map((c) => c.author_id))];
      const authorPromises = uniqueAuthorIds.map(async (id) => {
        try {
          const user = await getUserById(id);
          return [id, user] as [number, User];
        } catch {
          return [id, null] as [number, null];
        }
      });

      const results = await Promise.all(authorPromises);
      const authorMap: Record<number, User> = {};
      results.forEach(([id, user]) => {
        if (user) authorMap[id] = user;
      });

      setAuthors(authorMap);
      setIsLoading(false);
    };

    if (comments.length > 0) {
      fetchAuthors();
    } else {
      setIsLoading(false);
    }
  }, [comments]);

  if (isLoading && comments.length > 0) {
    return <LoadingSpinner size={24} />;
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        emoji="💬"
        title="No comments yet"
        description="Be the first to share your thoughts!"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          author={authors[comment.author_id]}
          onUpdate={onCommentUpdate}
          onDelete={onCommentDelete}
        />
      ))}
    </div>
  );
}
