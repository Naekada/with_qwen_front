import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { postsApi } from '../../api/posts';
import { useAuth } from '../../contexts/AuthContext';
import type { Post } from '../../types';

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsApi.getMyPosts();
      setPosts(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postsApi.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Posts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your published content</p>
          </div>
          <Link
            to="/create-post"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText size={20} />
            New Post
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start sharing your thoughts with the community!</p>
          <Link
            to="/create-post"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {post.title}
              </h3>
              
              {post.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.description}
                </p>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                Created: {new Date(post.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/post/${post.id}`}
                  className="flex-1 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium text-center"
                >
                  View
                </Link>
                <Link
                  to={`/edit-post/${post.id}`}
                  className="py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
