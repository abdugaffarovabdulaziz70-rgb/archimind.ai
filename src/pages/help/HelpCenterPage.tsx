import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, BookOpen, Zap, CreditCard, Shield, User, Download,
  ChevronRight, Mail, MessageSquare,
} from 'lucide-react';
import { PublicPageLayout } from '../../components/common';
import { Card, CardBody, Button } from '../../components/ui';

const helpCategories = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'Learn the basics of creating your first architectural design.',
    articles: 8,
    path: '/faq',
  },
  {
    icon: BookOpen,
    title: 'Using ArchiMind',
    description: 'Guides on chat commands, styles, and design refinement.',
    articles: 12,
    path: '/faq',
  },
  {
    icon: CreditCard,
    title: 'Billing & Plans',
    description: 'Manage your subscription, upgrade, and payment methods.',
    articles: 6,
    path: '/pricing',
  },
  {
    icon: Download,
    title: 'Exporting Designs',
    description: 'How to export and share your architectural concepts.',
    articles: 5,
    path: '/faq',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'How we protect your data and designs.',
    articles: 4,
    path: '/privacy',
  },
  {
    icon: User,
    title: 'Account Management',
    description: 'Profile settings, password reset, and account deletion.',
    articles: 7,
    path: '/faq',
  },
];

const popularArticles = [
  'How to create your first project',
  'Understanding architectural styles',
  'Upgrading from Free to Pro',
  'Exporting designs to PDF',
  'Resetting your password',
  'Deleting your account',
];

export function HelpCenterPage() {
  const [search, setSearch] = useState('');

  return (
    <PublicPageLayout
      title="Help Center"
      subtitle="Find guides, tutorials, and answers to help you get the most out of ArchiMind AI."
    >
      <div className="space-y-12">
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury pl-12"
          />
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-xl font-display font-bold mb-6 gold-text">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link to={cat.path}>
                  <Card hover className="h-full group">
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                          <cat.icon size={24} />
                        </div>
                        <span className="text-xs text-luxury-silver">{cat.articles} articles</span>
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-gold-400 transition-colors">{cat.title}</h3>
                      <p className="text-sm text-luxury-silver leading-relaxed mb-3">{cat.description}</p>
                      <div className="flex items-center gap-1 text-sm text-gold-400">
                        Browse
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div>
          <h2 className="text-xl font-display font-bold mb-6 gold-text">Popular Articles</h2>
          <Card variant="glass">
            <CardBody className="p-6">
              <ul className="space-y-3">
                {popularArticles.map((article, i) => (
                  <motion.li
                    key={article}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      to="/faq"
                      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gold-500/5 transition-colors group"
                    >
                      <span className="text-luxury-pearl group-hover:text-gold-400 transition-colors">{article}</span>
                      <ChevronRight size={16} className="text-luxury-silver group-hover:text-gold-400 transition-colors" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageSquare size={24} className="text-gold-400" />
            <h2 className="text-2xl font-display font-bold">Still Need Help?</h2>
          </div>
          <p className="text-luxury-silver mb-6">Our support team is here to help you 24/7.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="primary" size="lg" icon={<Mail size={18} />}>
                Contact Support
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="secondary" size="lg">
                Browse FAQ
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PublicPageLayout>
  );
}
