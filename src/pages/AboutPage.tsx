import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Shield, Zap, Heart, Target, Sparkles, Building2 } from 'lucide-react';
import { PageLayout } from '../components/common';
import { Card, CardBody, Button } from '../components/ui';

const values = [
  { icon: Brain, title: 'Innovation', description: 'Pushing the boundaries of AI to make professional architecture accessible to everyone.' },
  { icon: Shield, title: 'Trust & Security', description: 'Your data and designs are protected with enterprise-grade security and privacy.' },
  { icon: Heart, title: 'User-Centric', description: 'Every feature is designed with our users in mind, from hobbyists to professionals.' },
  { icon: Zap, title: 'Speed', description: 'From idea to photorealistic image in seconds, not weeks.' },
];

const stats = [
  { value: '50K+', label: 'Images Generated' },
  { value: '15+', label: 'Project Types' },
  { value: '8K', label: 'Max Resolution' },
  { value: '4.9/5', label: 'User Rating' },
];

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-Founder', icon: Building2 },
  { name: 'Marcus Rodriguez', role: 'CTO & Co-Founder', icon: Brain },
  { name: 'Aisha Patel', role: 'Head of Design', icon: Target },
  { name: 'James Kim', role: 'Lead AI Engineer', icon: Zap },
];

export function AboutPage() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            About <span className="gradient-text">ArchiMind AI</span>
          </h1>
          <p className="text-lg text-ink-600 dark:text-ink-400 max-w-2xl mx-auto">
            We're on a mission to democratize architecture with AI-powered design tools that transform ideas into photorealistic visualizations.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-ink-600 dark:text-ink-400 leading-relaxed">
            <p>
              ArchiMind AI was born from a simple observation: professional architectural visualization should be
              accessible to everyone. Whether you're a homeowner dreaming of your perfect house, a developer
              planning a new project, or an architect looking to accelerate your workflow — AI can transform
              how we design spaces.
            </p>
            <p>
              Founded in 2024 by a team of architects and AI engineers, we built a platform that understands
              the language of architecture. Our AI enhances simple prompts into detailed professional specifications
              and generates photorealistic renderings in seconds.
            </p>
            <p>
              Today, over 50,000 images have been generated using ArchiMind AI, and we're just getting started.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-sm text-ink-500 dark:text-ink-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center flex-shrink-0 text-accent-500">
                        <value.icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                        <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Leadership Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hover className="text-center">
                  <CardBody className="p-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center mx-auto mb-4 text-accent-500">
                      <member.icon size={28} />
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{member.role}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-ink-600 dark:text-ink-400 mb-8 max-w-xl mx-auto">
            Start creating stunning architectural visualizations today.
          </p>
          <Link to="/generate">
            <Button variant="primary" size="lg" icon={<Sparkles size={20} />}>Get Started Free</Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
}
