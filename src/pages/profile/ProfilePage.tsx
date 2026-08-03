import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Mail, User, Calendar, Save, Building2, Crown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/layout';
import { Button, Card, CardBody } from '../../components/ui';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setFullName(user?.user_metadata?.full_name || '');
      setAvatarUrl(user?.user_metadata?.avatar_url || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl },
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl + '?t=' + Date.now());
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Building2 size={48} className="text-gold-500" />
          </motion.div>
        </div>
      </MainLayout>
    );
  }

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
            <h1 className="text-3xl font-display font-bold mb-2">Profile</h1>
            <p className="text-luxury-silver">Manage your personal information and preferences</p>
          </div>

          {/* Profile Card */}
          <Card variant="glass" className="mb-6">
            <CardBody className="p-8">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gold-500/10">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-gold-400 to-gold-500">
                    <div className="w-full h-full rounded-full overflow-hidden bg-luxury-charcoal flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-luxury-silver" />
                      )}
                    </div>
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-luxury-black/70">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Building2 size={24} className="text-gold-400" />
                      </motion.div>
                    ) : (
                      <Camera size={24} className="text-gold-400" />
                    )}
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-luxury-pearl">{fullName || 'Designer'}</h2>
                  <p className="text-luxury-silver">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium">
                      Free Plan
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-luxury pl-12"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input-luxury pl-12 opacity-60 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-luxury-silver/50 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-luxury-pearl/70 mb-2">Member Since</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                    <input
                      type="text"
                      value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                      disabled
                      className="input-luxury pl-12 opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button variant="primary" onClick={handleSave} loading={saving} icon={<Save size={18} />}>
                  Save Changes
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Projects', value: '0', icon: <Building2 size={20} /> },
              { label: 'Designs', value: '0', icon: <User size={20} /> },
              { label: 'Downloads', value: '0', icon: <Crown size={20} /> },
            ].map((stat, index) => (
              <Card key={index} variant="glass">
                <CardBody className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                      {stat.icon}
                    </div>
                    <span className="text-luxury-silver text-sm">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-luxury-pearl">{stat.value}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Upgrade Banner */}
          <Card className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border-gold-500/20">
            <CardBody className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                    <Crown size={24} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-luxury-pearl">Upgrade to Pro</h3>
                    <p className="text-sm text-luxury-silver">Get unlimited projects and premium features</p>
                  </div>
                </div>
                <Button variant="primary" onClick={() => navigate('/pricing')}>
                  Upgrade Now
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
