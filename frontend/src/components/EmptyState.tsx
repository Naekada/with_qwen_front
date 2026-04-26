interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  emoji = '📭',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-6xl mb-4 animate-bounce-slow">{emoji}</span>
      <h3 className="text-xl font-bold text-warm-charcoal dark:text-primary-50 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-warm-charcoal/70 dark:text-primary-50/70 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
