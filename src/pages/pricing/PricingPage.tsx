import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Sparkles,
  Crown,
  Building2,
  ChevronDown,
  Shield,
  Zap,
  Users,
  Star,
  ArrowRight,
  X,
} from 'lucide-react';
import { Logo, Button, Card } from '../../components/ui';
import { ErrorBoundary } from '../../components/common';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  highlighted: boolean;
  cta: string;
  ctaLink: string;
  badge?: string;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Perfect for exploring AI-powered architecture design.',
    features: [
      '3 projects per month',
      'Basic floor plans',
      'Standard concept images',
      '5 architecture styles',
      'Community access',
      'Email support',
    ],
    notIncluded: ['High-quality renders', 'Export to PDF & PNG', 'Interactive editing'],
    highlighted: false,
    cta: 'Start for Free',
    ctaLink: '/register',
    icon: <Sparkles size={24} />,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    interval: 'month',
    description: 'For professionals who need power and flexibility.',
    features: [
      '25 projects per month',
      'Detailed floor plans',
      'High-quality visualizations',
      'All 11 architecture styles',
      'Priority support',
      'Export to PDF & PNG',
      'Interactive editing',
      'Cost estimations',
    ],
    notIncluded: ['Team collaboration', 'API access'],
    highlighted: true,
    cta: 'Upgrade to Pro',
    ctaLink: '/register',
    badge: 'Most Popular',
    icon: <Crown size={24} />,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    description: 'Built for teams and large-scale architectural workflows.',
    features: [
      'Unlimited projects',
      'Ultra-high quality renders',
      'All architecture styles',
      'Team collaboration',
      'API access',
      'Custom branding',
      'Dedicated support',
      'Advanced analytics',
      'White-label reports',
    ],
    highlighted: false,
    cta: 'Contact Sales',
    ctaLink: '/register',
    badge: 'Best Value',
    icon: <Building2 size={24} />,
  },
];

const featureComparison = [
  { feature: 'Projects per month', free: '3', pro: '25', enterprise: 'Unlimited' },
  { feature: 'Architecture styles', free: '5', pro: 'All 11', enterprise: 'All 11' },
  { feature: 'Image quality', free: 'Standard', pro: 'High', enterprise: 'Ultra-high' },
  { feature: 'Floor plans', free: 'Basic', pro: 'Detailed', enterprise: 'Detailed' },
  { feature: 'Export PDF & PNG', free: false, pro: true, enterprise: true },
  { feature: 'Interactive editing', free: false, pro: true, enterprise: true },
  { feature: 'Cost estimations', free: false, pro: true, enterprise: true },
  { feature: 'Team collaboration', free: false, pro: false, enterprise: true },
  { feature: 'API access', free: false, pro: false, enterprise: true },
  { feature: 'Custom branding', free: false, pro: false, enterprise: true },
  { feature: 'Priority support', free: false, pro: true, enterprise: true },
  { feature: 'Dedicated support', free: false, pro: false, enterprise: true },
];

const faqs = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Absolutely. You can upgrade, downgrade, or cancel your plan anytime from your account settings. Changes take effect immediately, and we prorate any billing differences automatically.',
  },
  {
    question: 'Is there a free trial for the Pro plan?',
    answer: 'The Free plan lets you explore core features with 3 projects per month at no cost. When you are ready for more, upgrading to Pro unlocks high-quality renders, exports, and interactive editing instantly.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as secure online payment platforms. Enterprise customers can arrange invoicing for annual contracts.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'If you are not satisfied within the first 14 days of a paid plan, contact our support team for a full refund. No questions asked.',
  },
  {
    question: 'Can Enterprise plans be customized?',
    answer: 'Yes. Enterprise plans are flexible and can include custom integrations, dedicated infrastructure, SSO, and white-label reports. Reach out to our sales team to design a package that fits your organization.',
  },
  {
    question: 'Are the designs ready for construction?',
    answer: 'All generated layouts, floor plans, and cost estimates are conceptual only and must be reviewed by a licensed architect or engineer before construction. ArchiMind AI is a planning and visualization tool, not a replacement for professional architectural services.',
  },
];

const stats = [
  { icon: <Users size={20} />, value: '10,000+', label: 'Active Users' },
  { icon: <Building2 size={20} />, value: '250K+', label: 'Projects Created' },
  { icon: <Star size={20} />, value: '4.9/5', label: 'Average Rating' },
  { icon: <Shield size={20} />, value: '99.9%', label: 'Uptime SLA' },
];

function PricingContent() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const annualDiscount = 0.8;
  const getDisplayPrice = (plan: Plan) => {
    if (plan.price === 0) return 0;
    return billingInterval === 'annual'
      ? Math.round(plan.price * annualDiscount)
      : plan.price;
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-pearl overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold-500/2 rounded-full blur-[200px]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-luxury-black/90 backdrop-blur-xl border-b border-gold-500/10' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" aria-label="ArchiMind AI home">
              <Logo size="default" />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/pricing" className="nav-link nav-link-active">Pricing</Link>
              <Link to="/register" className="nav-link">Get Started</Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>

            <div className="lg:hidden">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8"
          >
            <Sparkles size={18} className="text-gold-400" />
            <span className="text-sm font-medium text-gold-400">Simple, Transparent Pricing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
          >
            <span className="text-gradient">Choose Your</span>
            <br />
            <span className="text-luxury-pearl">Perfect Plan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg lg:text-xl text-luxury-silver max-w-2xl mx-auto mb-10"
          >
            From exploring ideas to designing at scale. Upgrade, downgrade, or cancel anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-luxury-charcoal/50 border border-gold-500/10 mb-4"
          >
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                billingInterval === 'monthly'
                  ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-black'
                  : 'text-luxury-silver hover:text-luxury-pearl'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                billingInterval === 'annual'
                  ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-black'
                  : 'text-luxury-silver hover:text-luxury-pearl'
              }`}
            >
              Annual
              <span className={`px-2 py-0.5 rounded-md text-xs ${
                billingInterval === 'annual' ? 'bg-luxury-black/20 text-luxury-black' : 'bg-gold-500/10 text-gold-400'
              }`}>
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative px-6 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan, index) => {
              const displayPrice = getDisplayPrice(plan);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={plan.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}
                >
                  <Card
                    variant={plan.highlighted ? 'default' : 'dark'}
                    className={`p-8 h-full relative flex flex-col ${plan.highlighted ? 'border-gold-500/40 shadow-gold-lg' : ''}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold ${
                          plan.highlighted
                            ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-black'
                            : 'bg-gold-500/10 border border-gold-500/20 text-gold-400'
                        }`}>
                          {plan.highlighted && <Sparkles size={12} />}
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-4 text-gold-400">
                        {plan.icon}
                      </div>
                      <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                      <p className="text-sm text-luxury-silver leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-8 pb-8 border-b border-gold-500/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-display font-bold gold-text">
                          {displayPrice === 0 ? 'Free' : `$${displayPrice}`}
                        </span>
                        {displayPrice > 0 && (
                          <span className="text-luxury-silver text-sm">
                            /{plan.interval}
                          </span>
                        )}
                      </div>
                      {billingInterval === 'annual' && plan.price > 0 && (
                        <p className="text-xs text-gold-400 mt-2">
                          Billed annually (${displayPrice * 12}/year)
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-gold-400" />
                          </div>
                          <span className="text-sm text-luxury-pearl/90">{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded?.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 opacity-40">
                          <div className="w-5 h-5 rounded-full bg-luxury-gray/30 flex items-center justify-center flex-shrink-0">
                            <X size={12} className="text-luxury-silver" />
                          </div>
                          <span className="text-sm text-luxury-silver line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link to={plan.ctaLink} className="block">
                      <Button
                        variant={plan.highlighted ? 'primary' : 'secondary'}
                        className="w-full"
                        size="lg"
                        icon={<ArrowRight size={18} />}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Guarantee note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-luxury-silver"
          >
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              14-day money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              No credit card required for Free
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              Cancel anytime
            </span>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 px-6 lg:px-12 bg-luxury-charcoal/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mx-auto mb-3 text-gold-400">
                  {stat.icon}
                </div>
                <p className="text-3xl font-display font-bold gold-text mb-1">{stat.value}</p>
                <p className="text-sm text-luxury-silver">{stat.label}</p>
      </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="relative py-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Compare <span className="gold-text">All Features</span>
            </h2>
            <p className="text-lg text-luxury-silver max-w-2xl mx-auto">
              Everything side-by-side, so you can pick with confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gold-500/20">
                  <th className="text-left py-5 px-4 text-luxury-pearl font-semibold">Feature</th>
                  <th className="text-center py-5 px-4 text-luxury-pearl font-semibold">
                    <span className="flex flex-col items-center gap-1">
                      <Sparkles size={16} className="text-gold-400" />
                      Free
                    </span>
                  </th>
                  <th className="text-center py-5 px-4 text-gold-400 font-semibold bg-gold-500/5">
                    <span className="flex flex-col items-center gap-1">
                      <Crown size={16} />
                      Pro
                    </span>
                  </th>
                  <th className="text-center py-5 px-4 text-luxury-pearl font-semibold">
                    <span className="flex flex-col items-center gap-1">
                      <Building2 size={16} className="text-gold-400" />
                      Enterprise
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-gold-500/5 hover:bg-gold-500/[0.02] transition-colors ${index % 2 === 1 ? 'bg-white/[0.01]' : ''}`}
                  >
                    <td className="py-4 px-4 text-sm text-luxury-pearl/90">{row.feature}</td>
                    {[row.free, row.pro, row.enterprise].map((val, i) => (
                      <td
                        key={i}
                        className={`py-4 px-4 text-center text-sm ${i === 1 ? 'bg-gold-500/[0.03]' : ''}`}
                      >
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check size={18} className="text-gold-400 mx-auto" />
                          ) : (
                            <X size={18} className="text-luxury-silver/40 mx-auto" />
                          )
                        ) : (
                          <span className="text-luxury-pearl/90">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 px-6 lg:px-12 bg-luxury-charcoal/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Frequently Asked <span className="gold-text">Questions</span>
            </h2>
            <p className="text-lg text-luxury-silver max-w-2xl mx-auto">
              Everything you need to know about plans and billing.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-6 rounded-2xl bg-luxury-black/50 border border-gold-500/10 hover:border-gold-500/20 transition-all"
                  aria-expanded={activeFaq === index}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-lg text-luxury-pearl">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-gold-400 transition-transform duration-300 flex-shrink-0 ${activeFaq === index ? 'rotate-180' : ''}`}
                    />
                  </div>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-luxury-silver leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <Zap size={36} className="text-gold-400" />
              </div>
            </div>

            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
              Ready to <span className="gold-text">Get Started?</span>
            </h2>
            <p className="text-lg text-luxury-silver mb-8 max-w-2xl mx-auto">
              Join thousands of architects, designers, and dreamers using ArchiMind AI to bring their visions to life.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="xl" icon={<Sparkles size={22} />}>
                  Start Free Today
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 lg:px-12 border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" aria-label="ArchiMind AI home">
              <Logo size="default" />
            </Link>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link to="/" className="text-luxury-silver hover:text-gold-400 transition-colors">Home</Link>
              <Link to="/pricing" className="text-luxury-silver hover:text-gold-400 transition-colors">Pricing</Link>
              <Link to="/login" className="text-luxury-silver hover:text-gold-400 transition-colors">Sign In</Link>
              <Link to="/register" className="text-luxury-silver hover:text-gold-400 transition-colors">Get Started</Link>
            </nav>
            <p className="text-sm text-luxury-silver">
              {new Date().getFullYear()} ArchiMind AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PricingPage() {
  return (
    <ErrorBoundary>
      <PricingContent />
    </ErrorBoundary>
  );
}
