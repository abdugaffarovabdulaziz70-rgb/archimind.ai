import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading, icon, className = '', disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-500/40';

    const variants = {
      primary: 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white shadow-lg shadow-accent-500/20',
      secondary: 'bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-ink-100 hover:bg-ink-200 dark:hover:bg-ink-700',
      ghost: 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100',
      outline: 'border border-ink-300 dark:border-ink-700 text-ink-900 dark:text-ink-100 hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" role="status" aria-label="Loading">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
