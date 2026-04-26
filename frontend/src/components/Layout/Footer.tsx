import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-primary-100 dark:border-primary-900 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-charcoal/70 dark:text-primary-50/70 text-sm">
            {new Date().getFullYear()} SocialApp. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-warm-charcoal/70 dark:text-primary-50/70 text-sm">
            Made with
            <Heart size={16} className="text-primary-500 fill-primary-500 animate-pulse" />
            using React & FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
