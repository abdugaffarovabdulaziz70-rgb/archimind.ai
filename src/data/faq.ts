export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Getting Started',
    question: 'What is ArchiMind AI?',
    answer: 'ArchiMind AI is an AI-powered architecture design platform that transforms your descriptions into professional architectural concepts, floor plans, and visualizations. Simply describe your dream project in natural language.',
  },
  {
    id: 'faq-2',
    category: 'Getting Started',
    question: 'How do I create my first project?',
    answer: 'After signing up, click "New Project" in the sidebar. Describe what you want to build — including building type, style, size, and features. The AI will guide you through refining the design.',
  },
  {
    id: 'faq-3',
    category: 'Getting Started',
    question: 'Do I need architecture experience?',
    answer: 'Not at all. ArchiMind AI is designed for everyone. Whether you are a homeowner, developer, or professional architect, the platform adapts to your level of expertise.',
  },
  {
    id: 'faq-4',
    category: 'Pricing & Plans',
    question: 'Is there a free plan?',
    answer: 'Yes. The Free plan includes 3 projects per month, basic floor plans, and 5 architecture styles. No credit card required.',
  },
  {
    id: 'faq-5',
    category: 'Pricing & Plans',
    question: 'Can I switch plans at any time?',
    answer: 'Absolutely. You can upgrade, downgrade, or cancel your plan anytime from your account settings. Changes take effect immediately, and we prorate any billing differences.',
  },
  {
    id: 'faq-6',
    category: 'Pricing & Plans',
    question: 'Do you offer refunds?',
    answer: 'If you are not satisfied within the first 14 days of a paid plan, contact our support team for a full refund. No questions asked.',
  },
  {
    id: 'faq-7',
    category: 'Features',
    question: 'What architecture styles are supported?',
    answer: 'We support 11 styles: Modern, Minimalist, Luxury, Scandinavian, Japanese, Islamic, Mediterranean, American, European, Industrial, and Futuristic.',
  },
  {
    id: 'faq-8',
    category: 'Features',
    question: 'Can I export my designs?',
    answer: 'Yes. Pro and Enterprise plans support exporting to PDF and PNG formats. You can share concepts with your architect, team, or clients directly.',
  },
  {
    id: 'faq-9',
    category: 'Features',
    question: 'Are the designs ready for construction?',
    answer: 'All generated layouts, floor plans, and cost estimates are conceptual and must be reviewed by a licensed architect or engineer before construction.',
  },
  {
    id: 'faq-10',
    category: 'Account & Security',
    question: 'How is my data protected?',
    answer: 'We use enterprise-grade encryption for all data in transit and at rest. Your designs are private and never shared without your consent.',
  },
  {
    id: 'faq-11',
    category: 'Account & Security',
    question: 'Can I delete my account?',
    answer: 'Yes. Go to Settings > Privacy & Security to permanently delete your account and all associated data. This action cannot be undone.',
  },
  {
    id: 'faq-12',
    category: 'Account & Security',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express). Enterprise customers can arrange invoicing for annual contracts.',
  },
];

export const faqCategories = ['All', 'Getting Started', 'Pricing & Plans', 'Features', 'Account & Security'];
