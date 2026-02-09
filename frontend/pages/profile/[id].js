import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../components/AuthContext';
import api from '../../lib/api';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionPending, setConnectionPending] = useState(false);
  const [editData, setEditData] = useState({
    bio: '',
    age: '',
    kids: '',
    retired: false,
    groups: '',
    hobbies: '',
  });

  // Protect route
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/');
    }
  }, [token, authLoading, router]);

  // Load profile
  useEffect(() => {
    if (token && id) {
      loadProfile();
    }
  }, [token, id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/members/${id}`);
      const profileData = response.data.data;
      setProfile(profileData);
      setEditData({
        bio: profileData.bio || '',
        age: profileData.age || '',
        kids: profileData.kids || '',
        retired: profileData.retired || false,
        groups: Array.isArray(profileData.groups)
          ? profileData.groups.join(', ')
          : profileData.groups || '',
        hobbies: profileData.hobbies || '',
      });

      // Check connection status if not own profile
      if (user?.id !== parseInt(id)) {
        try {
          const connRes = await api.get(`/connections/status/${id}`);
          setIsConnected(connRes.data.data.connected);
          setConnectionPending(connRes.data.data.pending);
        } catch (err) {
          console.error('Failed to load connection status:', err);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        ...editData,
        groups: editData.groups
          .split(',')
          .map(g => g.trim())
          .filter(g => g),
      };

      await api.put(`/members/${user.id}`, updateData);
      setProfile(prev => ({
        ...prev,
        ...updateData,
      }));
      setEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleConnect = async () => {
    try {
      await api.post(`/connections/request`, { to_user_id: parseInt(id) });
      setConnectionPending(true);
    } catch (error) {
      console.error('Failed to send connection request:', error);
      alert('Failed to send connection request');
    }
  };

  const handleMessage = () => {
    router.push(`/messages?user=${id}`);
  };

  if (authLoading || !token || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile not found</h1>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === parseInt(id);
  const groupsArray = Array.isArray(profile.groups)
    ? profile.groups
    : (profile.groups || '').split(',').map(g => g.trim()).filter(g => g);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-8">
            <div className="flex items-end space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary font-bold text-3xl shadow-sm">
                {profile.first_name?.[0]}
                {profile.last_name?.[0]}
              </div>
              <div className="pb-2">
                <h1 className="text-4xl font-bold text-white">
                  {profile.first_name} {profile.last_name}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              {profile.bio && (
                <p className="text-gray-600 text-base">{profile.bio}</p>
              )}
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex gap-3">
                {!isConnected && !connectionPending ? (
                  <button
                    onClick={handleConnect}
                    className="btn-primary"
                  >
                    Connect
                  </button>
                ) : connectionPending ? (
                  <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
                    Request Pending
                  </button>
                ) : null}

                {isConnected && (
                  <button
                    onClick={handleMessage}
                    className="btn-primary"
                  >
                    Message
                  </button>
                )}
              </div>
            )}

            {isOwnProfile && (
              <button
                onClick={() => setEditing(!editing)}
                className="btn-primary"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Information</h2>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleEditChange}
                      className="input-primary w-full h-24"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={editData.age}
                        onChange={handleEditChange}
                        className="input-primary w-full"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kids
                      </label>
                      <input
                        type="number"
                        name="kids"
                        value={editData.kids}
                        onChange={handleEditChange}
                        className="input-primary w-full"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="retired"
                        checked={editData.retired}
                        onChange={handleEditChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">Retired</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hobbies
                    </label>
                    <input
                      type="text"
                      name="hobbies"
                      value={editData.hobbies}
                      onChange={handleEditChange}
                      className="input-primary w-full"
                      placeholder="Gardening, Reading, etc."
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary w-full"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.age && (
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="font-medium text-gray-900">{profile.age}</p>
                    </div>
                  )}
                  {profile.kids !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Kids</p>
                      <p className="font-medium text-gray-900">{profile.kids}</p>
                    </div>
                  )}
                  {profile.retired && (
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-gray-900">Retired</p>
                    </div>
                  )}
                  {profile.hobbies && (
                    <div>
                      <p className="text-sm text-gray-600">Hobbies</p>
                      <p className="font-medium text-gray-900">{profile.hobbies}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Groups & Interests */}
            {editing ? (
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Groups</h2>
                <input
                  type="text"
                  name="groups"
                  value={editData.groups}
                  onChange={handleEditChange}
                  className="input-primary w-full"
                  placeholder="Comma separated: Small Group, Music Ministry, etc."
                />
              </div>
            ) : groupsArray.length > 0 ? (
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Groups & Ministry</h2>
                <div className="flex flex-wrap gap-2">
                  {groupsArray.map((group, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-light text-white"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Groups & Ministry</h2>
                <p className="text-gray-500 text-sm">No groups added yet</p>
              </div>
            )}

            {/* Connection Status */}
            {!isOwnProfile && (
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h2>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isConnected ? 'bg-green-500' : connectionPending ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  ></div>
                  <span className="font-medium text-gray-900">
                    {isConnected ? 'Connected' : connectionPending ? 'Request Pending' : 'Not Connected'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
