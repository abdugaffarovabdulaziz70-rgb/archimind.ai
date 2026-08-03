import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'busy';
}

export function Avatar({ src, alt = 'User', size = 'md', className = '', status }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 32,
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <motion.div
      className={`relative ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`
          ${sizes[size]} rounded-full overflow-hidden flex items-center justify-center
          bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600
          ring-2 ring-gold-500/30
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <User size={iconSizes[size]} className="text-luxury-black" />
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full ring-2 ring-luxury-charcoal`}
        />
      )}
    </motion.div>
  );
}
