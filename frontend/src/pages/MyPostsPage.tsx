import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Clock, MessageCircle } from 'lucide-react';
import type { Post, Comment } from '@/types';
import { getMyPosts, deletePost } from '@/api/posts';
import { getCommentsByPost } from '@/api/comments';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmModal } from '@/components/ConfirmModal';

interface PostWithComments extends Post {
  commentCount: number;
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
  });
}

export function MyPostsPage() {
  const [posts, setPosts] = useState<PostWithComments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getMyPosts();
        
        const postsWithComments = await Promise.all(
          fetchedPosts.map(async (post) => {
            try {
              const comments = await getCommentsByPost(post.id);
              return { ...post, commentCount: comments.length };
            } catch {
              return { ...post, commentCount: 0 };
            }
          })
        );
        
        setPosts(postsWithComments);
      } catch {
        // No posts found is not an error
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!deletePostId) return;

    setIsDeleting(true);
    try {
      await deletePost(deletePostId);
      setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
      success('Post deleted');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setDeletePostId(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-warm-charcoal dark:text-primary-50">
              My Posts
            </h1>
            <p className="text-warm-charcoal/70 dark:text-primary-50/70 mt-1">
              Manage your published content
            </p>
          </div>
          <Link to="/create-post" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span className="hidden sm:inline">New Post</span>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="✍️"
            title="No posts yet"
            description="Start sharing your thoughts with the community!"
            action={
              <Link to="/create-post" className="btn-primary">
                Create Your First Post
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="card hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <Link to={`/post/${post.id}`} className="flex-1 group">
                    <h2 className="text-xl font-bold text-warm-charcoal dark:text-primary-50 group-hover:text-coral-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-warm-charcoal/70 dark:text-primary-50/70 mt-2 line-clamp-2">
                      {post.description || 'No content'}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-warm-charcoal/60 dark:text-primary-50/60">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatRelativeTime(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        {post.commentCount} comments
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/edit-post/${post.id}`}
                      className="p-2 hover:bg-primary-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} className="text-coral-500" />
                    </Link>
                    <button
                      onClick={() => setDeletePostId(post.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletePostId !== null}
        title="Delete Post"
        message="Are you sure you want to delete this post? All comments will also be deleted."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeletePostId(null)}
        isLoading={isDeleting}
      />
    </Layout>
  );
}
