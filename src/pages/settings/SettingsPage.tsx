import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Monitor,
  Volume2,
  VolumeX,
  Globe,
  Bell,
  BellOff,
  Shield,
  Trash2,
  LogOut,
  Building2,
  Check,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { MainLayout } from '../../components/layout';
import { Button, Card, CardBody, Modal } from '../../components/ui';

type ThemeMode = 'light' | 'dark' | 'system';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: theme as ThemeMode,
    voiceEnabled: true,
    notificationsEnabled: true,
    language: 'en',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
    if (newTheme !== 'system') {
      setTheme(newTheme);
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemDark ? 'dark' : 'light');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    await signOut();
    navigate('/');
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
  ];

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
            <p className="text-luxury-silver">Customize your ArchiMind experience</p>
          </div>

          {/* Appearance */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <Sun size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Appearance</h3>
                  <p className="text-sm text-luxury-silver">Choose your preferred theme</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { mode: 'light' as ThemeMode, icon: <Sun size={20} />, label: 'Light' },
                  { mode: 'dark' as ThemeMode, icon: <Moon size={20} />, label: 'Dark' },
                  { mode: 'system' as ThemeMode, icon: <Monitor size={20} />, label: 'System' },
                ].map(({ mode, icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => handleThemeChange(mode)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                      settings.theme === mode
                        ? 'bg-gold-500/10 border-2 border-gold-500/40'
                        : 'bg-luxury-charcoal/30 border border-gold-500/10 hover:border-gold-500/30'
                    }`}
                  >
                    {settings.theme === mode && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-gold-400" />
                      </div>
                    )}
                    <span className={settings.theme === mode ? 'text-gold-400' : 'text-luxury-silver'}>
                      {icon}
                    </span>
                    <span className={`text-sm ${settings.theme === mode ? 'text-gold-400' : 'text-luxury-silver'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Voice & Audio */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    {settings.voiceEnabled ? (
                      <Volume2 size={20} className="text-blue-400" />
                    ) : (
                      <VolumeX size={20} className="text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-luxury-pearl">Voice Output</h3>
                    <p className="text-sm text-luxury-silver">Read AI responses aloud</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }))}
                  className={`w-14 h-8 rounded-full relative transition-all duration-300 ${
                    settings.voiceEnabled ? 'bg-gold-500' : 'bg-luxury-charcoal'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.voiceEnabled ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                  />
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Notifications */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    {settings.notificationsEnabled ? (
                      <Bell size={20} className="text-yellow-400" />
                    ) : (
                      <BellOff size={20} className="text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-luxury-pearl">Notifications</h3>
                    <p className="text-sm text-luxury-silver">Get updates about your projects</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))}
                  className={`w-14 h-8 rounded-full relative transition-all duration-300 ${
                    settings.notificationsEnabled ? 'bg-gold-500' : 'bg-luxury-charcoal'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.notificationsEnabled ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                  />
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Language */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Globe size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Language</h3>
                  <p className="text-sm text-luxury-silver">Select your preferred language</p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-luxury-charcoal/50 border border-gold-500/10 text-luxury-pearl focus:outline-none focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/20 cursor-pointer appearance-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-luxury-charcoal">
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-luxury-silver">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Privacy & Security */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Shield size={20} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-luxury-pearl">Privacy & Security</h3>
                  <p className="text-sm text-luxury-silver">Manage your account security</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-luxury-charcoal/50 border border-gold-500/10 hover:border-gold-500/30 transition-all text-left"
                >
                  <LogOut size={20} className="text-luxury-silver" />
                  <div>
                    <p className="font-medium text-luxury-pearl">Sign Out</p>
                    <p className="text-xs text-luxury-silver">Log out of your account</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-all text-left"
                >
                  <Trash2 size={20} className="text-red-400" />
                  <div>
                    <p className="font-medium text-red-400">Delete Account</p>
                    <p className="text-xs text-red-400/70">Permanently delete your account and data</p>
                  </div>
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Version Info */}
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 size={20} className="text-gold-500" />
              <span className="font-display font-bold text-gold-400">ArchiMind AI</span>
            </div>
            <p className="text-sm text-luxury-silver">Version 1.0.0</p>
            <p className="text-xs text-luxury-silver/50 mt-1">Built with React, TypeScript & Tailwind CSS</p>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} className="text-red-400" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Delete Your Account?</h3>
          <p className="text-luxury-silver mb-6 max-w-sm mx-auto">
            This action cannot be undone. All your projects, designs, and data will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} className="flex-1 bg-red-500 hover:bg-red-600">
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
