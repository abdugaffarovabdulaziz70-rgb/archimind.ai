import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Download, Copy, Check, RefreshCw, Image as ImageIcon,
  Dice5, ChevronDown, ChevronUp, AlertCircle, FileText, Heart,
} from 'lucide-react';
import { PageLayout } from '../components/common';
import { Button, Card, CardBody } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateImage } from '../lib/ai';
import { promptTemplates, randomInspirations, projectTypes } from '../data/content';
import type { ProjectType } from '../types';

type Stage = 'idle' | 'enhancing' | 'generating' | 'completed' | 'error';

export function GeneratePage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('villa');
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ enhanced_prompt: string; image_url: string } | null>(null);
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; image_url: string; enhanced: string }>>([]);

  const handleGenerate = useCallback(async (overridePrompt?: string) => {
    const userPrompt = overridePrompt ?? prompt;
    if (!userPrompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }

    setError('');
    setResult(null);
    setStage('enhancing');

    try {
      // The edge function handles both enhancement and image generation automatically
      setStage('generating');
      const data = await generateImage({ prompt: userPrompt, project_type: projectType });

      setResult(data);
      setStage('completed');
      setHistory((prev) => [{ prompt: userPrompt, image_url: data.image_url, enhanced: data.enhanced_prompt }, ...prev].slice(0, 10));
      setFavorited(false);

      // Save to database (best effort — don't block UI)
      try {
        await supabase.from('generations').insert({
          original_prompt: userPrompt,
          enhanced_prompt: data.enhanced_prompt,
          image_url: data.image_url,
          project_type: projectType,
          status: 'completed',
          user_id: user?.id ?? null,
          is_public: false,
        });
      } catch {
        // DB save is best-effort
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
      setStage('error');
    }
  }, [prompt, projectType, user]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.enhanced_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleDownload = useCallback(async () => {
    if (!result) return;
    try {
      const response = await fetch(result.image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `archimind-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(result.image_url, '_blank');
    }
  }, [result]);

  const handleRegenerate = useCallback(() => {
    handleGenerate(prompt);
  }, [handleGenerate, prompt]);

  const handleFavorite = useCallback(async () => {
    if (!result) return;
    const newFav = !favorited;
    setFavorited(newFav);
    try {
      const { data } = await supabase
        .from('generations')
        .select('id')
        .eq('image_url', result.image_url)
        .maybeSingle();
      if (data?.id) {
        await supabase.from('generations').update({ is_favorite: newFav }).eq('id', data.id);
      }
    } catch {}
  }, [result, favorited]);

  const handleRandomInspiration = useCallback(() => {
    const random = randomInspirations[Math.floor(Math.random() * randomInspirations.length)];
    setPrompt(random);
  }, []);

  const handleTemplate = useCallback((tplPrompt: string) => {
    setPrompt(tplPrompt);
  }, []);

  const isWorking = stage === 'enhancing' || stage === 'generating';

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            <span className="gradient-text">Generate</span> architectural visualizations
          </h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">
            Enter a simple idea. AI enhances it and generates a photorealistic rendering — automatically.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-ink-700 dark:text-ink-300">Your architectural idea</label>
                  <button
                    onClick={handleRandomInspiration}
                    className="flex items-center gap-1.5 text-xs text-accent-600 dark:text-accent-400 hover:text-accent-500 transition-colors"
                  >
                    <Dice5 size={14} />
                    Random inspiration
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleGenerate();
                    }
                  }}
                  placeholder="e.g. Modern luxury villa with pool, floor-to-ceiling glass walls, and minimalist landscaping"
                  rows={5}
                  className="input-field resize-none"
                  disabled={isWorking}
                />

                {/* Project type selector */}
                <div className="mt-4">
                  <label className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2 block">Project type</label>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.slice(0, 8).map((pt) => (
                      <button
                        key={pt.id}
                        onClick={() => setProjectType(pt.id)}
                        disabled={isWorking}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          projectType === pt.id
                            ? 'bg-accent-500 text-white'
                            : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:bg-ink-200 dark:hover:bg-ink-700'
                        }`}
                      >
                        <span className="mr-1">{pt.icon}</span>
                        {pt.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleGenerate()}
                  loading={isWorking}
                  disabled={!prompt.trim()}
                  size="lg"
                  icon={<Sparkles size={20} />}
                  className="w-full mt-6"
                >
                  {isWorking ? (
                    stage === 'enhancing' ? 'Enhancing prompt...' : 'Generating image...'
                  ) : (
                    'Generate Image'
                  )}
                </Button>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2"
                  >
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </CardBody>
            </Card>

            {/* Templates */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-4">Prompt templates</h3>
                <div className="space-y-2">
                  {promptTemplates.slice(0, 4).map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleTemplate(tpl.prompt)}
                      disabled={isWorking}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-800/50 hover:bg-ink-100 dark:hover:bg-ink-800 transition-all text-left group"
                    >
                      <span className="text-xl flex-shrink-0">{tpl.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{tpl.title}</p>
                        <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{tpl.prompt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* History */}
            {history.length > 0 && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-4">Prompt history</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {history.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { setPrompt(item.prompt); setResult({ enhanced_prompt: item.enhanced, image_url: item.image_url }); setStage('completed'); }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-all text-left"
                      >
                        <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <p className="text-xs text-ink-600 dark:text-ink-400 truncate">{item.prompt}</p>
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right: Result */}
          <div className="space-y-6">
            <Card className="min-h-[400px] flex flex-col">
              <CardBody className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300">Generated result</h3>
                  {result && (
                    <button
                      onClick={() => setFavorited(!favorited)}
                      className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                      aria-label="Favorite"
                    >
                      <Heart size={18} className={favorited ? 'fill-red-500 text-red-500' : 'text-ink-400'} />
                    </button>
                  )}
                </div>

                {/* Loading state */}
                {isWorking && (
                  <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 rounded-full border-4 border-accent-500/20 border-t-accent-500 mb-6"
                    />
                    <p className="text-lg font-medium text-ink-700 dark:text-ink-300 mb-2">
                      {stage === 'enhancing' ? 'Enhancing your prompt...' : 'Generating image...'}
                    </p>
                    <p className="text-sm text-ink-500 dark:text-ink-400">
                      {stage === 'enhancing' ? 'GPT-4o is expanding your idea into a professional prompt' : 'DALL-E 3 is rendering your architectural visualization'}
                    </p>

                    {/* Skeleton shimmer */}
                    <div className="w-full mt-8 space-y-3">
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="h-4 skeleton rounded w-full" />
                      <div className="h-4 skeleton rounded w-5/6" />
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {stage === 'idle' && !result && (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-4">
                      <ImageIcon size={36} className="text-ink-400" />
                    </div>
                    <p className="text-lg font-medium text-ink-700 dark:text-ink-300 mb-2">No image yet</p>
                    <p className="text-sm text-ink-500 dark:text-ink-400 max-w-xs">
                      Enter a prompt and click Generate to see your architectural visualization here.
                    </p>
                  </div>
                )}

                {/* Error state */}
                {stage === 'error' && !result && (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                      <AlertCircle size={36} className="text-red-500" />
                    </div>
                    <p className="text-lg font-medium text-ink-700 dark:text-ink-300 mb-2">Generation failed</p>
                    <p className="text-sm text-ink-500 dark:text-ink-400 max-w-xs mb-4">{error}</p>
                    <Button variant="outline" onClick={handleRegenerate} icon={<RefreshCw size={16} />}>Try Again</Button>
                  </div>
                )}

                {/* Result */}
                {result && stage === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative rounded-xl overflow-hidden mb-4 group">
                      <img src={result.image_url} alt="Generated architectural visualization" className="w-full h-auto" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      <Button variant="secondary" size="sm" onClick={handleDownload} icon={<Download size={16} />}>Download</Button>
                      <Button variant="secondary" size="sm" onClick={handleCopy} icon={copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}>
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={handleRegenerate} icon={<RefreshCw size={16} />}>Regenerate</Button>
                      <Button variant="secondary" size="sm" onClick={handleFavorite} icon={<Heart size={16} className={favorited ? 'fill-red-500 text-red-500' : ''} />}>
                        {favorited ? 'Saved' : 'Save'}
                      </Button>
                    </div>

                    {/* Enhanced prompt */}
                    <div className="rounded-xl bg-ink-50 dark:bg-ink-800/50 border border-ink-200 dark:border-ink-700 overflow-hidden">
                      <button
                        onClick={() => setShowEnhanced(!showEnhanced)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-ink-700 dark:text-ink-300">
                          <FileText size={16} className="text-accent-500" />
                          Enhanced Prompt
                        </span>
                        {showEnhanced ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}
                      </button>
                      <AnimatePresence>
                        {showEnhanced && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                              {result.enhanced_prompt}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
