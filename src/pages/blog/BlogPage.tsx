import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, TrendingUp, Lightbulb, Building2, Leaf, Zap } from 'lucide-react';
import { PublicPageLayout } from '../../components/common';
import { Card, CardBody, Button } from '../../components/ui';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  icon: typeof TrendingUp;
}

const blogPosts: BlogPost[] = [
  {
    id: 'ai-architecture-future',
    title: 'The Future of AI in Architecture Design',
    excerpt: 'How artificial intelligence is reshaping the way architects and homeowners approach design, from concept to construction.',
    category: 'AI & Technology',
    readTime: '8 min read',
    date: 'Jun 28, 2026',
    icon: TrendingUp,
  },
  {
    id: 'sustainable-design-tips',
    title: '10 Sustainable Design Principles for Modern Homes',
    excerpt: 'Learn how to incorporate eco-friendly materials, passive cooling, and energy-efficient layouts into your next project.',
    category: 'Sustainability',
    readTime: '6 min read',
    date: 'Jun 20, 2026',
    icon: Leaf,
  },
  {
    id: 'maximizing-small-spaces',
    title: 'Maximizing Small Spaces: Smart Layout Strategies',
    excerpt: 'Practical tips for designing functional, beautiful spaces even when square footage is limited.',
    category: 'Design Tips',
    readTime: '5 min read',
    date: 'Jun 15, 2026',
    icon: Lightbulb,
  },
  {
    id: 'choosing-architectural-style',
    title: 'Choosing the Right Architectural Style for Your Project',
    excerpt: 'A guide to matching your personal aesthetic with the right architectural style, from modern to mediterranean.',
    category: 'Guides',
    readTime: '7 min read',
    date: 'Jun 10, 2026',
    icon: Building2,
  },
  {
    id: 'energy-efficient-homes',
    title: 'Building Energy-Efficient Homes with AI',
    excerpt: 'How AI-powered design tools help optimize energy consumption through smart orientation and material selection.',
    category: 'AI & Technology',
    readTime: '6 min read',
    date: 'Jun 5, 2026',
    icon: Zap,
  },
  {
    id: 'luxury-villa-design',
    title: 'Designing Luxury Villas: From Concept to Reality',
    excerpt: 'Explore the process of creating high-end residential spaces with pools, rooftop gardens, and premium finishes.',
    category: 'Design Tips',
    readTime: '9 min read',
    date: 'May 28, 2026',
    icon: Building2,
  },
];

const categories = ['All', 'AI & Technology', 'Sustainability', 'Design Tips', 'Guides'];

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <PublicPageLayout
      title="ArchiMind Blog"
      subtitle="Insights on AI, architecture, design trends, and sustainable building."
    >
      <div className="space-y-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-black'
                  : 'bg-luxury-charcoal/50 border border-gold-500/10 text-luxury-silver hover:border-gold-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card hover className="h-full group cursor-pointer">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                      <post.icon size={28} />
                    </div>
                    <div>
                      <span className="text-xs text-gold-400 font-medium">{post.category}</span>
                      <div className="flex items-center gap-3 text-xs text-luxury-silver mt-1">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-display font-bold mb-3 group-hover:text-gold-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-luxury-silver leading-relaxed mb-4">{post.excerpt}</p>

                  <div className="flex items-center gap-2 text-sm text-gold-400 font-medium">
                    Read More
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <h2 className="text-2xl font-display font-bold mb-3 gold-text">Subscribe to Our Newsletter</h2>
          <p className="text-luxury-silver mb-6">Get the latest articles and design tips delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="input-luxury flex-1" />
            <Button variant="primary" size="lg">Subscribe</Button>
          </div>
        </motion.div>
      </div>
    </PublicPageLayout>
  );
}
