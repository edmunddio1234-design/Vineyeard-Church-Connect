import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';

export default function Directory() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/');
    }
  }, [token, authLoading, router]);

  // Load members
  useEffect(() => {
    if (token) {
      loadMembers();
    }
  }, [token]);

  // Filter members based on search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = members.filter((member) => {
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      const bio = (member.bio || '').toLowerCase();
      return fullName.includes(query) || bio.includes(query);
    });
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/members');
      setMembers(response.data.data || []);
    } catch (error) {
      console.error('Failed to load members:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Member Directory</h1>
          <p className="text-gray-600 mt-2">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-primary w-full pl-12"
            />
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <ProfileCard key={member.id} profile={member} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No members yet</h3>
            <p className="text-gray-600">
              Check back soon as more members join the community
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
