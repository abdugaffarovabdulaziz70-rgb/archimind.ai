import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  Castle,
  Building,
  Hotel,
  School,
  ShoppingBag,
  Warehouse,
  Coffee,
  TreeDeciduous,
  Sparkles,
  Brain,
  Layers,
  Download,
  MapPin,
  Lightbulb,
  Palette,
  Quote,
  Menu,
  X,
  Star,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo, Button, Card } from '../components/ui';

const projectTypes = [
  { id: 'house', name: 'House', icon: Home },
  { id: 'villa', name: 'Villa', icon: Castle },
  { id: 'apartment', name: 'Apartment', icon: Building },
  { id: 'office', name: 'Office', icon: Building2 },
  { id: 'restaurant', name: 'Restaurant', icon: Coffee },
  { id: 'hotel', name: 'Hotel', icon: Hotel },
  { id: 'school', name: 'School', icon: School },
  { id: 'shopping_center', name: 'Shopping Center', icon: ShoppingBag },
  { id: 'warehouse', name: 'Warehouse', icon: Warehouse },
  { id: 'cafe', name: 'Café', icon: Coffee },
  { id: 'farm_house', name: 'Farm House', icon: TreeDeciduous },
];

const architectureStyles = [
  'Modern', 'Minimalist', 'Luxury', 'Scandinavian', 'Japanese',
  'Islamic', 'Mediterranean', 'American', 'European', 'Industrial', 'Futuristic',
];

const examplePrompts = [
  "Design a modern villa on a 20x30 meter plot with 5 bedrooms, swimming pool, rooftop garden, 3-car garage and luxury interior.",
  "Create a minimalist Japanese-inspired house with 3 bedrooms, zen garden, and natural materials.",
  "Plan a contemporary office space for 50 employees with open floor plan, meeting rooms, and sustainable features.",
  "Design a Mediterranean-style restaurant with outdoor seating, wine cellar, and traditional architecture elements.",
];

const features = [
  {
    icon: <Brain size={28} />,
    title: 'AI-Powered Design',
    description: 'Describe your vision in natural language and watch it transform into professional architectural concepts.',
  },
  {
    icon: <Layers size={28} />,
    title: 'Comprehensive Concepts',
    description: 'Get floor plans, exterior visualizations, interior ideas, landscape concepts, and furniture layouts.',
  },
  {
    icon: <Palette size={28} />,
    title: 'Multiple Styles',
    description: 'Choose from Modern, Minimalist, Luxury, Scandinavian, Japanese, Islamic, Mediterranean, and more.',
  },
  {
    icon: <Lightbulb size={28} />,
    title: 'Smart Recommendations',
    description: 'Receive suggestions for materials, lighting, energy efficiency, and cost optimization.',
  },
  {
    icon: <MapPin size={28} />,
    title: 'Interactive Editing',
    description: 'Refine your design with natural prompts. Add rooms, change styles, adjust budgets instantly.',
  },
  {
    icon: <Download size={28} />,
    title: 'Export & Share',
    description: 'Download PDF reports, PNG images, or share concepts with your architect or team.',
  },
];

const testimonials = [
  {
    name: 'Alexandra Chen',
    role: 'Real Estate Developer',
    company: 'Horizon Properties',
    content: 'ArchiMind AI revolutionized how we approach concept development. What took weeks now takes hours. The AI understands architectural nuances beautifully.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop',
    rating: 5,
  },
  {
    name: 'Marcus Wright',
    role: 'Interior Designer',
    company: 'Studio Luxe',
    content: 'The detail in the interior suggestions is remarkable. From furniture layouts to lighting recommendations, it feels like having a senior architect on demand.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
    rating: 5,
  },
  {
    name: 'Sofia Rodriguez',
    role: 'Homeowner',
    company: 'Personal Project',
    content: 'As someone planning my dream home, ArchiMind helped me visualize everything before meeting with architects. It saved me thousands in preliminary consultations.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 0,
    interval: 'month',
    features: [
      '3 projects per month',
      'Basic floor plans',
      'Standard concept images',
      'Email support',
      'Community access',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 49,
    interval: 'month',
    features: [
      '25 projects per month',
      'Detailed floor plans',
      'High-quality visualizations',
      'Priority support',
      'Export to PDF & PNG',
      'Interactive editing',
      'Cost estimations',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited projects',
      'Ultra-high quality renders',
      'Team collaboration',
      'API access',
      'Custom branding',
      'Dedicated support',
      'Advanced analytics',
      'White-label reports',
    ],
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'What types of projects can ArchiMind AI design?',
    answer: 'ArchiMind AI can create conceptual designs for houses, villas, apartments, offices, restaurants, hotels, schools, mosques, shopping centers, warehouses, cafés, and farm houses. Simply describe your project in natural language.',
  },
  {
    question: 'Are the designs ready for construction?',
    answer: 'All generated layouts, floor plans, and cost estimates are conceptual only and must be reviewed by a licensed architect or engineer before construction. ArchiMind AI is a powerful planning and visualization tool, not a replacement for professional architectural services.',
  },
  {
    question: 'Can I edit and refine the generated concepts?',
    answer: 'Absolutely! Use natural language prompts to modify any aspect of your design. For example: "Make the living room bigger", "Add another bedroom", or "Change to minimalist style". The AI will update your concept accordingly.',
  },
  {
    question: 'What architecture styles are available?',
    answer: 'We support Modern, Minimalist, Luxury, Scandinavian, Japanese, Islamic, Mediterranean, American, European, Industrial, and Futuristic styles. You can also blend styles or request custom variations.',
  },
];

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % examplePrompts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            <Logo size="default" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#styles" className="nav-link">Styles</a>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <a href="#testimonials" className="nav-link">Reviews</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-luxury-black/95 backdrop-blur-xl border-t border-gold-500/10"
            >
              <div className="px-6 py-6 space-y-4">
                <a href="#features" className="block py-2 text-luxury-pearl/70 hover:text-gold-400" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#styles" className="block py-2 text-luxury-pearl/70 hover:text-gold-400" onClick={() => setMobileMenuOpen(false)}>Styles</a>
                <Link to="/pricing" className="block py-2 text-luxury-pearl/70 hover:text-gold-400" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                <a href="#testimonials" className="block py-2 text-luxury-pearl/70 hover:text-gold-400" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                <a href="#faq" className="block py-2 text-luxury-pearl/70 hover:text-gold-400" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                <div className="flex gap-4 pt-4">
                  <Link to="/login" className="flex-1">
                    <Button variant="secondary" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button variant="primary" className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8">
              <Sparkles size={18} className="text-gold-400" />
              <span className="text-sm font-medium text-gold-400">AI-Powered Architecture Design</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="text-gradient">Design Your Dream</span>
              <br />
              <span className="text-luxury-pearl">Architecture with AI</span>
            </h1>

            <p className="text-lg lg:text-xl text-luxury-silver max-w-2xl mx-auto mb-12">
              Describe your vision in natural language and receive professional conceptual architectural designs. Floor plans, visualizations, interior ideas, and cost estimates—instantly.
            </p>
          </motion.div>

          {/* AI Prompt Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="card-luxury p-6 lg:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 size={24} className="text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Describe Your Project</h3>
                  <p className="text-sm text-luxury-silver">Tell us about your dream project in any language</p>
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={examplePrompts[currentPromptIndex]}
                className="w-full h-32 px-5 py-4 rounded-2xl bg-luxury-black/50 border border-gold-500/10 focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/20 transition-all resize-none text-luxury-pearl placeholder:text-luxury-silver/40"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex flex-wrap gap-2">
                  {['Villa', 'Modern', '5 Bedrooms'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={<Sparkles size={20} />}>
                    Generate Design
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Popular Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-luxury-silver mb-6">Popular Project Types</p>
            <div className="flex flex-wrap justify-center gap-3">
              {projectTypes.slice(0, 8).map((type) => (
                <Link
                  key={type.id}
                  to="/register"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300 group"
                >
                  <type.icon size={18} className="text-gold-400 group-hover:text-gold-300" />
                  <span className="text-sm font-medium">{type.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Architecture Visualization Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative mt-20"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 via-gold-400/10 to-gold-500/20 rounded-[3rem] blur-2xl opacity-30" />
            <div className="relative glass-dark overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?w=1400&h=800&fit=crop"
                  alt="Modern Architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />

                {/* Floating Stats */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
                  {[
                    { label: 'Floor Plan', value: 'Concept Ready' },
                    { label: 'Est. Cost', value: '$2.5M - $3.2M' },
                    { label: 'Timeline', value: '18-24 months' },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-subtle px-4 py-3 rounded-xl">
                      <p className="text-xs text-luxury-silver">{stat.label}</p>
                      <p className="text-sm font-semibold text-gold-400">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Styles Section */}
      <section id="styles" className="relative py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              <span className="gold-text">Architecture Styles</span>
            </h2>
            <p className="text-lg text-luxury-silver max-w-2xl mx-auto">
              Choose from a diverse range of architectural styles from around the world
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {architectureStyles.map((style, index) => (
              <motion.div
                key={style}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <Link
                  to="/register"
                  className="block p-4 rounded-2xl bg-luxury-charcoal/30 border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300 text-center"
                >
                  <span className="text-sm font-medium group-hover:text-gold-400 transition-colors">{style}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 lg:px-12 bg-luxury-charcoal/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Powerful <span className="gold-text">Features</span>
            </h2>
            <p className="text-lg text-luxury-silver max-w-2xl mx-auto">
              Everything you need to bring your architectural vision to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover glow className="p-8 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6 text-gold-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-luxury-silver">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24 px-6 lg:px-12 bg-luxury-charcoal/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Trusted by <span className="gold-text">Professionals</span>
            </h2>
            <p className="text-lg text-luxury-silver max-w-2xl mx-auto">
              See what architects, designers, and property developers are saying
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="dark" hover className="p-6 h-full">
                  <Quote size={32} className="text-gold-500/20 mb-4" />
                  <p className="text-luxury-pearl/80 mb-6 leading-relaxed">{testimonial.content}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-500/30"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-luxury-silver">{testimonial.role}</p>
                      <p className="text-xs text-gold-400">{testimonial.company}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Simple <span className="gold-text">Pricing</span>
            </h2>
            <p className="text-lg text-luxury-silver max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={plan.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}
              >
                <Card
                  variant={plan.highlighted ? 'default' : 'dark'}
                  className={`p-8 h-full ${plan.highlighted ? 'border-gold-500/30 shadow-gold' : ''}`}
                >
                  {plan.highlighted && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-sm mb-4">
                      <Sparkles size={14} />
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold gold-text">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-luxury-silver">/{plan.interval}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-gold-400" />
                        </div>
                        <span className="text-sm text-luxury-pearl/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block">
                    <Button
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 px-6 lg:px-12 bg-luxury-charcoal/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Frequently Asked <span className="gold-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-6 rounded-2xl bg-luxury-black/50 border border-gold-500/10 hover:border-gold-500/20 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-lg">{faq.question}</span>
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
                <Building2 size={36} className="text-gold-400" />
              </div>
            </div>

            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
              Ready to Design Your <span className="gold-text">Dream Project?</span>
            </h2>
            <p className="text-lg text-luxury-silver mb-8 max-w-2xl mx-auto">
              Join thousands of architects, designers, and dreamers using ArchiMind AI to bring their visions to life.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="xl" icon={<Sparkles size={22} />}>
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-luxury-silver">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                3 free projects
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 p-6 rounded-2xl bg-gold-500/5 border border-gold-500/10"
          >
            <p className="text-sm text-luxury-silver">
              <span className="text-gold-400 font-medium">Important:</span> All generated layouts, floor plans, and cost estimates are conceptual only and must be reviewed by a licensed architect or engineer before construction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 lg:px-12 border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Logo size="default" className="mb-4" />
              <p className="text-sm text-luxury-silver max-w-xs">
                AI-powered architecture design platform for professionals and dreamers alike.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gold-400">Product</h4>
              <ul className="space-y-2 text-sm text-luxury-silver">
                <li><a href="#features" className="hover:text-gold-400 transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-gold-400 transition-colors">Pricing</Link></li>
                <li><a href="#faq" className="hover:text-gold-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gold-400">Company</h4>
              <ul className="space-y-2 text-sm text-luxury-silver">
                <li><Link to="/register" className="hover:text-gold-400 transition-colors">About</Link></li>
                <li><Link to="/register" className="hover:text-gold-400 transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-gold-400 transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gold-400">Legal</h4>
              <ul className="space-y-2 text-sm text-luxury-silver">
                <li><Link to="/register" className="hover:text-gold-400 transition-colors">Privacy</Link></li>
                <li><Link to="/register" className="hover:text-gold-400 transition-colors">Terms</Link></li>
                <li><Link to="/register" className="hover:text-gold-400 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gold-500/10">
            <p className="text-sm text-luxury-silver">
              {new Date().getFullYear()} ArchiMind AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
