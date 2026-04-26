import { Link } from 'react-router-dom';
import { MessageCircle, Clock, User } from 'lucide-react';
import type { Post, User as UserType } from '@/types';

interface PostCardProps {
  post: Post;
  author?: UserType;
  commentCount?: number;
  showAuthor?: boolean;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function PostCard({ post, author, commentCount = 0, showAuthor = true }: PostCardProps) {
  const excerpt = post.description
    ? post.description.length > 150
      ? post.description.substring(0, 150) + '...'
      : post.description
    : 'No description';

  return (
    <Link to={`/post/${post.id}`} className="block group">
      <article className="card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
        <div className="flex flex-col gap-3">
          {/* Header with author info */}
          {showAuthor && author && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-coral-500 flex items-center justify-center text-white font-semibold">
                {author.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-warm-charcoal dark:text-primary-50">
                  {author.username}
                </p>
                <p className="text-sm text-warm-charcoal/60 dark:text-primary-50/60 flex items-center gap-1">
                  <Clock size={12} />
                  {formatRelativeTime(post.created_at)}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-warm-charcoal dark:text-primary-50 group-hover:text-coral-500 transition-colors">
            {post.title}
          </h2>

          {/* Content preview */}
          <p className="text-warm-charcoal/70 dark:text-primary-50/70 line-clamp-3">
            {excerpt}
          </p>

          {/* Footer with stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-primary-100 dark:border-primary-900">
            <div className="flex items-center gap-1 text-warm-charcoal/60 dark:text-primary-50/60">
              <MessageCircle size={16} />
              <span className="text-sm">{commentCount} comments</span>
            </div>

            {!showAuthor && (
              <div className="flex items-center gap-1 text-warm-charcoal/60 dark:text-primary-50/60">
                <Clock size={16} />
                <span className="text-sm">{formatRelativeTime(post.created_at)}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
