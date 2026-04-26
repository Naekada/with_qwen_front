import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  LoginPage,
  RegisterPage,
  FeedPage,
  CreatePostPage,
  PostDetailPage,
  EditPostPage,
  MyPostsPage,
  ProfilePage,
  AdminUsersPage,
} from '@/pages';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<FeedPage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />

      {/* Protected Routes */}
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-post/:id"
        element={
          <ProtectedRoute>
            <EditPostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-posts"
        element={
          <ProtectedRoute>
            <MyPostsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
