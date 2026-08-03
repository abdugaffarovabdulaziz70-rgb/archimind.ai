import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
