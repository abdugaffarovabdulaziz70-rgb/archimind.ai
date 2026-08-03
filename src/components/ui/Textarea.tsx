import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-5 py-4 rounded-2xl
            bg-luxury-charcoal/50 border border-gold-500/10
            focus:outline-none focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/20
            transition-all duration-300 placeholder:text-luxury-silver/40
            text-luxury-pearl resize-none
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-2 text-sm text-luxury-silver/50">{hint}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
