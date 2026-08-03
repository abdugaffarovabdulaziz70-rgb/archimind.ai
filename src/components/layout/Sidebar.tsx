import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  LogOut,
  Menu,
  X,
  Trash2,
  Home,
  FolderOpen,
  Heart,
  Download,
  Bell,
  Settings,
  Crown,
  CreditCard,
  BarChart3,
  User,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, Avatar } from '../ui';

interface SidebarProps {
  chats?: Array<{ id: string; title: string; created_at: string }>;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  currentChatId?: string;
}

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/projects', icon: FolderOpen, label: 'My Projects' },
  { path: '/favorites', icon: Heart, label: 'Favorites' },
  { path: '/downloads', icon: Download, label: 'Downloads' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/billing', icon: CreditCard, label: 'Billing' },
  { path: '/usage', icon: BarChart3, label: 'Usage' },
  { path: '/settings', icon: Settings, label: 'Settings' },
] as const;

export function Sidebar({ chats = [], onNewChat, onDeleteChat, currentChatId }: SidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  const handleNewChat = useCallback(() => {
    onNewChat();
    setIsOpen(false);
  }, [onNewChat]);

  const handleDeleteChat = useCallback((e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteChat(chatId);
  }, [onDeleteChat]);

  const recentChats = useMemo(() => chats.slice(0, 5), [chats]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-luxury-charcoal/80 backdrop-blur-xl border border-gold-500/10 text-luxury-pearl focus:outline-none focus:ring-2 focus:ring-gold-500/50"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-sidebar"
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 h-screen bg-luxury-charcoal/30 backdrop-blur-xl border-r border-gold-500/10 fixed left-0 top-0" role="navigation" aria-label="Main navigation">
        <SidebarContent
          chats={recentChats}
          currentChatId={currentChatId}
          user={user}
          isActive={isActive}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onSignOut={handleSignOut}
          isSigningOut={isSigningOut}
          onClose={() => setIsOpen(false)}
        />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-luxury-black/80 backdrop-blur-md z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              id="mobile-sidebar"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden flex flex-col w-80 h-screen bg-luxury-charcoal fixed left-0 top-0 z-50"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <SidebarContent
                chats={recentChats}
                currentChatId={currentChatId}
                user={user}
                isActive={isActive}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onSignOut={handleSignOut}
                isSigningOut={isSigningOut}
                onClose={() => setIsOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarContentProps {
  chats: Array<{ id: string; title: string; created_at: string }>;
  currentChatId?: string;
  user: any;
  isActive: (path: string) => boolean;
  onNewChat: () => void;
  onDeleteChat: (e: React.MouseEvent, chatId: string) => void;
  onSignOut: () => void;
  isSigningOut: boolean;
  onClose: () => void;
}

function SidebarContent({
  chats,
  currentChatId,
  user,
  isActive,
  onNewChat,
  onDeleteChat,
  onSignOut,
  isSigningOut,
  onClose,
}: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gold-500/10">
        <div className="flex items-center justify-between">
          <Logo size="default" />
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-luxury-silver transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            aria-label="Close navigation menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* New Project Button */}
      <div className="p-4">
        <motion.button
          onClick={onNewChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-black font-semibold hover:from-gold-300 hover:to-gold-400 transition-all shadow-gold focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-luxury-charcoal"
          aria-label="Create new project"
        >
          <Plus size={20} aria-hidden="true" />
          New Project
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="px-3 mb-4" aria-label="Main menu">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-400'
                    : 'text-luxury-silver hover:text-luxury-pearl hover:bg-white/5'
                  }
                `}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <item.icon size={20} aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Recent Projects */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-3">
          <h3 className="text-xs font-semibold text-luxury-silver/50 uppercase tracking-wider">
            Recent Projects
          </h3>
        </div>
        <ul className="space-y-1" aria-label="Recent projects">
          {chats.length === 0 ? (
            <li>
              <p className="px-4 py-2 text-sm text-luxury-silver/40">No projects yet</p>
            </li>
          ) : (
            chats.map((chat) => (
              <li key={chat.id}>
                <Link
                  to={`/chat/${chat.id}`}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group
                    ${currentChatId === chat.id
                      ? 'bg-gold-500/10 text-gold-400'
                      : 'text-luxury-silver hover:text-luxury-pearl hover:bg-white/5'
                    }
                  `}
                  aria-current={currentChatId === chat.id ? 'page' : undefined}
                >
                  <MessageSquare size={16} className="flex-shrink-0" aria-hidden="true" />
                  <span className="truncate flex-1">{chat.title}</span>
                  <button
                    onClick={(e) => onDeleteChat(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-all focus:outline-none focus:opacity-100"
                    aria-label={`Delete project: ${chat.title}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gold-500/10">
        {/* Upgrade Badge */}
        <Link
          to="/pricing"
          className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:border-gold-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          aria-label="Upgrade to Pro plan"
        >
          <Crown size={20} className="text-gold-400" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-gold-400">Upgrade to Pro</p>
            <p className="text-xs text-luxury-silver">Unlock all features</p>
          </div>
        </Link>

        {/* User Info */}
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          aria-label="View profile"
        >
          <Avatar size="md" src={user?.user_metadata?.avatar_url} status="online" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-luxury-pearl">
              {user?.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-luxury-silver truncate">{user?.email}</p>
          </div>
        </Link>

        {/* Sign Out */}
        <motion.button
          onClick={onSignOut}
          whileHover={{ scale: isSigningOut ? 1 : 1.02 }}
          whileTap={{ scale: isSigningOut ? 1 : 0.98 }}
          disabled={isSigningOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
          aria-label="Sign out"
          aria-busy={isSigningOut}
        >
          {isSigningOut ? (
            <span className="animate-spin h-5 w-5 border-2 border-red-400 border-t-transparent rounded-full" aria-hidden="true" />
          ) : (
            <LogOut size={20} aria-hidden="true" />
          )}
          <span className="font-medium">{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
        </motion.button>
      </div>
    </>
  );
}
