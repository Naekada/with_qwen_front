import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import type { Post, User } from '@/types';
import { getFeed } from '@/api/posts';
import { getUserById } from '@/api/users';
import { getCommentsByPost } from '@/api/comments';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

interface PostWithMeta extends Post {
  author?: User;
  commentCount?: number;
}

export function FeedPage() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const { isAuthenticated } = useAuth();
  const { error } = useToast();

  const fetchPosts = useCallback(async (cursorId?: number, append = false) => {
    try {
      const fetchedPosts = await getFeed(cursorId, 10);

      if (fetchedPosts.length < 10) {
        setHasMore(false);
      }

      if (fetchedPosts.length > 0) {
        setCursor(fetchedPosts[fetchedPosts.length - 1].id);
      }

      // Fetch authors and comment counts
      const postsWithMeta = await Promise.all(
        fetchedPosts.map(async (post) => {
          try {
            const [author, comments] = await Promise.all([
              getUserById(post.author_id).catch(() => undefined),
              getCommentsByPost(post.id).catch(() => []),
            ]);
            return { ...post, author, commentCount: comments.length };
          } catch {
            return { ...post, commentCount: 0 };
          }
        })
      );

      if (append) {
        setPosts((prev) => [...prev, ...postsWithMeta]);
      } else {
        setPosts(postsWithMeta);
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to load posts');
    }
  }, [error]);

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      await fetchPosts();
      setIsLoading(false);
    };
    loadInitial();
  }, [fetchPosts]);

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchPosts(cursor, true);
    setIsLoadingMore(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setCursor(undefined);
    setHasMore(true);
    await fetchPosts();
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-warm-charcoal dark:text-primary-50">
              Feed
            </h1>
            <p className="text-warm-charcoal/70 dark:text-primary-50/70 mt-1">
              Discover the latest posts from the community
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-primary-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw
              size={20}
              className={`text-coral-500 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="📝"
            title="No posts yet"
            description="Be the first to share something with the community!"
            action={
              isAuthenticated ? (
                <Link to="/create-post" className="btn-primary">
                  Create First Post
                </Link>
              ) : (
                <Link to="/register" className="btn-primary">
                  Sign Up to Post
                </Link>
              )
            }
          />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  author={post.author}
                  commentCount={post.commentCount}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="btn-secondary flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-coral-500/30 border-t-coral-500 rounded-full animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* Floating Action Button */}
        {isAuthenticated && (
          <Link
            to="/create-post"
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 via-coral-500 to-sunny-400 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Plus size={24} className="text-white" />
          </Link>
        )}
      </div>
    </Layout>
  );
}
