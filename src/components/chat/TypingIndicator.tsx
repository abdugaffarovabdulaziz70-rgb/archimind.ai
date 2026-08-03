import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 rounded-full bg-gold-500"
          animate={{
            y: [0, -6, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
}
