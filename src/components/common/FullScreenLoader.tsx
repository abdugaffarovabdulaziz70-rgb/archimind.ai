import { motion } from 'framer-motion';
import { Logo } from '../ui';

interface FullScreenLoaderProps {
  label?: string;
}

export function FullScreenLoader({ label = 'Loading...' }: FullScreenLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full mb-6"
        role="status"
        aria-label={label}
      />
      <Logo size="sm" className="mb-3" />
      <p className="text-luxury-silver text-sm">{label}</p>
    </div>
  );
}
