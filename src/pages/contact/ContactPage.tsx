import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, Check } from 'lucide-react';
import { PublicPageLayout } from '../../components/common';
import { Card, CardBody, Button } from '../../components/ui';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@archimind.ai', href: 'mailto:support@archimind.ai' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: 'Office', value: 'San Francisco, CA', href: null },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri 9AM-6PM PST', href: null },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <PublicPageLayout
      title="Contact Us"
      subtitle="Have a question or feedback? We'd love to hear from you."
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card>
                <CardBody className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                    <info.icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-luxury-silver uppercase tracking-wider mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="font-medium text-luxury-pearl hover:text-gold-400 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-medium text-luxury-pearl">{info.value}</p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card variant="glass">
            <CardBody className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={24} className="text-gold-400" />
                <h2 className="text-xl font-display font-bold">Send a Message</h2>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-3"
                  >
                    <Check size={20} />
                    <span className="text-sm">Thank you! We'll get back to you within 24 hours.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-luxury"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-luxury"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-luxury"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-luxury resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={<Send size={18} />}
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </PublicPageLayout>
  );
}
