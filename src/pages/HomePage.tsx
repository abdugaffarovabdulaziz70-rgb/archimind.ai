import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, Wand2, Download, Image as ImageIcon,
  Zap, Eye, Layers, ArrowRight, Check, Star,
} from 'lucide-react';
import { PageLayout } from '../components/common';
import { Button, Card, CardBody } from '../components/ui';
import { promptTemplates } from '../data/content';

const features = [
  { icon: Wand2, title: 'AI Prompt Enhancement', description: 'Your simple idea is automatically expanded into a 200-400 word professional architectural prompt with style, materials, lighting, and composition details.' },
  { icon: ImageIcon, title: 'Photorealistic Rendering', description: '8K quality images with PBR materials, cinematic lighting, HDR, global illumination, and Unreal Engine / V-Ray quality.' },
  { icon: Zap, title: 'One-Click Workflow', description: 'Enter a prompt and get both the enhanced description and the generated image automatically — no extra button clicks.' },
  { icon: Eye, title: 'Compare Generations', description: 'View before/after prompt comparisons and generate variations to find the perfect design.' },
  { icon: Layers, title: '15+ Project Types', description: 'Villas, luxury homes, apartments, interiors, offices, hotels, resorts, mosques, restaurants, and more.' },
  { icon: Download, title: 'High-Res Downloads', description: 'Download your generated images in high resolution. Copy enhanced prompts for use in other tools.' },
];

const stats = [
  { value: '50K+', label: 'Images Generated' },
  { value: '15+', label: 'Project Types' },
  { value: '8K', label: 'Max Resolution' },
  { value: '4.9/5', label: 'User Rating' },
];

export function HomePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 mb-8">
              <Sparkles size={16} className="text-accent-500" />
              <span className="text-sm font-medium text-accent-700 dark:text-accent-300">Powered by OpenAI GPT-4o & DALL-E 3</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Generate stunning
              <br />
              <span className="gradient-text">architectural visualizations</span>
              <br />
              with AI
            </h1>

            <p className="text-lg lg:text-xl text-ink-600 dark:text-ink-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Describe your idea in plain language. ArchiMind AI enhances your prompt into a professional
              architectural specification and generates a photorealistic rendering — automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generate">
                <Button variant="primary" size="lg" icon={<Sparkles size={20} />}>
                  Start Creating Free
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="secondary" size="lg" icon={<Eye size={20} />}>
                  View Gallery
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-12 text-sm text-ink-500 dark:text-ink-400">
              <span className="flex items-center gap-1.5"><Check size={16} className="text-green-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-green-500" /> 5 free generations</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-green-500" /> 8K quality</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-sm text-ink-500 dark:text-ink-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need to design with AI</h2>
            <p className="text-lg text-ink-600 dark:text-ink-400 max-w-2xl mx-auto">
              From simple idea to photorealistic rendering in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card hover className="h-full">
                  <CardBody className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center mb-4 text-accent-500">
                      <feature.icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{feature.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-ink-50/50 dark:bg-ink-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-ink-600 dark:text-ink-400">Three steps from idea to photorealistic image</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter your idea', description: 'Type a simple architectural prompt like "Modern luxury villa with pool".' },
              { step: '02', title: 'AI enhances it', description: 'GPT-4o transforms your idea into a 200-400 word professional prompt with style, materials, and lighting.' },
              { step: '03', title: 'Image generates', description: 'DALL-E 3 automatically renders a photorealistic 8K architectural visualization.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-accent-200 dark:text-accent-900 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-ink-600 dark:text-ink-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">Start with a template</h2>
              <p className="text-ink-600 dark:text-ink-400">Get inspired with our curated prompt templates</p>
            </div>
            <Link to="/generate">
              <Button variant="outline" icon={<ArrowRight size={18} />}>View All Templates</Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promptTemplates.slice(0, 6).map((tpl, i) => (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to="/generate">
                  <Card hover>
                    <CardBody className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{tpl.icon}</span>
                        <h3 className="font-semibold">{tpl.title}</h3>
                      </div>
                      <p className="text-sm text-ink-600 dark:text-ink-400 line-clamp-2">{tpl.prompt}</p>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-500 to-accent-700 p-12 lg:p-16 text-center"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to create?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of architects and designers using ArchiMind AI to visualize their ideas.
              </p>
              <Link to="/generate">
                <Button variant="secondary" size="lg" icon={<Sparkles size={20} />} className="!bg-white !text-accent-600 hover:!bg-ink-100">
                  Generate Your First Image
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
