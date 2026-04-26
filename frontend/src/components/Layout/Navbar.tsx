import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Shield, FileText, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-neutral-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            SocialApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-warm-charcoal dark:text-primary-50 hover:text-coral-500 transition-colors"
            >
              <Home size={20} />
              <span>Feed</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-posts"
                className="flex items-center gap-2 text-warm-charcoal dark:text-primary-50 hover:text-coral-500 transition-colors"
              >
                <FileText size={20} />
                <span>My Posts</span>
              </Link>
            )}

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-100 to-coral-100 dark:from-primary-900 dark:to-coral-900 hover:shadow-md transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-coral-500 flex items-center justify-center text-white font-semibold">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-warm-charcoal dark:text-primary-50 font-medium">
                    {user?.username}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-primary-100 dark:border-primary-900 py-2 animate-float">
                    <Link
                      to={`/profile/${user?.id}`}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <User size={18} className="text-coral-500" />
                      <span className="text-warm-charcoal dark:text-primary-50">Profile</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/users"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <Shield size={18} className="text-sunny-500" />
                        <span className="text-warm-charcoal dark:text-primary-50">Admin Panel</span>
                      </Link>
                    )}

                    <hr className="my-2 border-primary-100 dark:border-primary-800" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-warm-charcoal dark:text-primary-50 hover:text-coral-500 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isMenuOpen ? (
              <X size={24} className="text-warm-charcoal dark:text-primary-50" />
            ) : (
              <Menu size={24} className="text-warm-charcoal dark:text-primary-50" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-100 dark:border-primary-800">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Home size={20} className="text-coral-500" />
                <span className="text-warm-charcoal dark:text-primary-50">Feed</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/my-posts"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FileText size={20} className="text-coral-500" />
                    <span className="text-warm-charcoal dark:text-primary-50">My Posts</span>
                  </Link>

                  <Link
                    to={`/profile/${user?.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <User size={20} className="text-coral-500" />
                    <span className="text-warm-charcoal dark:text-primary-50">Profile</span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/users"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Shield size={20} className="text-sunny-500" />
                      <span className="text-warm-charcoal dark:text-primary-50">Admin Panel</span>
                    </Link>
                  )}
                </>
              )}

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-warm-charcoal dark:text-primary-50">Theme</span>
                <ThemeToggle />
              </div>

              <hr className="my-2 border-primary-100 dark:border-primary-800" />

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-secondary text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
