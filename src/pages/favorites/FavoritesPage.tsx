import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { MainLayout } from '../../components/layout';
import { Card, CardBody, Button } from '../../components/ui';
import { EmptyState } from '../../components/common';

export function FavoritesPage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Favorites</h1>
          <p className="text-luxury-silver">Your saved and starred architectural designs</p>
        </motion.div>

        <Card variant="glass" className="py-20">
          <CardBody>
            <EmptyState
              icon={<Heart size={36} />}
              title="No Favorites Yet"
              description="Star your favorite designs while chatting with ArchiMind AI to save them here for quick access."
              action={
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/chat')}
                  icon={<Plus size={20} />}
                >
                  Start Designing
                </Button>
              }
            />
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
