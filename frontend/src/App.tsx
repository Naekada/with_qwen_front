import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import MyPostsPage from './pages/MyPostsPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';
import AboutPage from './pages/AboutPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/create-post" element={
          <ProtectedRoute>
            <Layout>
              <CreatePostPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/my-posts" element={
          <ProtectedRoute>
            <Layout>
              <MyPostsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/post/:id" element={
          <ProtectedRoute>
            <Layout>
              <PostDetailPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/edit-post/:id" element={
          <ProtectedRoute>
            <Layout>
              <EditPostPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile/:id" element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <Layout>
              <AdminUsersPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
