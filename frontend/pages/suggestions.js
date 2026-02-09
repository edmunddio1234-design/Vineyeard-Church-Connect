import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';

export default function Suggestions() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
  });
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState(new Set());

  // Protect route
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/');
    }
  }, [token, authLoading, router]);

  // Load suggestions
  useEffect(() => {
    if (token && user) {
      loadSuggestions();
    }
  }, [token, user, selectedCategory]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const [sugRes, catRes, votesRes] = await Promise.all([
        api.get(`/suggestions${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`),
        api.get('/suggestions/categories'),
        api.get('/suggestions/my-votes'),
      ]);

      setSuggestions(sugRes.data.data || []);
      setCategories(catRes.data.data || []);
      setUserVotes(new Set(votesRes.data.data?.map(v => v.suggestion_id) || []));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/suggestions', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
      });

      setFormData({ title: '', description: '', category: 'general' });
      setShowForm(false);
      await loadSuggestions();
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
      alert('Failed to submit suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (suggestionId) => {
    try {
      if (userVotes.has(suggestionId)) {
        // Remove vote
        await api.delete(`/suggestions/${suggestionId}/vote`);
        setUserVotes(prev => {
          const newVotes = new Set(prev);
          newVotes.delete(suggestionId);
          return newVotes;
        });
      } else {
        // Add vote
        await api.post(`/suggestions/${suggestionId}/vote`);
        setUserVotes(prev => new Set([...prev, suggestionId]));
      }

      // Reload suggestions
      const response = await api.get(
        `/suggestions${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
      );
      setSuggestions(response.data.data || []);
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote');
    }
  };

  if (authLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredSuggestions = [...suggestions].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ideas & Suggestions</h1>
            <p className="text-gray-600 mt-2">
              Help shape our church community by sharing your ideas
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'Submit an Idea'}
          </button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Your Idea</h2>
            <form onSubmit={handleSubmitSuggestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-primary w-full"
                  placeholder="What's your idea?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-primary w-full h-24"
                  placeholder="Tell us more about your idea..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input-primary w-full"
                >
                  <option value="general">General</option>
                  <option value="ministry">Ministry</option>
                  <option value="events">Events</option>
                  <option value="outreach">Outreach</option>
                  <option value="facilities">Facilities</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Idea'}
              </button>
            </form>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-primary'
              }`}
            >
              All Ideas
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-primary'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Suggestions List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-lg shadow-soft p-6">
                <div className="flex gap-6">
                  {/* Vote Button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleVote(suggestion.id)}
                      className={`p-3 rounded-lg font-semibold transition-colors ${
                        userVotes.has(suggestion.id)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-white'
                      }`}
                    >
                      👍
                    </button>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      {suggestion.votes}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {suggestion.title}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-white">
                        {suggestion.category}
                      </span>
                    </div>

                    {suggestion.description && (
                      <p className="text-gray-600 mb-3">{suggestion.description}</p>
                    )}

                    <p className="text-xs text-gray-500">
                      Submitted by {suggestion.submitter_first_name} {suggestion.submitter_last_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas in this category</h3>
            <p className="text-gray-600 mb-4">
              Be the first to submit an idea!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Submit an Idea
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
