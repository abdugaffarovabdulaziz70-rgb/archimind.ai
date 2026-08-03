import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Plus } from 'lucide-react';
import { MainLayout } from '../../components/layout';
import { Card, CardBody, Button } from '../../components/ui';
import { EmptyState } from '../../components/common';

export function DownloadsPage() {
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
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Downloads</h1>
          <p className="text-luxury-silver">Your exported floor plans, renders, and reports</p>
        </motion.div>

        <Card variant="glass" className="py-20">
          <CardBody>
            <EmptyState
              icon={<Download size={36} />}
              title="No Downloads Yet"
              description="Export your designs as PDF or PNG from any project to find them here, ready to share with your team or architect."
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
