import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  ArrowRight,
  Sparkles,
  FolderOpen,
  Heart,
  TrendingUp,
  Clock,
  Download,
  Crown,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/layout';
import { Card, CardBody, Button } from '../../components/ui';

interface Project {
  id: string;
  title: string;
  description: string;
  project_type: string;
  style: string;
  status: string;
  created_at: string;
  favorites_count: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

const projectTypeIcons: Record<string, React.ReactNode> = {
  house: <Building2 size={20} />,
  villa: <Building2 size={20} />,
  apartment: <Building2 size={20} />,
  office: <Building2 size={20} />,
};

const examplePrompts = [
  {
    title: 'Design a Modern Villa',
    prompt: 'Design a modern villa on a 20x30 meter plot with 5 bedrooms, swimming pool, rooftop garden, 3-car garage and luxury interior.',
    type: 'villa',
  },
  {
    title: 'Create a Minimalist House',
    prompt: 'Create a minimalist Japanese-inspired house with 3 bedrooms, zen garden, and natural materials.',
    type: 'house',
  },
  {
    title: 'Plan a Contemporary Office',
    prompt: 'Plan a contemporary office space for 50 employees with open floor plan, meeting rooms, and sustainable features.',
    type: 'office',
  },
  {
    title: 'Design a Luxury Apartment',
    prompt: 'Design a luxury apartment with panoramic views, rooftop terrace, smart home integration, and premium finishes.',
    type: 'apartment',
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    favorites: 0,
    downloads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const { data: projects, error } = await supabase
        .from('chats')
        .select('id, title, created_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(6);

      if (projects) {
        setRecentProjects(projects.map(p => ({
          id: p.id,
          title: p.title,
          description: '',
          project_type: 'project',
          style: 'modern',
          status: 'completed',
          created_at: p.created_at,
          favorites_count: 0,
        })));
        setStats({
          totalProjects: projects.length,
          completedProjects: projects.length,
          favorites: 0,
          downloads: 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    navigate('/chat');
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="card-luxury p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
                    {greeting()}, <span className="gold-text">{user?.user_metadata?.full_name || 'Designer'}</span>
                  </h1>
                  <p className="text-lg text-luxury-silver">
                    Ready to bring your architectural vision to life?
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="xl"
                  onClick={handleNewProject}
                  icon={<Sparkles size={22} />}
                >
                  New Project
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Projects', value: stats.totalProjects, icon: <FolderOpen size={22} />, color: 'gold' },
            { label: 'Completed', value: stats.completedProjects, icon: <TrendingUp size={22} />, color: 'green' },
            { label: 'Favorites', value: stats.favorites, icon: <Heart size={22} />, color: 'red' },
            { label: 'Downloads', value: stats.downloads, icon: <Download size={22} />, color: 'blue' },
          ].map((stat, index) => (
            <Card key={index} variant="glass">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === 'gold' ? 'bg-gold-500/10 text-gold-400' :
                    stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                    stat.color === 'red' ? 'bg-red-500/10 text-red-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-luxury-silver">{stat.label}</p>
              </CardBody>
            </Card>
          ))}
        </motion.div>

        {/* Quick Start Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold">Quick Start</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examplePrompts.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <button
                  onClick={() => navigate('/chat', { state: { prompt: item.prompt } })}
                  className="w-full text-left group"
                >
                  <Card hover className="h-full">
                    <CardBody className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/20 transition-colors">
                          <Building2 size={18} />
                        </div>
                        <h3 className="font-semibold text-luxury-pearl group-hover:text-gold-400 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-luxury-silver line-clamp-2">
                        {item.prompt}
                      </p>
                    </CardBody>
                  </Card>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-gold-400 hover:text-gold-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-luxury p-6 animate-pulse">
                  <div className="h-5 bg-luxury-charcoal rounded w-3/4 mb-3" />
                  <div className="h-4 bg-luxury-charcoal rounded w-1/2 mb-4" />
                  <div className="h-20 bg-luxury-charcoal rounded" />
                </div>
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <Card variant="glass" className="py-16">
              <CardBody className="text-center">
                <div className="w-20 h-20 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={36} className="text-gold-400" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">No Projects Yet</h3>
                <p className="text-luxury-silver mb-6 max-w-sm mx-auto">
                  Start your first architectural project and watch your vision come to life
                </p>
                <Button variant="primary" size="lg" onClick={handleNewProject} icon={<Plus size={20} />}>
                  Create Project
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <Link to={`/chat/${project.id}`}>
                    <Card hover className="h-full group">
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                            <Building2 size={24} />
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium">
                            {project.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-luxury-pearl mb-2 group-hover:text-gold-400 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-luxury-silver">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upgrade Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border-gold-500/20">
            <CardBody className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center">
                    <Crown size={28} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold mb-1">Upgrade to Pro</h3>
                    <p className="text-luxury-silver">Unlock unlimited projects, high-quality renders, and team collaboration</p>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
