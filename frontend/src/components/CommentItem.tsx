import { useState } from 'react';
import { Edit2, Trash2, Check, X, Clock } from 'lucide-react';
import type { Comment, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { updateComment, deleteComment } from '@/api/comments';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmModal } from './ConfirmModal';

interface CommentItemProps {
  comment: Comment;
  author?: User;
  onUpdate?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
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

export function CommentItem({ comment, author, onUpdate, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isAuthor = user?.id === comment.author_id;
  const isAdmin = user?.role === 'admin';
  const canModify = isAuthor || isAdmin;

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await updateComment(comment.id, editContent.trim());
      onUpdate?.(updated);
      setIsEditing(false);
      success('Comment updated');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteComment(comment.id);
      onDelete?.(comment.id);
      success('Comment deleted');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to delete comment');
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-primary-50/50 dark:bg-neutral-700/50 rounded-xl p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-coral-400 to-sunny-400 flex items-center justify-center text-white text-sm font-semibold">
              {author?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-semibold text-warm-charcoal dark:text-primary-50 text-sm">
                {author?.username || 'Unknown User'}
              </p>
              <p className="text-xs text-warm-charcoal/60 dark:text-primary-50/60 flex items-center gap-1">
                <Clock size={10} />
                {formatRelativeTime(comment.created_at)}
                {comment.is_edited && (
                  <span className="ml-1 text-warm-charcoal/40 dark:text-primary-50/40">
                    (edited)
                  </span>
                )}
              </p>
            </div>
          </div>

          {canModify && !isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-primary-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={14} className="text-warm-charcoal/60 dark:text-primary-50/60" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input-field text-sm resize-none"
              rows={3}
              maxLength={300}
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                disabled={isSubmitting}
                className="p-2 hover:bg-primary-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              >
                <X size={16} className="text-warm-charcoal/60 dark:text-primary-50/60" />
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting || !editContent.trim()}
                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Check size={16} className="text-white" />
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-warm-charcoal dark:text-primary-50 text-sm whitespace-pre-wrap">
            {comment.content}
          </p>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isSubmitting}
      />
    </>
  );
}
