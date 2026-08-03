import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, MessageSquare, Download, Clock, TrendingUp,
  BarChart3, Zap, Target,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/layout';
import { Card, CardBody } from '../../components/ui';

interface UsageStats {
  totalProjects: number;
  totalMessages: number;
  totalDownloads: number;
  thisMonthProjects: number;
}

const monthlyData = [
  { month: 'Jan', projects: 2 },
  { month: 'Feb', projects: 4 },
  { month: 'Mar', projects: 3 },
  { month: 'Apr', projects: 6 },
  { month: 'May', projects: 5 },
  { month: 'Jun', projects: 8 },
  { month: 'Jul', projects: 4 },
];

const styleUsage = [
  { style: 'Modern', count: 12, percent: 35 },
  { style: 'Minimalist', count: 8, percent: 23 },
  { style: 'Luxury', count: 6, percent: 17 },
  { style: 'Mediterranean', count: 5, percent: 14 },
  { style: 'Japanese', count: 4, percent: 11 },
];

export function UsagePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UsageStats>({
    totalProjects: 0,
    totalMessages: 0,
    totalDownloads: 0,
    thisMonthProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const { count: projectCount } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      setStats({
        totalProjects: projectCount || 0,
        totalMessages: 0,
        totalDownloads: 0,
        thisMonthProjects: 0,
      });
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  const maxProjects = Math.max(...monthlyData.map((d) => d.projects));

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: Building2, color: 'gold' },
    { label: 'Messages Sent', value: stats.totalMessages, icon: MessageSquare, color: 'blue' },
    { label: 'Downloads', value: stats.totalDownloads, icon: Download, color: 'green' },
    { label: 'This Month', value: stats.thisMonthProjects, icon: TrendingUp, color: 'purple' },
  ];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Usage Statistics</h1>
          <p className="text-luxury-silver mb-8">Track your design activity and platform usage</p>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card variant="glass">
                  <CardBody className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center mb-3 text-gold-400">
                      <stat.icon size={20} />
                    </div>
                    {loading ? (
                      <div className="h-8 w-16 bg-luxury-charcoal rounded animate-pulse" />
                    ) : (
                      <p className="text-3xl font-display font-bold text-luxury-pearl">{stat.value}</p>
                    )}
                    <p className="text-sm text-luxury-silver mt-1">{stat.label}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Monthly Activity Chart */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Monthly Activity</h3>
                  <p className="text-sm text-luxury-silver">Projects created per month</p>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3 h-48 pt-4">
                {monthlyData.map((data, i) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.projects / maxProjects) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-gold-500 to-gold-400 rounded-t-lg min-h-[4px] relative group"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gold-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.projects}
                      </span>
                    </motion.div>
                    <span className="text-xs text-luxury-silver">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Style Usage */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Style Preferences</h3>
                  <p className="text-sm text-luxury-silver">Your most used architecture styles</p>
                </div>
              </div>

              <div className="space-y-4">
                {styleUsage.map((style, i) => (
                  <motion.div
                    key={style.style}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-luxury-pearl">{style.style}</span>
                      <span className="text-sm text-luxury-silver">{style.count} projects</span>
                    </div>
                    <div className="h-2 rounded-full bg-luxury-charcoal overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${style.percent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Plan Usage */}
          <Card className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border-gold-500/20">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Plan Usage</h3>
                  <p className="text-sm text-luxury-silver">Free Plan: 0 of 3 projects used this month</p>
                </div>
              </div>
              <div className="h-3 rounded-full bg-luxury-charcoal/50 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
