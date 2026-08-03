import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  Settings,
  Shield,
  BarChart3,
  FileText,
  Bell,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { MainLayout } from '../../components/layout';
import { Card, CardBody, Button, Avatar } from '../../components/ui';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  projects_count: number;
  status: 'active' | 'suspended';
}

const stats: Stat[] = [
  { label: 'Total Users', value: '2,547', change: '+12%', icon: <Users size={22} />, color: 'gold' },
  { label: 'Active Projects', value: '1,893', change: '+8%', icon: <Building2 size={22} />, color: 'green' },
  { label: 'Revenue', value: '$45,320', change: '+24%', icon: <DollarSign size={22} />, color: 'blue' },
  { label: 'Growth', value: '18.5%', change: '+5%', icon: <TrendingUp size={22} />, color: 'purple' },
];

const mockUsers: User[] = [
  { id: '1', email: 'alex@example.com', full_name: 'Alex Chen', role: 'premium', created_at: '2024-01-15', projects_count: 12, status: 'active' },
  { id: '2', email: 'maria@example.com', full_name: 'Maria Garcia', role: 'user', created_at: '2024-02-20', projects_count: 5, status: 'active' },
  { id: '3', email: 'john@example.com', full_name: 'John Smith', role: 'user', created_at: '2024-03-10', projects_count: 3, status: 'active' },
  { id: '4', email: 'sofia@example.com', full_name: 'Sofia Rodriguez', role: 'premium', created_at: '2024-03-15', projects_count: 18, status: 'active' },
  { id: '5', email: 'david@example.com', full_name: 'David Kim', role: 'user', created_at: '2024-04-01', projects_count: 7, status: 'suspended' },
];

const recentActivity = [
  { id: '1', type: 'project', user: 'Alex Chen', action: 'created a new villa project', time: '5 min ago' },
  { id: '2', type: 'user', user: 'Maria Garcia', action: 'upgraded to premium', time: '15 min ago' },
  { id: '3', type: 'project', user: 'Sofia Rodriguez', action: 'exported floor plan PDF', time: '30 min ago' },
  { id: '4', type: 'report', user: 'System', action: 'Weekly report generated', time: '1 hour ago' },
  { id: '5', type: 'user', user: 'John Smith', action: 'joined ArchiMind', time: '2 hours ago' },
];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Building2 size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                <Shield size={32} className="text-gold-400" />
                Admin Panel
              </h1>
              <p className="text-luxury-silver mt-1">Manage users, projects, and platform settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" icon={<Bell size={18} />}>
                Notifications
              </Button>
              <Button variant="primary" icon={<Settings size={18} />}>
                Settings
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'bg-luxury-charcoal/30 text-luxury-silver hover:text-luxury-pearl border border-gold-500/10 hover:border-gold-500/30'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card variant="glass">
                      <CardBody className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            stat.color === 'gold' ? 'bg-gold-500/10 text-gold-400' :
                            stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                            stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-purple-500/10 text-purple-400'
                          }`}>
                            {stat.icon}
                          </div>
                          {stat.change && (
                            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                              {stat.change}
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-luxury-pearl">{stat.value}</p>
                        <p className="text-sm text-luxury-silver">{stat.label}</p>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Activity & Quick Actions */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card variant="glass">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Activity size={20} className="text-gold-400" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-luxury-charcoal/30">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            activity.type === 'project' ? 'bg-gold-500/10 text-gold-400' :
                            activity.type === 'user' ? 'bg-green-500/10 text-green-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {activity.type === 'project' ? <Building2 size={16} /> :
                             activity.type === 'user' ? <Users size={16} /> :
                             <FileText size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium text-luxury-pearl">{activity.user}</span>{' '}
                              <span className="text-luxury-silver">{activity.action}</span>
                            </p>
                            <p className="text-xs text-luxury-silver/50">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Stats */}
                <Card variant="glass">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-gold-400" />
                      Platform Health
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Server Uptime', value: '99.9%', status: 'good' },
                        { label: 'API Response Time', value: '142ms', status: 'good' },
                        { label: 'Active Sessions', value: '847', status: 'normal' },
                        { label: 'Storage Used', value: '67%', status: 'warning' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-luxury-silver">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-luxury-pearl">{item.value}</span>
                            <span className={`w-2 h-2 rounded-full ${
                              item.status === 'good' ? 'bg-green-500' :
                              item.status === 'warning' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card variant="glass">
              <CardBody className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="relative w-full sm:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-silver" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-luxury-charcoal/50 border border-gold-500/10 text-luxury-pearl placeholder:text-luxury-silver/40 focus:outline-none focus:border-gold-500/40"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold-500/10">
                        <th className="text-left py-3 px-4 text-sm font-medium text-luxury-silver">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-luxury-silver">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-luxury-silver">Projects</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-luxury-silver">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-luxury-silver">Joined</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-luxury-silver">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gold-500/5 hover:bg-white/[0.02]">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar size="sm" />
                              <div>
                                <p className="font-medium text-luxury-pearl">{user.full_name}</p>
                                <p className="text-sm text-luxury-silver">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              user.role === 'premium' ? 'bg-gold-500/10 text-gold-400' : 'bg-luxury-charcoal/50 text-luxury-silver'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-luxury-pearl">{user.projects_count}</td>
                          <td className="py-4 px-4">
                            <span className={`flex items-center gap-1 text-xs ${
                              user.status === 'active' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {user.status === 'active' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-luxury-silver text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 rounded-lg hover:bg-white/5 text-luxury-silver hover:text-luxury-pearl transition-colors">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-white/5 text-luxury-silver hover:text-yellow-400 transition-colors">
                                <Ban size={16} />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-red-500/10 text-luxury-silver hover:text-red-400 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab === 'projects' || activeTab === 'reports' || activeTab === 'analytics' || activeTab === 'settings') && (
            <Card variant="glass">
              <CardBody className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                  {tabs.find(t => t.id === activeTab)?.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 capitalize">{activeTab} Dashboard</h3>
                <p className="text-luxury-silver">This section is coming soon. Full {activeTab} management features are under development.</p>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
