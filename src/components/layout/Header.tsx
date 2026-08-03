import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { Logo, Button } from '../ui';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Generate', path: '/generate' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-sm' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20'
                    : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/saved">
                  <Button variant="ghost" size="sm" icon={<User size={16} />}>My Projects</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} icon={<LogOut size={16} />}>Sign Out</Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/generate">
                  <Button variant="primary" size="sm" icon={<Sparkles size={16} />}>Start Creating</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20'
                        : 'text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-ink-200 dark:border-ink-800">
                  {user ? (
                    <>
                      <Link to="/saved" className="block px-4 py-3 rounded-lg text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800">My Projects</Link>
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800">Sign Out</button>
                    </>
                  ) : (
                    <Link to="/generate" className="block px-4 py-3 rounded-lg text-sm font-semibold text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20 text-center">Start Creating</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
