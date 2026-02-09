import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    connectionsCount: 0,
    unreadMessages: 0,
    suggestionsCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/');
    }
  }, [token, authLoading, router]);

  // Load dashboard data
  useEffect(() => {
    if (token && user) {
      loadDashboardData();
    }
  }, [token, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/activity'),
      ]);

      setStats(statsRes.data.data);
      setRecentActivity(activityRes.data.data || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const quickLinks = [
    { href: '/directory', label: 'Browse Directory', icon: '👥' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/connections', label: 'Connections', icon: '🤝' },
    { href: '/suggestions', label: 'Ideas', icon: '💡' },
    { href: '/network', label: 'Network', icon: '🌐' },
    { href: `/profile/${user?.id}`, label: 'My Profile', icon: '👤' },
  ];

  const StatCard = ({ label, value, icon }) => (
    <div className="bg-white rounded-lg shadow-soft p-6 border-l-4 border-primary">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-3xl opacity-20">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, <span className="text-primary">{user?.first_name}</span>!
          </h1>
          <p className="text-gray-600 mt-2">
            Stay connected with your Vineyard Church family
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Connections" value={stats.connectionsCount} icon="🔗" />
          <StatCard label="Unread Messages" value={stats.unreadMessages} icon="📬" />
          <StatCard label="Pending Ideas" value={stats.suggestionsCount} icon="✨" />
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="bg-gradient-to-br from-primary-light to-primary text-white p-6 rounded-lg text-center hover:shadow-medium transition-shadow cursor-pointer">
                  <div className="text-3xl mb-2">{link.icon}</div>
                  <p className="text-sm font-medium">{link.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-10 h-10 bg-primary-light text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {activity.actor_first_name?.[0]}
                    {activity.actor_last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="font-medium">
                        {activity.actor_first_name} {activity.actor_last_name}
                      </span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity yet. Start connecting with your church family!</p>
              <Link href="/directory">
                <span className="text-primary hover:underline mt-2 inline-block">
                  Browse directory →
                </span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
