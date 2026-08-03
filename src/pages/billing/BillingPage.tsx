import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Crown, Download, Check, Zap, TrendingUp, Calendar,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/layout';
import { Card, CardBody, Button } from '../../components/ui';

const billingHistory = [
  { id: 'inv-001', date: 'Jul 1, 2026', amount: '$49.00', plan: 'Pro Monthly', status: 'Paid' },
  { id: 'inv-002', date: 'Jun 1, 2026', amount: '$49.00', plan: 'Pro Monthly', status: 'Paid' },
  { id: 'inv-003', date: 'May 1, 2026', amount: '$49.00', plan: 'Pro Monthly', status: 'Paid' },
];

export function BillingPage() {
  const { user } = useAuth();
  const [currentPlan] = useState('Free');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Billing</h1>
          <p className="text-luxury-silver mb-8">Manage your subscription and payment methods</p>

          {/* Current Plan */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-8">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                    {currentPlan === 'Free' ? <Zap size={28} /> : <Crown size={28} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold">{currentPlan} Plan</h2>
                    <p className="text-sm text-luxury-silver">
                      {currentPlan === 'Free' ? '3 projects per month' : '25 projects per month'}
                    </p>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button variant="primary" size="lg" icon={<TrendingUp size={18} />}>
                    {currentPlan === 'Free' ? 'Upgrade Plan' : 'Change Plan'}
                  </Button>
                </Link>
              </div>

              {/* Usage */}
              <div className="mt-8 pt-6 border-t border-gold-500/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-luxury-pearl">Projects this month</span>
                  <span className="text-sm text-luxury-silver">0 / 3</span>
                </div>
                <div className="h-2 rounded-full bg-luxury-charcoal overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-luxury-silver mt-2">Resets on August 1, 2026</p>
              </div>
            </CardBody>
          </Card>

          {/* Payment Method */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Payment Method</h3>
                  <p className="text-sm text-luxury-silver">No payment method on file</p>
                </div>
              </div>
              <Button variant="secondary" size="md" icon={<CreditCard size={18} />}>
                Add Payment Method
              </Button>
            </CardBody>
          </Card>

          {/* Billing History */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Billing History</h3>
                  <p className="text-sm text-luxury-silver">Download your invoices</p>
                </div>
              </div>

              {billingHistory.length === 0 ? (
                <div className="text-center py-8 text-luxury-silver">
                  <p className="text-sm">No billing history yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {billingHistory.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-luxury-charcoal/30 border border-gold-500/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Check size={18} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-luxury-pearl">{invoice.plan}</p>
                          <p className="text-xs text-luxury-silver">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-luxury-pearl">{invoice.amount}</span>
                        <button className="p-2 rounded-lg hover:bg-gold-500/10 text-gold-400 transition-colors" aria-label="Download invoice">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Account email */}
          <Card>
            <CardBody className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-silver">Billing email</p>
                <p className="font-medium text-luxury-pearl">{user?.email}</p>
              </div>
              <Link to="/settings">
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
