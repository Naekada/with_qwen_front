import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Trash2, User as UserIcon, Mail, Calendar, Search } from 'lucide-react';
import type { User } from '@/types';
import { getUsers, deleteUser } from '@/api/users';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmModal } from '@/components/ConfirmModal';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user: currentUser } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (err) {
        error(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [error]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleDelete = async () => {
    if (!deleteUserId) return;

    setIsDeleting(true);
    try {
      await deleteUser(deleteUserId);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      success('User deleted successfully');
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
    }
  };

  const userToDelete = users.find((u) => u.id === deleteUserId);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sunny-100 dark:bg-sunny-900/30 rounded-xl">
              <Shield size={24} className="text-sunny-600 dark:text-sunny-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-warm-charcoal dark:text-primary-50">
                Admin Panel
              </h1>
              <p className="text-warm-charcoal/70 dark:text-primary-50/70">
                Manage users ({users.length} total)
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-charcoal/40 dark:text-primary-50/40"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
            placeholder="Search users by name or email..."
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            emoji="👥"
            title={searchQuery ? 'No users found' : 'No users'}
            description={
              searchQuery
                ? 'Try adjusting your search query.'
                : 'No users registered yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-100 dark:border-primary-900">
                  <th className="text-left py-4 px-4 text-warm-charcoal/70 dark:text-primary-50/70 font-semibold">
                    User
                  </th>
                  <th className="text-left py-4 px-4 text-warm-charcoal/70 dark:text-primary-50/70 font-semibold hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 text-warm-charcoal/70 dark:text-primary-50/70 font-semibold hidden md:table-cell">
                    Role
                  </th>
                  <th className="text-left py-4 px-4 text-warm-charcoal/70 dark:text-primary-50/70 font-semibold hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="text-right py-4 px-4 text-warm-charcoal/70 dark:text-primary-50/70 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-primary-50 dark:border-primary-900/50 hover:bg-primary-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <Link
                        to={`/profile/${user.id}`}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-coral-500 flex items-center justify-center text-white font-semibold shrink-0">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-warm-charcoal dark:text-primary-50">
                            {user.username}
                          </p>
                          <p className="text-sm text-warm-charcoal/60 dark:text-primary-50/60 sm:hidden">
                            {user.email}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="text-warm-charcoal/70 dark:text-primary-50/70">
                        {user.email}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      {user.role === 'admin' ? (
                        <span className="px-3 py-1 bg-sunny-100 dark:bg-sunny-900/30 text-sunny-700 dark:text-sunny-300 text-sm font-semibold rounded-full">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold rounded-full">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <span className="text-warm-charcoal/70 dark:text-primary-50/70">
                        {formatDate(user.created_at)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/profile/${user.id}`}
                          className="p-2 hover:bg-primary-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <UserIcon size={18} className="text-coral-500" />
                        </Link>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeleteUserId(user.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteUserId !== null}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.username}"? All their posts and comments will also be deleted.`}
        confirmText="Delete User"
        onConfirm={handleDelete}
        onCancel={() => setDeleteUserId(null)}
        isLoading={isDeleting}
      />
    </Layout>
  );
}
