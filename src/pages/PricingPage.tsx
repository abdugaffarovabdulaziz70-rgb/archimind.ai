import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ChevronDown, Star } from 'lucide-react';
import { PageLayout } from '../components/common';
import { Card, CardBody, Button } from '../components/ui';
import { pricingPlans, faqData } from '../data/content';

export function PricingPage() {
  const [interval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = faqData.filter((f) => f.category === 'Pricing' || f.category === 'General');

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 mb-6">
            <Sparkles size={16} className="text-accent-500" />
            <span className="text-sm font-medium text-accent-700 dark:text-accent-300">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Choose your <span className="gradient-text">plan</span>
          </h1>
          <p className="text-lg text-ink-600 dark:text-ink-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${interval === 'month' ? 'bg-accent-500 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${interval === 'year' ? 'bg-accent-500 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400'}`}
          >
            Yearly
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Save 20%</span>
          </button>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {pricingPlans.map((plan, i) => {
            const price = interval === 'year' ? Math.round(plan.price * 12 * 0.8) : plan.price;
            const displayPrice = plan.price === 0 ? 0 : price;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={plan.highlighted ? 'lg:-mt-4' : ''}
              >
                <Card className={`h-full relative ${plan.highlighted ? 'border-2 border-accent-500 shadow-xl shadow-accent-500/10' : ''}`}>
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-semibold">
                        <Star size={12} className="fill-white" /> Most Popular
                      </div>
                    </div>
                  )}
                  <CardBody className="p-8 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-ink-600 dark:text-ink-400 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold">${displayPrice}</span>
                      <span className="text-ink-500 dark:text-ink-400">/{interval === 'year' && plan.price > 0 ? 'year' : 'month'}</span>
                    </div>

                    <Link to="/generate" className="block mb-8">
                      <Button variant={plan.highlighted ? 'primary' : 'secondary'} size="lg" className="w-full">
                        {plan.cta}
                      </Button>
                    </Link>

                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-ink-700 dark:text-ink-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 rounded-xl bg-ink-50 dark:bg-ink-800/50 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown size={18} className={`text-ink-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 py-4 text-ink-600 dark:text-ink-400 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-ink-600 dark:text-ink-400 mb-6">Contact our team — we're happy to help.</p>
          <Link to="/generate"><Button variant="primary" size="lg" icon={<Sparkles size={20} />}>Start Free Now</Button></Link>
        </div>
      </div>
    </PageLayout>
  );
}

