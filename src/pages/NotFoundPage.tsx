import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { PageLayout } from '../components/common';
import { Button } from '../components/ui';

export function NotFoundPage() {
  return (
    <PageLayout footer={false}>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <h1 className="text-8xl lg:text-9xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-3">Page not found</h2>
          <p className="text-ink-600 dark:text-ink-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/"><Button variant="primary" size="lg" icon={<Home size={18} />}>Back to Home</Button></Link>
            <Link to="/generate"><Button variant="secondary" size="lg" icon={<ArrowLeft size={18} />}>Go to Generate</Button></Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
