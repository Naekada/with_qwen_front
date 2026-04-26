import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-primary-100 dark:bg-neutral-800 hover:bg-primary-200 dark:hover:bg-neutral-700 transition-all duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-warm-charcoal" />
      ) : (
        <Sun size={20} className="text-sunny-300" />
      )}
    </button>
  );
}
