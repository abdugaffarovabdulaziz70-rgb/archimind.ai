import { Link } from 'react-router-dom';
import { Mail, Globe, Send, Camera, Code } from 'lucide-react';
import { Logo } from '../ui';

const footerLinks = {
  Product: [
    { label: 'Generate', path: '/generate' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Saved Projects', path: '/saved' },
  ],
  Company: [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/about' },
    { label: 'Help Center', path: '/pricing' },
    { label: 'Blog', path: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', path: '/about' },
    { label: 'Terms of Service', path: '/about' },
    { label: 'Sign In', path: '/generate' },
    { label: 'Get Started', path: '/generate' },
  ],
};

const socialLinks = [
  { icon: Globe, label: 'Website', href: 'https://archimind.ai' },
  { icon: Send, label: 'Newsletter', href: 'mailto:support@archimind.ai' },
  { icon: Camera, label: 'Gallery', href: '/gallery' },
  { icon: Code, label: 'API Docs', href: '/about' },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Logo className="mb-4" />
            <p className="text-sm text-ink-500 dark:text-ink-400 max-w-xs leading-relaxed mb-6">
              AI-powered architectural visualization. Transform simple ideas into photorealistic renderings.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-500 dark:text-ink-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-ink-900 dark:text-white text-sm">{category}</h4>
              <ul className="space-y-3 text-sm">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-ink-500 dark:text-ink-400 hover:text-accent-500 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-ink-200 dark:border-ink-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {new Date().getFullYear()} ArchiMind AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
            <Mail size={14} className="text-accent-500" />
            <a href="mailto:support@archimind.ai" className="hover:text-accent-500 transition-colors">support@archimind.ai</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
