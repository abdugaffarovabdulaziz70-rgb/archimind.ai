import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Logo, Button } from '../ui';
import { Footer } from '../layout';

interface PublicPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export function PublicPageLayout({ children, title, subtitle, showBackButton = true }: PublicPageLayoutProps) {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-pearl">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Nav */}
      <nav className="relative border-b border-gold-500/10 bg-luxury-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" aria-label="ArchiMind AI home">
              <Logo size="default" />
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/blog" className="nav-link">Blog</Link>
              <Link to="/help" className="nav-link">Help</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-12 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          {showBackButton && (
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-luxury-silver hover:text-gold-400 transition-colors mb-6">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-display font-bold mb-4"
          >
            <span className="gold-text">{title}</span>
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-luxury-silver max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="relative px-6 lg:px-12 pb-24">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </section>

      <Footer />
    </div>
  );
}
