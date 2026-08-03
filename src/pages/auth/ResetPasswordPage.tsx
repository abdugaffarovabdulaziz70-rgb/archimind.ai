import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, Button } from '../../components/ui';

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    }
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
        <div className="card-luxury p-8 lg:p-10">
          <div className="text-center mb-8">
            <Logo size="lg" className="justify-center mb-6" />
            <h1 className="text-2xl font-display font-bold mb-2">Set New Password</h1>
            <p className="text-luxury-silver">Enter your new password below</p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-400" />
              </div>
              <h2 className="text-xl font-display font-bold mb-2">Password Updated!</h2>
              <p className="text-luxury-silver mb-6">Redirecting you to your dashboard...</p>
              <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-luxury pl-12 pr-12"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-silver hover:text-gold-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-luxury pl-12"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" loading={loading} icon={<ArrowRight size={18} />}>
                  Update Password
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
