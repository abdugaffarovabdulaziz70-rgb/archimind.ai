import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/layout';
import { Card, CardBody, Button } from '../../components/ui';
import { EmptyState } from '../../components/common';

interface Project {
  id: string;
  title: string;
  project_type: string;
  style: string;
  status: string;
  created_at: string;
}

export function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProjects();
  }, [user]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('id, title, created_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setProjects(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            project_type: 'project',
            style: 'modern',
            status: 'completed',
            created_at: p.created_at,
          }))
        );
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">My Projects</h1>
          <p className="text-luxury-silver">Browse and manage all your architectural designs</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-luxury p-6 animate-pulse">
                <div className="h-5 bg-luxury-charcoal rounded w-3/4 mb-3" />
                <div className="h-4 bg-luxury-charcoal rounded w-1/2 mb-4" />
                <div className="h-20 bg-luxury-charcoal rounded" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card variant="glass" className="py-20">
            <CardBody>
              <EmptyState
                icon={<FolderOpen size={36} />}
                title="No Projects Yet"
                description="Start your first architectural project and watch your vision come to life with AI-powered design."
                action={
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/chat')}
                    icon={<Plus size={20} />}
                  >
                    Create Project
                  </Button>
                }
              />
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <Link to={`/chat/${project.id}`} className="block group">
                  <Card hover className="h-full">
                    <CardBody className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 text-gold-400">
                        <FolderOpen size={24} />
                      </div>
                      <h3 className="font-semibold text-luxury-pearl mb-2 group-hover:text-gold-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-luxury-silver">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
