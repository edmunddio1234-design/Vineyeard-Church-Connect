import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Button, Input, TextArea, Select, Avatar } from '../components/UI';
import Icon from '../components/Icons';
import { PRAYER_CATS } from '../constants';

export default function PrayerRequestPage({ members }) {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedResponses, setExpandedResponses] = useState(new Set());
  const [markedAnswered, setMarkedAnswered] = useState(new Set());
  const [prayingCount, setPrayingCount] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    details: '',
    category: '',
    anonymous: false,
  });

  const categoryEmojis = {
    'Health': '🩺',
    'Family': '👪',
    'Work': '💼',
    'Spiritual': '📖',
    'Relationship': '🤝',
    'Financial': '💰',
    'Grief & Loss': '💜',
    'Praise & Thanksgiving': '🎉',
    'Personal': '🙏',
    'Intercession': '🤲',
    'Healing': '💊',
    'Guidance': '🧭',
    'Community': '🏘️',
    'Church': '⛪',
    'Global': '🌍',
  };

  const [prayers, setPrayers] = useState([
    {
      id: 1,
      title: 'Wisdom for schooling decisions',
      details: 'We are trying to decide on the best educational path for our child. Would appreciate prayers for wisdom and guidance.',
      category: 'Family',
      author: 'Sarah',
      authorId: 'sarah-id',
      anonymous: false,
      postedDate: '2024-01-10',
      prayingCount: 14,
      answered: false,
      responses: [
        { id: 1, text: 'Praying for God\'s guidance in your decision.' },
        { id: 2, text: 'May the Holy Spirit give you clear direction.' },
      ],
    },
    {
      id: 2,
      title: 'Upcoming surgery',
      details: 'I have surgery coming up next week and would appreciate prayer for the surgery team, the procedure, and a smooth recovery.',
      category: 'Health',
      author: 'Anonymous',
      authorId: 'anon-2',
      anonymous: true,
      postedDate: '2024-01-08',
      prayingCount: 22,
      answered: false,
      responses: [
        { id: 1, text: 'Lifting you up in prayer. Trust in the Lord.' },
        { id: 2, text: 'God is with you through this. Be strong and courageous.' },
        { id: 3, text: 'Praying for excellent medical care and swift healing.' },
      ],
    },
    {
      id: 3,
      title: 'Loss of my sister',
      details: 'My sister passed away last month. We are still grieving as a family. Prayers for comfort and strength during this difficult time.',
      category: 'Grief & Loss',
      author: 'Grace',
      authorId: 'grace-id',
      anonymous: false,
      postedDate: '2024-01-05',
      prayingCount: 31,
      answered: false,
      responses: [
        { id: 1, text: 'So sorry for your loss. Praying for your family.' },
        { id: 2, text: 'May you feel God\'s presence and comfort.' },
        { id: 3, text: 'Sending love and prayers during this time.' },
        { id: 4, text: 'Your sister is in heaven with Jesus. Rest in that hope.' },
      ],
    },
    {
      id: 4,
      title: 'Job interview this Friday',
      details: 'I have an important job interview coming up this Friday. Praying for confidence, clarity, and God\'s will in this opportunity.',
      category: 'Work',
      author: 'Marcus',
      authorId: 'marcus-id',
      anonymous: false,
      postedDate: '2024-01-03',
      prayingCount: 9,
      answered: true,
      responses: [
        { id: 1, text: 'Praying for a great interview! God\'s got this.' },
      ],
    },
    {
      id: 5,
      title: 'Restoration of friendship',
      details: 'A close friendship has been strained. We need prayers for healing, reconciliation, and restoration of our relationship.',
      category: 'Relationship',
      author: 'Anonymous',
      authorId: 'anon-5',
      anonymous: true,
      postedDate: '2024-01-02',
      prayingCount: 17,
      answered: false,
      responses: [
        { id: 1, text: 'Praying for restoration and healing between you both.' },
        { id: 2, text: 'May God\'s love bring you back together.' },
      ],
    },
    {
      id: 6,
      title: 'Grateful for church family!',
      details: 'I am so thankful for this church and the incredible family we have here. Praising God for the blessing of community, love, and support.',
      category: 'Praise & Thanksgiving',
      author: 'Tom & Linda',
      authorId: 'tom-linda-id',
      anonymous: false,
      postedDate: '2024-01-01',
      prayingCount: 25,
      answered: false,
      responses: [
        { id: 1, text: 'What a blessing! Praise God for His faithfulness!' },
        { id: 2, text: 'Amen! We are blessed to have you in our church family.' },
        { id: 3, text: 'Thank you for your servant hearts and love.' },
      ],
    },
    {
      id: 7,
      title: 'Discipline in daily devotions',
      details: 'I want to grow closer to God but struggle with consistency in my daily quiet time and devotions. Prayers for discipline and dedication.',
      category: 'Spiritual',
      author: 'Jason',
      authorId: 'jason-id',
      anonymous: false,
      postedDate: '2023-12-30',
      prayingCount: 12,
      answered: false,
      responses: [
        { id: 1, text: 'Praying for a heart that hungers for God\'s Word.' },
        { id: 2, text: 'May the Holy Spirit strengthen your commitment.' },
      ],
    },
    {
      id: 8,
      title: 'Baby on the way!',
      details: 'We are expecting! Prayers for a healthy pregnancy, smooth delivery, and a beautiful new life to join our family.',
      category: 'Health',
      author: 'Emily',
      authorId: 'emily-id',
      anonymous: false,
      postedDate: '2023-12-28',
      prayingCount: 28,
      answered: false,
      responses: [
        { id: 1, text: 'Congratulations! What wonderful news! Praying for a healthy baby and mom.' },
        { id: 2, text: 'So excited for your family! Blessings on this journey.' },
        { id: 3, text: 'May God grant you perfect health and joy in this season.' },
      ],
    },
  ]);

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (formData.title && formData.category) {
      const newPrayer = {
        id: prayers.length + 1,
        title: formData.title,
        details: formData.details,
        category: formData.category,
        author: formData.anonymous ? 'Anonymous' : (members?.[0]?.name || 'Church Member'),
        authorId: formData.anonymous ? `anon-${prayers.length + 1}` : (members?.[0]?.id || 'member-id'),
        anonymous: formData.anonymous,
        postedDate: new Date().toISOString().split('T')[0],
        prayingCount: 0,
        answered: false,
        responses: [],
      };
      setPrayers([newPrayer, ...prayers]);
      setFormData({
        title: '',
        details: '',
        category: '',
        anonymous: false,
      });
      setShowForm(false);
    }
  };

  const filteredPrayers = filterCategory
    ? prayers.filter(p => p.category === filterCategory)
    : prayers;

  const toggleResponses = (prayerId) => {
    const newExpanded = new Set(expandedResponses);
    if (newExpanded.has(prayerId)) {
      newExpanded.delete(prayerId);
    } else {
      newExpanded.add(prayerId);
    }
    setExpandedResponses(newExpanded);
  };

  const toggleAnswered = (prayerId) => {
    const newAnswered = new Set(markedAnswered);
    if (newAnswered.has(prayerId)) {
      newAnswered.delete(prayerId);
    } else {
      newAnswered.add(prayerId);
    }
    setMarkedAnswered(newAnswered);
  };

  const togglePraying = (prayerId) => {
    setPrayingCount(prev => ({
      ...prev,
      [prayerId]: (prev[prayerId] || 0) + 1,
    }));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          ...S.card,
          background: 'linear-gradient(135deg, #374151, #6B7280)',
          color: T.white,
          border: 'none',
          textAlign: 'center',
          padding: '32px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🙏</div>
        <h1 style={{ ...S.h1, color: T.white, marginBottom: '8px' }}>Prayer Requests</h1>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '20px',
            fontStyle: 'italic',
          }}
        >
          Bear one another's burdens — Galatians 6:2
        </p>
        <Button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: T.white,
            border: 'none',
          }}
        >
          Share a Prayer Request
        </Button>
      </div>

      {/* Prayer Form */}
      {showForm && (
        <div
          style={{
            ...S.card,
            border: `2px solid ${T.primary}`,
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h3 style={S.h3}>Share a Prayer Request</h3>
          <div style={{ marginTop: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Prayer Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Brief title for your prayer request"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Details
              </label>
              <TextArea
                name="details"
                value={formData.details}
                onChange={handleFormChange}
                placeholder="Share more details about your prayer request..."
                rows={5}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Category
              </label>
              <Select
                options={PRAYER_CATS}
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Select category"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ ...S.flex, marginTop: '16px', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleFormChange}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: T.primary,
                }}
              />
              <label style={{ marginLeft: '12px', cursor: 'pointer' }}>
                Post as Anonymous
              </label>
            </div>

            <div style={{ ...S.flex, marginTop: '20px', gap: '12px' }}>
              <Button onClick={handleSubmit}>Share Request</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    title: '',
                    details: '',
                    category: '',
                    anonymous: false,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div style={{ ...S.flex, marginBottom: '24px', alignItems: 'center', gap: '12px' }}>
        <Select
          options={PRAYER_CATS}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="Filter by Category"
          style={{ minWidth: '200px' }}
        />
        <span style={{ ...S.muted, whiteSpace: 'nowrap' }}>
          {filteredPrayers.length} request{filteredPrayers.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Prayer Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPrayers.map(prayer => (
          <div
            key={prayer.id}
            style={{
              ...S.card,
              padding: '20px',
              borderLeft: markedAnswered.has(prayer.id) ? `4px solid ${T.success}` : 'none',
            }}
          >
            {/* Header */}
            <div
              style={{
                ...S.flex,
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div style={S.flex}>
                <Avatar name={prayer.author} size={36} />
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontWeight: '500' }}>{prayer.author}</div>
                  <div style={{ ...S.muted, fontSize: '12px' }}>
                    {new Date(prayer.postedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ ...S.flex, gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: T.primaryFaint,
                    color: T.text,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {categoryEmojis[prayer.category] || '🙏'} {prayer.category}
                </span>
                {markedAnswered.has(prayer.id) && (
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ✓ ANSWERED
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 style={{ ...S.h3, fontSize: '18px', marginBottom: '12px' }}>
              {prayer.title}
            </h3>

            {/* Description */}
            <p style={{ color: T.text, marginBottom: '16px', lineHeight: '1.5' }}>
              {prayer.details}
            </p>

            {/* Action Buttons Row */}
            <div
              style={{
                ...S.flex,
                gap: '12px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              <Button
                size="sm"
                onClick={() => togglePraying(prayer.id)}
                style={{
                  backgroundColor: T.primaryFaint,
                  color: T.text,
                  border: 'none',
                }}
              >
                🙏 Praying ({prayer.prayingCount + (prayingCount[prayer.id] || 0)})
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleResponses(prayer.id)}
              >
                {prayer.responses.length} response{prayer.responses.length === 1 ? '' : 's'}
              </Button>
              <Button
                size="sm"
                variant={markedAnswered.has(prayer.id) ? 'success' : 'secondary'}
                onClick={() => toggleAnswered(prayer.id)}
              >
                Mark Answered
              </Button>
            </div>

            {/* Responses Section */}
            {expandedResponses.has(prayer.id) && (
              <div
                style={{
                  backgroundColor: T.bgSoft,
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '16px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>Responses</h4>
                  {prayer.responses.map(response => (
                    <div
                      key={response.id}
                      style={{
                        backgroundColor: T.white,
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        borderLeft: `3px solid ${T.primary}`,
                      }}
                    >
                      {response.text}
                    </div>
                  ))}
                </div>

                {/* Add Response */}
                <div style={{ ...S.flex, gap: '8px' }}>
                  <Input
                    placeholder="Add your prayer response..."
                    style={{ flex: 1 }}
                  />
                  <Button
                    size="sm"
                    style={{
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Icon name="send" size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPrayers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🙏</div>
          <h3 style={S.h3}>No prayer requests found</h3>
          <p style={{ ...S.muted, marginTop: '8px' }}>
            Try adjusting your filter or be the first to share a prayer request
          </p>
        </div>
      )}
    </div>
  );
}
