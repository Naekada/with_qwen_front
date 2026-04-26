import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-float">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 hover:bg-primary-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <X size={20} className="text-warm-charcoal/70 dark:text-primary-50/70" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div
            className={`p-3 rounded-full ${
              variant === 'danger'
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            }`}
          >
            <AlertTriangle
              size={24}
              className={variant === 'danger' ? 'text-red-500' : 'text-yellow-500'}
            />
          </div>
          <h3 className="text-xl font-bold text-warm-charcoal dark:text-primary-50">
            {title}
          </h3>
        </div>

        <p className="text-warm-charcoal/70 dark:text-primary-50/70 mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
