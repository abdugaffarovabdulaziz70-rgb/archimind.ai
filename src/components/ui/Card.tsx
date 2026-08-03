import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 transition-all duration-300 ${
        hover ? 'hover:border-accent-300 dark:hover:border-accent-700 hover:shadow-lg dark:hover:shadow-accent-900/20 hover:-translate-y-1 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
