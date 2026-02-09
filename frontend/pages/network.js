import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ConnectionTree from '../components/ConnectionTree';
import { useAuth } from '../components/AuthContext';

export default function Network() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  // Protect route
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/');
    }
  }, [token, authLoading, router]);

  if (authLoading || !token || !user) {
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
          <h1 className="text-3xl font-bold text-gray-900">Connection Network</h1>
          <p className="text-gray-600 mt-2">
            Visualize how you're connected across the Vineyard Church community
          </p>
        </div>

        {/* Network Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tree View */}
          <div className="lg:col-span-2">
            <ConnectionTree userId={user.id} />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Network</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Direct Connections</p>
                  <p className="text-3xl font-bold text-primary">Loading...</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Extended Network</p>
                  <p className="text-3xl font-bold text-primary-light">Loading...</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Potential Connections</p>
                  <p className="text-3xl font-bold text-accent">Loading...</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm text-gray-700">Direct Connection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-light rounded-full"></div>
                  <span className="text-sm text-gray-700">Secondary Connection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 border-2 border-primary rounded-full"></div>
                  <span className="text-sm text-gray-700">You</span>
                </div>
              </div>
            </div>

            {/* Network Benefits */}
            <div className="bg-gradient-to-br from-primary-light to-primary text-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold mb-3">Network Tips</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-xl">✨</span>
                  <span>Click on names to view and edit profile info</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-xl">🤝</span>
                  <span>Expand branches to see connections</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-xl">💬</span>
                  <span>Connect with more members to grow your network</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* About Network */}
        <div className="mt-8 bg-white rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About Your Network</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="mb-4">
                Your connection network shows how you're linked to other members in the Vineyard Church community. Each person you're connected to can introduce you to their connections, expanding your network.
              </p>
            </div>
            <div>
              <p className="mb-4">
                A stronger network helps you:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Find members with shared interests</li>
                <li>Discover volunteering opportunities</li>
                <li>Join relevant small groups</li>
                <li>Support fellow church members</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
