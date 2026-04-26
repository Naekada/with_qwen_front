import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Mail, Shield, FileText, Edit2, X, Save, User as UserIcon } from 'lucide-react';
import type { User, Post } from '@/types';
import { getUserById, updateUser } from '@/api/users';
import { getPostsByAuthor } from '@/api/posts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isOwnProfile = currentUser?.id === profileUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const userData = await getUserById(parseInt(id));
        setProfileUser(userData);
        setEditUsername(userData.username);
        setEditEmail(userData.email);

        try {
          const userPosts = await getPostsByAuthor(userData.id);
          setPosts(userPosts);
        } catch {
          setPosts([]);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSaveProfile = async () => {
    if (!profileUser) return;

    if (editUsername.length < 4 || editUsername.length > 24) {
      error('Username must be between 4 and 24 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      error('Please enter a valid email address');
      return;
    }

    if (editPassword && (editPassword.length < 6 || editPassword.length > 32)) {
      error('Password must be between 6 and 32 characters');
      return;
    }

    setIsSaving(true);
    try {
      const updateData: { username?: string; email?: string; password?: string } = {};
      
      if (editUsername !== profileUser.username) {
        updateData.username = editUsername;
      }
      if (editEmail !== profileUser.email) {
        updateData.email = editEmail;
      }
      if (editPassword) {
        updateData.password = editPassword;
      }

      if (Object.keys(updateData).length === 0) {
        setIsEditModalOpen(false);
        return;
      }

      const updatedUser = await updateUser(profileUser.id, updateData);
      setProfileUser(updatedUser);
      await refreshUser();
      setIsEditModalOpen(false);
      setEditPassword('');
      success('Profile updated successfully!');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update profile');
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

  if (notFound || !profileUser) {
    return (
      <Layout>
        <EmptyState
          emoji="👤"
          title="User not found"
          description="The user you're looking for doesn't exist."
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
        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 via-coral-500 to-sunny-400 flex items-center justify-center text-4xl font-bold text-white shrink-0">
              {profileUser.username.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-warm-charcoal dark:text-primary-50">
                  {profileUser.username}
                </h1>
                {profileUser.role === 'admin' && (
                  <span className="px-3 py-1 bg-sunny-100 dark:bg-sunny-900/30 text-sunny-700 dark:text-sunny-300 text-sm font-semibold rounded-full flex items-center gap-1">
                    <Shield size={14} />
                    Admin
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 text-warm-charcoal/70 dark:text-primary-50/70">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} />
                  {profileUser.email}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar size={16} />
                  Joined {formatDate(profileUser.created_at)}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <FileText size={16} />
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-secondary flex items-center gap-2 mt-4 mx-auto md:mx-0"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <section>
          <h2 className="text-xl font-bold text-warm-charcoal dark:text-primary-50 mb-4">
            {isOwnProfile ? 'My Posts' : `${profileUser.username}'s Posts`}
          </h2>

          {posts.length === 0 ? (
            <EmptyState
              emoji="📝"
              title="No posts yet"
              description={
                isOwnProfile
                  ? 'Share your first thoughts with the community!'
                  : "This user hasn't posted anything yet."
              }
              action={
                isOwnProfile ? (
                  <Link to="/create-post" className="btn-primary">
                    Create Post
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} showAuthor={false} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-primary-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-warm-charcoal/70 dark:text-primary-50/70" />
            </button>

            <h3 className="text-xl font-bold text-warm-charcoal dark:text-primary-50 mb-6">
              Edit Profile
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-charcoal dark:text-primary-50 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="input-field"
                  placeholder="Username"
                  minLength={4}
                  maxLength={24}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-charcoal dark:text-primary-50 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="input-field"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-charcoal dark:text-primary-50 mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="input-field"
                  placeholder="New password"
                  minLength={6}
                  maxLength={32}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
