import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain, Layers, Palette, Shield, Heart, Zap,
  Building2, Sparkles,
} from 'lucide-react';
import { PublicPageLayout } from '../../components/common';
import { Card, CardBody, Button } from '../../components/ui';

const values = [
  { icon: Brain, title: 'Innovation First', description: 'We push the boundaries of AI to make professional architecture accessible to everyone.' },
  { icon: Shield, title: 'Trust & Security', description: 'Your designs and data are protected with enterprise-grade security and privacy.' },
  { icon: Heart, title: 'User-Centric', description: 'Every feature is designed with our users in mind, from hobbyists to professionals.' },
  { icon: Zap, title: 'Speed & Efficiency', description: 'Generate comprehensive architectural concepts in seconds, not weeks.' },
];

const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: '250K+', label: 'Projects Created' },
  { value: '11', label: 'Architecture Styles' },
  { value: '4.9/5', label: 'Average Rating' },
];

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-Founder', icon: Building2 },
  { name: 'Marcus Rodriguez', role: 'CTO & Co-Founder', icon: Brain },
  { name: 'Aisha Patel', role: 'Head of Design', icon: Palette },
  { name: 'James Kim', role: 'Lead AI Engineer', icon: Layers },
];

export function AboutPage() {
  return (
    <PublicPageLayout
      title="About ArchiMind"
      subtitle="We're on a mission to democratize architecture with AI-powered design tools."
    >
      <div className="space-y-20">
        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold mb-6 gold-text">Our Story</h2>
          <div className="space-y-4 text-luxury-silver leading-relaxed">
            <p>
              ArchiMind AI was born from a simple observation: professional architectural design should be
              accessible to everyone. Whether you're a homeowner dreaming of your perfect house, a developer
              planning a new project, or an architect looking to accelerate your workflow — the power of AI
              can transform how we design spaces.
            </p>
            <p>
              Founded in 2024 by a team of architects and AI engineers, we've built a platform that understands
              the language of architecture. From floor plans to material recommendations, cost estimates to
              energy efficiency analysis — ArchiMind AI brings together decades of architectural knowledge
              with cutting-edge artificial intelligence.
            </p>
            <p>
              Today, over 10,000 users rely on ArchiMind AI to bring their visions to life, creating everything
              from cozy family homes to ambitious commercial developments. And we're just getting started.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-display font-bold gold-text mb-2">{stat.value}</p>
              <p className="text-sm text-luxury-silver">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-8 text-center gold-text">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0 text-gold-400">
                        <value.icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                        <p className="text-sm text-luxury-silver leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-8 text-center gold-text">Leadership Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hover className="text-center">
                  <CardBody className="p-6">
                    <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4 text-gold-400">
                      <member.icon size={28} />
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-luxury-silver">{member.role}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <h2 className="text-3xl font-display font-bold mb-4">Join Our Journey</h2>
          <p className="text-luxury-silver mb-8 max-w-xl mx-auto">
            Be part of the future of architectural design. Start creating today.
          </p>
          <Link to="/register">
            <Button variant="primary" size="xl" icon={<Sparkles size={20} />}>
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </PublicPageLayout>
  );
}
