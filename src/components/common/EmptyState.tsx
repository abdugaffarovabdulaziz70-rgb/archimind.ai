import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center text-center px-6 py-20 ${className}`}
    >
      <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6 text-gold-400">
        {icon}
      </div>
      <h3 className="text-2xl font-display font-bold mb-3 text-luxury-pearl">{title}</h3>
      <p className="text-luxury-silver max-w-md mb-8 leading-relaxed">{description}</p>
      {action}
    </motion.div>
  );
}
