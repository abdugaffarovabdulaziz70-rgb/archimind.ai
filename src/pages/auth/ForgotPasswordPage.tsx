import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, Button } from '../../components/ui';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-luxury-black">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md"
        >
          <div className="card-luxury p-8 lg:p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Check Your Email</h2>
            <p className="text-luxury-silver mb-8">
              We've sent a password reset link to <span className="text-gold-400">{email}</span>
            </p>
            <Link to="/login">
              <Button variant="secondary" className="w-full" icon={<ArrowLeft size={18} />}>
                Back to Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-luxury-black">
      {/* Background Effects */}
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
          {/* Header */}
          <div className="text-center mb-8">
            <Logo size="lg" className="justify-center mb-6" />
            <h1 className="text-2xl font-display font-bold mb-2">Reset Password</h1>
            <p className="text-luxury-silver">Enter your email to receive a reset link</p>
          </div>

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
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury pl-12"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<Send size={18} />}>
              Send Reset Link
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
