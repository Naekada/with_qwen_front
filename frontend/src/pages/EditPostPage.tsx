import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Edit2 } from 'lucide-react';
import { getPostById, updatePost } from '@/api/posts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const post = await getPostById(parseInt(id));

        if (user?.id !== post.author_id && user?.role !== 'admin') {
          setUnauthorized(true);
          return;
        }

        setTitle(post.title);
        setDescription(post.description || '');
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error('Please enter a title');
      return;
    }

    if (title.length > 200) {
      error('Title must be less than 200 characters');
      return;
    }

    setIsSaving(true);
    try {
      await updatePost(parseInt(id!), {
        title: title.trim(),
        description: description.trim() || undefined,
      });
      success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <EmptyState
          emoji="🔍"
          title="Post not found"
          description="The post you're trying to edit doesn't exist."
          action={
            <Link to="/" className="btn-primary">
              Back to Feed
            </Link>
          }
        />
      </Layout>
    );
  }

  if (unauthorized) {
    return (
      <Layout>
        <EmptyState
          emoji="🚫"
          title="Unauthorized"
          description="You don't have permission to edit this post."
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-primary-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-warm-charcoal dark:text-primary-50" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-warm-charcoal dark:text-primary-50 flex items-center gap-2">
              <Edit2 className="text-coral-500" size={28} />
              Edit Post
            </h1>
            <p className="text-warm-charcoal/70 dark:text-primary-50/70 mt-1">
              Update your post content
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <div className="flex flex-col gap-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-warm-charcoal dark:text-primary-50 mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Give your post a catchy title..."
                maxLength={200}
                disabled={isSaving}
              />
              <p className="text-sm text-warm-charcoal/50 dark:text-primary-50/50 mt-1 text-right">
                {title.length}/200
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-warm-charcoal dark:text-primary-50 mb-2"
              >
                Content
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field resize-none"
                placeholder="Write your post content here..."
                rows={8}
                disabled={isSaving}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
