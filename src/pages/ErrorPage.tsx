import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Logo, Button } from '../components/ui';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

interface ErrorPageProps {
  errorCode?: number;
  title?: string;
  message?: string;
}

export function ErrorPage({
  errorCode = 500,
  title = 'Something Went Wrong',
  message = "We encountered an unexpected error. Our team has been notified and we're working to fix it."
}: ErrorPageProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-luxury-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-red-500/3 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg text-center"
      >
        <Logo size="lg" className="justify-center mb-8" />

        {/* Error Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <span className="text-[120px] md:text-[160px] font-display font-bold text-red-500/10 select-none">
              {errorCode}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={48} className="text-red-400" />
              </div>
            </div>
          </div>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-red-400">
          {title}
        </h1>
        <p className="text-luxury-silver mb-8 max-w-md mx-auto">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleRefresh}
            icon={<RefreshCw size={18} />}
          >
            Try Again
          </Button>
          <Link to="/">
            <Button variant="primary" size="lg" icon={<Home size={18} />}>
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Contact Support */}
        <div className="p-4 rounded-xl bg-luxury-charcoal/50 border border-gold-500/10">
          <p className="text-sm text-luxury-silver mb-2">
            If this problem persists, please contact our support team.
          </p>
          <a
            href="mailto:support@archimind.ai"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm"
          >
            <Mail size={16} />
            support@archimind.ai
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export function ServerErrorPage() {
  return (
    <ErrorPage
      errorCode={500}
      title="Server Error"
      message="Our servers are experiencing some difficulties. Please try again in a few moments."
    />
  );
}

export function NetworkErrorPage() {
  return (
    <ErrorPage
      errorCode={503}
      title="Connection Error"
      message="Unable to connect to our servers. Please check your internet connection and try again."
    />
  );
}
