import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Download, X, Search } from 'lucide-react';
import { PageLayout } from '../components/common';
import { Card, CardBody } from '../components/ui';
import { supabase } from '../lib/supabase';
import type { Generation } from '../types';

export function GalleryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Generation | null>(null);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(60);

      if (error) throw error;
      setGenerations(data ?? []);
    } catch {
      // Gallery may be empty initially
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGallery(); }, [loadGallery]);

  const filtered = generations.filter((g) =>
    g.original_prompt.toLowerCase().includes(search.toLowerCase()) ||
    g.enhanced_prompt.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">
            Explore architectural visualizations created by the ArchiMind AI community.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-xl mb-8">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search gallery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/3] skeleton rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={36} className="text-ink-400" />
            </div>
            <p className="text-lg font-medium text-ink-700 dark:text-ink-300 mb-2">No images yet</p>
            <p className="text-sm text-ink-500 dark:text-ink-400">Be the first to share your creation in the gallery!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((gen, i) => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card hover className="overflow-hidden group cursor-pointer" onClick={() => setSelected(gen)}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={gen.image_url} alt={gen.original_prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm font-medium line-clamp-2">{gen.original_prompt}</p>
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

      {/* Lightbox */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl w-full bg-white dark:bg-ink-900 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/20 text-white hover:bg-black/40 transition-colors">
              <X size={20} />
            </button>
            <img src={selected.image_url} alt={selected.original_prompt} className="w-full max-h-[60vh] object-contain" />
            <div className="p-6">
              <h3 className="font-semibold mb-2">{selected.original_prompt}</h3>
              <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-4">{selected.enhanced_prompt}</p>
              <div className="flex gap-2">
                <button onClick={() => window.open(selected.image_url, '_blank')} className="btn-secondary text-sm">
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </PageLayout>
  );
}
