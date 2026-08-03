import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicPageLayout } from '../../components/common';
import { Card, CardBody, Button } from '../../components/ui';
import { faqData, faqCategories } from '../../data/faq';

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicPageLayout
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about ArchiMind AI."
    >
      <div className="space-y-8">
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury pl-12"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {faqCategories.map((cat) => (
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

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle size={48} className="text-gold-500/30 mx-auto mb-4" />
              <p className="text-luxury-silver">No questions found. Try a different search.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                  className="w-full text-left"
                >
                  <Card className={activeId === faq.id ? 'border-gold-500/30' : ''}>
                    <CardBody className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="text-xs text-gold-400 font-mono mt-1">{faq.category}</span>
                          <span className="font-medium text-luxury-pearl">{faq.question}</span>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gold-400 flex-shrink-0 transition-transform duration-300 ${activeId === faq.id ? 'rotate-180' : ''}`}
                        />
                      </div>
                      <AnimatePresence>
                        {activeId === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 text-luxury-silver leading-relaxed pl-24">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardBody>
                  </Card>
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-luxury-silver mb-4">Still have questions?</p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}
