import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';
import Link from 'next/link';

export default function Connections() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [myConnections, setMyConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('connections');
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/');
    }
  }, [token, authLoading, router]);

  // Load connections
  useEffect(() => {
    if (token && user) {
      loadConnections();
    }
  }, [token, user]);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const [connRes, pendRes] = await Promise.all([
        api.get('/connections/my-connections'),
        api.get('/connections/pending-requests'),
      ]);
      setMyConnections(connRes.data.data || []);
      setPendingRequests(pendRes.data.data || []);
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.post(`/connections/accept/${requestId}`);
      await loadConnections();
    } catch (error) {
      console.error('Failed to accept request:', error);
      alert('Failed to accept request');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await api.post(`/connections/decline/${requestId}`);
      await loadConnections();
    } catch (error) {
      console.error('Failed to decline request:', error);
      alert('Failed to decline request');
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (confirm('Are you sure you want to remove this connection?')) {
      try {
        await api.delete(`/connections/${connectionId}`);
        await loadConnections();
      } catch (error) {
        console.error('Failed to remove connection:', error);
        alert('Failed to remove connection');
      }
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
          <h1 className="text-3xl font-bold text-gray-900">My Connections</h1>
          <p className="text-gray-600 mt-2">
            {activeTab === 'connections'
              ? `${myConnections.length} connection${myConnections.length !== 1 ? 's' : ''}`
              : `${pendingRequests.length} pending request${pendingRequests.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'connections'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Connections ({myConnections.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : activeTab === 'connections' ? (
          // My Connections
          myConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="bg-white rounded-lg shadow-soft p-6 flex flex-col"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary-light text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {connection.first_name?.[0]}
                      {connection.last_name?.[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {connection.first_name} {connection.last_name}
                      </h3>
                      {connection.bio && (
                        <p className="text-sm text-gray-600 truncate">{connection.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      href={`/messages?user=${connection.id}`}
                      className="flex-1 py-2 px-4 bg-primary text-white rounded-lg text-center text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Message
                    </Link>
                    <button
                      onClick={() => handleRemoveConnection(connection.id)}
                      className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No connections yet</h3>
              <p className="text-gray-600 mb-4">
                Start connecting with members to build your network
              </p>
              <Link href="/directory">
                <span className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                  Browse Directory
                </span>
              </Link>
            </div>
          )
        ) : (
          // Pending Requests
          pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow-soft p-6 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-light text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {request.first_name?.[0]}
                      {request.last_name?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {request.first_name} {request.last_name}
                      </h3>
                      {request.bio && (
                        <p className="text-sm text-gray-600">{request.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600">
                You're all caught up!
              </p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
