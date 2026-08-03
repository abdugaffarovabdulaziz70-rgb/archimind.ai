import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/layout';
import { Card, CardBody, Button } from '../../components/ui';
import { EmptyState } from '../../components/common';

interface Notification {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('id, title, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) {
        setNotifications(
          data.map((d) => ({
            id: d.id,
            title: `Project updated: ${d.title}`,
            body: 'Your architectural design has new activity.',
            created_at: d.created_at,
          }))
        );
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Notifications</h1>
          <p className="text-luxury-silver">Stay updated on your projects and activity</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-luxury p-6 animate-pulse">
                <div className="h-5 bg-luxury-charcoal rounded w-1/2 mb-3" />
                <div className="h-4 bg-luxury-charcoal rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <Card variant="glass" className="py-20">
            <CardBody>
              <EmptyState
                icon={<Bell size={36} />}
                title="No Notifications Yet"
                description="When you create projects or receive updates, you will see them here."
                action={
                  <Link to="/dashboard">
                    <Button variant="primary" size="lg" icon={<Sparkles size={20} />}>
                      Go to Dashboard
                    </Button>
                  </Link>
                }
              />
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((n, index) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <Card hover>
                  <CardBody className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0 text-gold-400">
                      <Bell size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-luxury-pearl mb-1">{n.title}</p>
                      <p className="text-sm text-luxury-silver">{n.body}</p>
                      <p className="text-xs text-luxury-silver/50 mt-2">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
