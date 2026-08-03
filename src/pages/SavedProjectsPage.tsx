import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PageLayout } from '../components/common';
import { Card, CardBody, Button } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Generation } from '../types';

export function SavedProjectsPage() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const loadSaved = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      let query = supabase.from('generations').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (filter === 'favorites') query = query.eq('is_favorite', true);
      const { data, error } = await query;
      if (error) throw error;
      setGenerations(data ?? []);
    } catch {
      // best effort
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  const handleToggleFavorite = async (gen: Generation) => {
    const newFav = !gen.is_favorite;
    setGenerations((prev) => prev.map((g) => g.id === gen.id ? { ...g, is_favorite: newFav } : g));
    try {
      await supabase.from('generations').update({ is_favorite: newFav }).eq('id', gen.id);
    } catch {}
  };

  const handleDelete = async (gen: Generation) => {
    setGenerations((prev) => prev.filter((g) => g.id !== gen.id));
    try {
      await supabase.from('generations').delete().eq('id', gen.id);
    } catch {}
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center mx-auto mb-6">
            <Heart size={36} className="text-accent-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Sign in to save projects</h1>
          <p className="text-ink-600 dark:text-ink-400 mb-8">Create an account to save your generations and access them anytime.</p>
          <Link to="/generate"><Button variant="primary" size="lg" icon={<Sparkles size={20} />}>Start Creating</Button></Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            <span className="gradient-text">Saved Projects</span>
          </h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">Your generated architectural visualizations.</p>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-accent-500 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400'}`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'favorites' ? 'bg-accent-500 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400'}`}
          >
            Favorites
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/3] skeleton rounded-2xl" />)}
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={36} className="text-ink-400" />
            </div>
            <p className="text-lg font-medium text-ink-700 dark:text-ink-300 mb-2">No saved projects yet</p>
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">Generate your first architectural visualization!</p>
            <Link to="/generate"><Button variant="primary" icon={<Sparkles size={18} />}>Generate Now</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generations.map((gen, i) => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={gen.image_url} alt={gen.original_prompt} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button
                        onClick={() => handleToggleFavorite(gen)}
                        className="p-2 rounded-lg bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                        aria-label="Toggle favorite"
                      >
                        <Heart size={16} className={gen.is_favorite ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                      <button
                        onClick={() => handleDelete(gen)}
                        className="p-2 rounded-lg bg-black/30 backdrop-blur-sm text-white hover:bg-red-500/80 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <CardBody className="p-4">
                    <p className="text-sm text-ink-600 dark:text-ink-400 line-clamp-2">{gen.original_prompt}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
