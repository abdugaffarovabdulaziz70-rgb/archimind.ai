import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, Button } from '../../components/ui';

export function EmailVerificationPage() {
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (user?.email_confirmed_at) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleCheckVerification = async () => {
    setChecking(true);
    await refreshSession();
    setChecking(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-luxury-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="card-luxury p-8 lg:p-10 text-center">
          <Logo size="lg" className="justify-center mb-6" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <MailCheck size={40} className="text-gold-400" />
          </motion.div>

          <h1 className="text-2xl font-display font-bold mb-3">Verify Your Email</h1>
          <p className="text-luxury-silver mb-2">
            We've sent a verification link to
          </p>
          <p className="text-gold-400 font-medium mb-6">{user?.email}</p>

          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={checking}
              onClick={handleCheckVerification}
              icon={<RefreshCw size={18} />}
            >
              I've Verified My Email
            </Button>

            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full" icon={<ArrowRight size={18} />}>
                Continue to Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gold-500/10">
            <p className="text-sm text-luxury-silver mb-2">Didn't receive an email?</p>
            <Link to="/contact" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
              Contact Support
            </Link>
          </div>

          <div className="mt-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-luxury-silver hover:text-gold-400 transition-colors">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
