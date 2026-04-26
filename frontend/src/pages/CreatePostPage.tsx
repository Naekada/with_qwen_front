import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createPost } from '@/api/posts';
import { useToast } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';

const FIRST_POST_KEY = 'has_created_first_post';

export function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { success, error } = useToast();

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF6B6B', '#FF8E53', '#FFD93D', '#4ECDC4'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF6B6B', '#FF8E53', '#FFD93D', '#4ECDC4'],
      });
    }, 250);
  };

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

    setIsLoading(true);
    try {
      await createPost(title.trim(), description.trim() || undefined);
      
      // Check if this is the first post
      const hasCreatedFirstPost = localStorage.getItem(FIRST_POST_KEY);
      if (!hasCreatedFirstPost) {
        localStorage.setItem(FIRST_POST_KEY, 'true');
        triggerConfetti();
        success('Congratulations on your first post!');
      } else {
        success('Post created successfully!');
      }
      
      setTimeout(() => {
        navigate('/');
      }, hasCreatedFirstPost ? 0 : 1500);
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

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
              <Sparkles className="text-sunny-400" size={28} />
              Create Post
            </h1>
            <p className="text-warm-charcoal/70 dark:text-primary-50/70 mt-1">
              Share your thoughts with the community
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
