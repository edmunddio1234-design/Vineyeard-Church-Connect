import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Button, Input, TextArea, Select } from '../components/UI';

export function SuggestionsPage({ members }) {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('Most Votes');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Event',
  });

  const categoryColors = {
    Event: '#6B7280',
    Program: '#374151',
    'Small Group': '#9CA3AF',
    Outreach: '#4B5563',
    Worship: '#6B7280',
    Youth: '#9CA3AF',
    Missions: '#374151',
  };

  const categories = [
    'Event',
    'Program',
    'Small Group',
    'Outreach',
    'Worship',
    'Youth',
    'Missions',
  ];

  const initialSuggestions = [
    {
      id: 1,
      title: 'Homeschool Families Group',
      description: 'Create a small group for homeschooling families to connect, share resources, and encourage one another.',
      category: 'Small Group',
      votes: 12,
      author: 'Sarah',
      date: '2 days ago',
      comments: 3,
    },
    {
      id: 2,
      title: 'Church Tech Hackathon',
      description: 'Bring together our tech-savvy members for a day of innovation and building tools to serve the church.',
      category: 'Event',
      votes: 8,
      author: 'Marcus',
      date: '5 days ago',
      comments: 1,
    },
    {
      id: 3,
      title: 'Intergenerational Mentoring',
      description: 'Connect wisdom from older members with energy from younger ones through structured mentoring partnerships.',
      category: 'Program',
      votes: 15,
      author: 'Grace',
      date: '1 week ago',
      comments: 5,
    },
    {
      id: 4,
      title: 'Family Camping Retreat',
      description: 'Annual camping adventure for church families to bond, worship in nature, and make lasting memories.',
      category: 'Event',
      votes: 18,
      author: 'David & Rachel',
      date: '1 week ago',
      comments: 7,
    },
    {
      id: 5,
      title: 'Creative Arts Night',
      description: 'Monthly gathering to explore music, visual arts, theater, and creative expression in our faith community.',
      category: 'Program',
      votes: 10,
      author: 'Lisa',
      date: '2 weeks ago',
      comments: 2,
    },
    {
      id: 6,
      title: "Men's Fitness & Faith",
      description: "Men's small group combining fitness accountability, Bible study, and brotherhood over coffee and workouts.",
      category: 'Small Group',
      votes: 9,
      author: 'Jason',
      date: '2 weeks ago',
      comments: 4,
    },
    {
      id: 7,
      title: 'Community Health Fair',
      description: 'Partner with local health organizations to offer free health screenings and wellness education to our community.',
      category: 'Program',
      votes: 14,
      author: 'Emily',
      date: '3 weeks ago',
      comments: 6,
    },
    {
      id: 8,
      title: 'Financial Freedom Workshop',
      description: 'Multi-week series teaching biblical principles of finances, budgeting, debt management, and generosity.',
      category: 'Event',
      votes: 11,
      author: 'Tom & Linda',
      date: '3 weeks ago',
      comments: 3,
    },
  ];

  const [suggestions, setSuggestions] = useState(initialSuggestions);

  // Filter and sort suggestions
  let displayedSuggestions = filterCategory
    ? suggestions.filter(s => s.category === filterCategory)
    : suggestions;

  if (sortBy === 'Most Votes') {
    displayedSuggestions = [...displayedSuggestions].sort((a, b) => b.votes - a.votes);
  } else if (sortBy === 'Newest') {
    displayedSuggestions = [...displayedSuggestions].reverse();
  }

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }
    const newSuggestion = {
      id: suggestions.length + 1,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      votes: 0,
      author: 'You',
      date: 'just now',
      comments: 0,
    };
    setSuggestions([newSuggestion, ...suggestions]);
    setFormData({ title: '', description: '', category: 'Event' });
    setShowForm(false);
  };

  const handleVote = (suggestionId) => {
    setSuggestions(suggestions.map(s =>
      s.id === suggestionId ? { ...s, votes: s.votes + 1 } : s
    ));
  };

  return (
    <div style={{ backgroundColor: T.bgSoft, minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={S.h1}>Church Suggestions</h1>
          <p style={{ ...S.muted, marginBottom: '16px' }}>
            Share ideas for programs, events, and activities at Vineyard Church of Baton Rouge
          </p>
          <Button onClick={() => setShowForm(true)}>
            ➕ New Idea
          </Button>
        </div>

        {/* Suggestion Form */}
        {showForm && (
          <div
            style={{
              ...S.card,
              border: `2px solid ${T.primary}`,
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={S.h3}>Submit Your Idea</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: T.textMuted, marginBottom: '6px' }}>
                Title
              </label>
              <Input
                placeholder="Give your idea a catchy title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: T.textMuted, marginBottom: '6px' }}>
                Description
              </label>
              <TextArea
                placeholder="Describe your idea in detail. Why would this benefit our church?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: T.textMuted, marginBottom: '6px' }}>
                Category
              </label>
              <Select
                options={categories}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div style={{ ...S.flex, gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* Filter & Sort Row */}
        <div
          style={{
            ...S.card,
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ ...S.flex, gap: '12px', flex: 1, minWidth: '250px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: T.textMuted, marginBottom: '4px' }}>
                Filter
              </label>
              <Select
                options={['', ...categories]}
                value={filterCategory}
                placeholder="All Categories"
                onChange={(e) => setFilterCategory(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: T.textMuted, marginBottom: '4px' }}>
                Sort
              </label>
              <Select
                options={['Most Votes', 'Newest']}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
            </div>
          </div>
          <div style={{ color: T.textMuted, fontSize: '14px', fontWeight: '500' }}>
            {displayedSuggestions.length} {displayedSuggestions.length === 1 ? 'idea' : 'ideas'}
          </div>
        </div>

        {/* Suggestions Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedSuggestions.map(suggestion => (
            <div
              key={suggestion.id}
              style={{
                ...S.card,
                padding: '20px',
                display: 'flex',
                gap: '16px',
              }}
            >
              {/* Vote Box */}
              <div
                style={{
                  minWidth: '60px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={() => handleVote(suggestion.id)}
                  style={{
                    backgroundColor: T.primaryFaint,
                    border: `1px solid ${T.border}`,
                    borderRadius: '10px',
                    padding: '12px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    marginBottom: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = T.primaryDark;
                    e.currentTarget.style.color = T.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = T.primaryFaint;
                    e.currentTarget.style.color = 'inherit';
                  }}
                >
                  <div style={{ fontSize: '16px', lineHeight: '1' }}>▲</div>
                </button>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: T.primaryDark,
                    lineHeight: '1',
                  }}
                >
                  {suggestion.votes}
                </div>
                <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '4px' }}>
                  {suggestion.votes === 1 ? 'vote' : 'votes'}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ ...S.flex, marginBottom: '8px', gap: '8px' }}>
                  <div
                    style={{
                      backgroundColor: categoryColors[suggestion.category],
                      color: T.white,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {suggestion.category}
                  </div>
                  <div style={{ fontSize: '12px', color: T.textMuted, marginLeft: 'auto' }}>
                    {suggestion.date}
                  </div>
                </div>

                <h3 style={{ ...S.h3, marginBottom: '8px', fontSize: '18px' }}>
                  {suggestion.title}
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: T.text,
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  {suggestion.description}
                </p>

                <div style={{ ...S.flex }}>
                  <Avatar name={suggestion.author} size={22} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: T.textDark }}>
                      {suggestion.author}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', ...S.flex }}>
                    <div style={{ fontSize: '12px', color: T.textMuted }}>
                      💬 {suggestion.comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedSuggestions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💡</div>
            <h3 style={S.h3}>No suggestions found</h3>
            <p style={S.muted}>
              {filterCategory
                ? `No ideas in the "${filterCategory}" category yet. Try a different category!`
                : 'No suggestions yet. Be the first to share an idea!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
