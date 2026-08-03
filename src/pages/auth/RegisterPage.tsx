import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, Button } from '../../components/ui';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, user, loading: authLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  // Get initial prompt from navigation state if available
  const initialPrompt = (location.state as { initialPrompt?: string })?.initialPrompt || '';

  // Check if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const passwordRequirements = [
    { met: password.length >= 6, text: 'At least 6 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ];

  const validateForm = (): string | null => {
    if (!fullName.trim()) {
      return 'Please enter your full name';
    }
    if (!email.trim()) {
      return 'Please enter your email address';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    console.log('[Register] Attempting sign up for:', email.trim().toLowerCase());

    const result = await signUp(email.trim(), password, fullName.trim());

    if (result.error) {
      console.error('[Register] Sign up error:', result.error);
      setError(result.error.message);
      setLoading(false);
    } else {
      console.log('[Register] Sign up result:', {
        hasUser: !!result.data?.user,
        hasSession: !!result.data?.session,
        needsEmailConfirmation: result.data?.needsEmailConfirmation
      });
      // Check if email confirmation is required
      if (result.data?.needsEmailConfirmation) {
        console.log('[Register] Email confirmation required');
        setNeedsEmailConfirmation(true);
        setRegistrationSuccess(true);
        setLoading(false);
      } else {
        // User is immediately signed in
        console.log('[Register] User signed in immediately');
        setRegistrationSuccess(true);
        // Navigation will happen via useEffect watching user state
      }
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
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

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-luxury-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md"
        >
          <div className="card-luxury p-8 lg:p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-400" />
            </div>

            {needsEmailConfirmation ? (
              <>
                <h2 className="text-2xl font-display font-bold mb-4">Check Your Email</h2>
                <p className="text-luxury-silver mb-6">
                  We've sent a confirmation link to{' '}
                  <span className="text-gold-400 font-medium">{email}</span>
                </p>
                <p className="text-sm text-luxury-silver/70 mb-6">
                  Click the link in the email to verify your account and start creating architectural designs.
                </p>
                <Link to="/login">
                  <Button variant="primary" className="w-full">
                    Continue to Sign In
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-display font-bold mb-4">Account Created!</h2>
                <p className="text-luxury-silver mb-2">
                  Your account has been created successfully.
                </p>
                <p className="text-sm text-luxury-silver/70 mb-6">
                  Redirecting to your dashboard...
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-luxury-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-[120px]" />
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
            <h1 className="text-2xl font-display font-bold mb-2">Start Designing</h1>
            <p className="text-luxury-silver">Create your account to bring your architectural vision to life</p>
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

          {initialPrompt && (
            <div className="mb-6 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
              <p className="text-sm text-gold-400">Your project prompt will be saved after registration</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-luxury pl-12"
                required
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury pl-12"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury pl-12 pr-12"
                required
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-silver hover:text-gold-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="flex flex-wrap gap-2">
                {passwordRequirements.map((req, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                      req.met
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-luxury-charcoal/50 text-luxury-silver border border-gold-500/10'
                    }`}
                  >
                    {req.met && <Check size={12} />}
                    {req.text}
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-luxury pl-12"
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-gold-500/30 bg-luxury-charcoal text-gold-500 focus:ring-gold-500/30"
              />
              <label htmlFor="terms" className="text-sm text-luxury-silver">
                I agree to the{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              disabled={loading}
              icon={<ArrowRight size={18} />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-luxury-silver text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
