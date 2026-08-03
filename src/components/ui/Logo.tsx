import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 font-bold text-xl ${className}`} aria-label="ArchiMind AI home">
      <motion.div whileHover={{ scale: 1.05 }} className="relative">
        <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" className="fill-accent-500" />
          <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="white" fillOpacity="0.9" />
          <path d="M20 14L24 16.5V23.5L20 26L16 23.5V16.5L20 14Z" className="fill-accent-500" />
        </svg>
      </motion.div>
      <span className="text-ink-900 dark:text-white font-bold tracking-tight">
        Archi<span className="gradient-text">Mind</span>
      </span>
    </Link>
  );
}
