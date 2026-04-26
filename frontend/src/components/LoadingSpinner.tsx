import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 40,
  className = '',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2
      size={size}
      className={`animate-spin text-coral-500 ${className}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary-50/80 dark:bg-warm-charcoal/80 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
