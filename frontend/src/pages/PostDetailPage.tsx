import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Send, Clock, User as UserIcon } from 'lucide-react';
import type { Post, User, Comment } from '@/types';
import { getPostById, deletePost } from '@/api/posts';
import { getUserById } from '@/api/users';
import { getCommentsByPost, createComment } from '@/api/comments';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';
import { CommentList } from '@/components/CommentList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ConfirmModal } from '@/components/ConfirmModal';
import { EmptyState } from '@/components/EmptyState';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.id === post?.author_id;
  const isAdmin = user?.role === 'admin';
  const canModify = isAuthor || isAdmin;

  const fetchData = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const postData = await getPostById(parseInt(id));
      setPost(postData);

      const [authorData, commentsData] = await Promise.all([
        getUserById(postData.author_id).catch(() => null),
        getCommentsByPost(postData.id).catch(() => []),
      ]);

      setAuthor(authorData);
      setComments(commentsData);
    } catch (err) {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    if (newComment.length > 300) {
      error('Comment must be less than 300 characters');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const comment = await createComment(post!.id, newComment.trim());
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
      success('Comment added');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentUpdate = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );
  };

  const handleCommentDelete = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleDeletePost = async () => {
    if (!post) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      success('Post deleted');
      navigate('/');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout>
        <EmptyState
          emoji="🔍"
          title="Post not found"
          description="The post you're looking for doesn't exist or has been deleted."
          action={
            <Link to="/" className="btn-primary">
              Back to Feed
            </Link>
          }
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-warm-charcoal/70 dark:text-primary-50/70 hover:text-coral-500 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Post Content */}
        <article className="card mb-8">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to={author ? `/profile/${author.id}` : '#'}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-coral-500 flex items-center justify-center text-white font-bold">
                {author?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold text-warm-charcoal dark:text-primary-50">
                  {author?.username || 'Unknown User'}
                </p>
                <p className="text-sm text-warm-charcoal/60 dark:text-primary-50/60 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(post.created_at)}
                </p>
              </div>
            </Link>

            {canModify && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit-post/${post.id}`}
                  className="p-2 hover:bg-primary-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} className="text-coral-500" />
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-warm-charcoal dark:text-primary-50 mb-4">
            {post.title}
          </h1>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-warm-charcoal/80 dark:text-primary-50/80 whitespace-pre-wrap leading-relaxed">
              {post.description || 'No content'}
            </p>
          </div>
        </article>

        {/* Comments Section */}
        <section>
          <h2 className="text-xl font-bold text-warm-charcoal dark:text-primary-50 mb-4">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="card mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-coral-400 to-sunny-400 flex items-center justify-center text-white font-semibold shrink-0">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Write a comment..."
                    rows={3}
                    maxLength={300}
                    disabled={isSubmittingComment}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-warm-charcoal/50 dark:text-primary-50/50">
                      {newComment.length}/300
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="btn-primary flex items-center gap-2 text-sm py-2"
                    >
                      {isSubmittingComment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Post</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="card mb-6 text-center py-8">
              <p className="text-warm-charcoal/70 dark:text-primary-50/70 mb-4">
                Sign in to leave a comment
              </p>
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <CommentList
            comments={comments}
            onCommentUpdate={handleCommentUpdate}
            onCommentDelete={handleCommentDelete}
          />
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Post"
        message="Are you sure you want to delete this post? All comments will also be deleted. This action cannot be undone."
        confirmText="Delete Post"
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </Layout>
  );
}
