import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { PublicPageLayout } from '../../components/common';
import { Card, CardBody } from '../../components/ui';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, including your name, email address, and any project data you create using ArchiMind AI. We also automatically collect certain technical information such as your IP address, browser type, and usage data through cookies and similar technologies.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to provide and improve our services, communicate with you about your account, process payments, personalize your experience, and ensure the security of our platform. Your architectural designs are used solely to provide you with the service and are never sold to third parties.`,
  },
  {
    title: '3. Data Storage and Security',
    content: `Your data is stored using enterprise-grade encryption both in transit (TLS 1.2+) and at rest (AES-256). We use Supabase for secure data storage with Row Level Security policies ensuring only you can access your own projects and designs. Our infrastructure is hosted on certified cloud providers with SOC 2 compliance.`,
  },
  {
    title: '4. Sharing of Information',
    content: `We do not sell, rent, or trade your personal information. We may share data with trusted third-party service providers who assist us in operating our platform (such as payment processors and cloud infrastructure providers), all of whom are bound by strict confidentiality obligations.`,
  },
  {
    title: '5. Cookies and Tracking',
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand how you use our platform. You can control cookies through your browser settings, though disabling them may affect functionality.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to access, correct, or delete your personal information at any time. You can manage your data through your account settings or by contacting us directly. Upon account deletion, all associated project data is permanently removed within 30 days.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `ArchiMind AI is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page and, where appropriate, sending you a notification. Your continued use of the service after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    content: `If you have questions about this Privacy Policy, please contact us at support@archimind.ai or through our Contact page.`,
  },
];

export function PrivacyPolicyPage() {
  return (
    <PublicPageLayout
      title="Privacy Policy"
      subtitle="Last updated: July 10, 2026. Your privacy and data security are our top priorities."
    >
      <div className="space-y-6">
        {/* Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500/20">
            <CardBody className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Data is Protected</h3>
                <p className="text-sm text-luxury-silver leading-relaxed">
                  We use enterprise-grade encryption, Row Level Security, and SOC 2 compliant infrastructure.
                  Your designs are private, never sold, and fully under your control.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Sections */}
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card>
              <CardBody className="p-6">
                <h2 className="text-lg font-display font-bold mb-3 text-gold-400">{section.title}</h2>
                <p className="text-luxury-silver leading-relaxed">{section.content}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </PublicPageLayout>
  );
}
