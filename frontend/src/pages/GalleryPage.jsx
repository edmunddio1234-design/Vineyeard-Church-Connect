import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Button, Input, TextArea, Select } from '../components/UI';
import { GALLERY_CATS } from '../constants';

export function GalleryPage({ members }) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadData, setUploadData] = useState({
    caption: '',
    category: GALLERY_CATS[0],
    type: 'photo',
  });
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [postComments, setPostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  const initialPosts = [
    {
      id: 1,
      author: 'Sarah',
      category: 'Worship Service',
      emoji: '🎶',
      caption: 'Sunday worship at Vineyard Church of Baton Rouge',
      likes: 24,
      color: '#E5E7EB',
      type: 'photo',
      date: '2 days ago',
    },
    {
      id: 2,
      author: 'David & Rachel',
      category: 'Family Events',
      emoji: '⛺️',
      caption: 'Family camping Tickfaw - what an amazing weekend!',
      likes: 31,
      color: '#D1D5DB',
      type: 'photo',
      date: '5 days ago',
    },
    {
      id: 3,
      author: 'Marcus',
      category: 'Family Events',
      emoji: '🏀',
      caption: 'Basketball at BREC with the youth group',
      likes: 18,
      color: '#F3F4F6',
      type: 'photo',
      date: '1 week ago',
    },
    {
      id: 4,
      author: 'Lisa',
      category: 'Church Events',
      emoji: '🎨',
      caption: 'Church bulletin design for this Sunday',
      likes: 15,
      color: '#E8EAED',
      type: 'photo',
      date: '1 week ago',
    },
    {
      id: 5,
      author: 'Grace',
      category: 'Small Groups',
      emoji: '🎄',
      caption: 'Women of Faith Christmas celebration',
      likes: 27,
      color: '#D6D9DE',
      type: 'photo',
      date: '2 weeks ago',
    },
    {
      id: 6,
      author: 'Jason',
      category: 'Worship Service',
      emoji: '🌅',
      caption: 'Sunrise worship service at the levee',
      likes: 33,
      color: '#ECEEF1',
      type: 'photo',
      date: '2 weeks ago',
    },
    {
      id: 7,
      author: 'Emily',
      category: 'Community Service',
      emoji: '🩺',
      caption: 'Community health fair - serving Baton Rouge',
      likes: 42,
      color: '#DFE1E5',
      type: 'photo',
      date: '3 weeks ago',
    },
    {
      id: 8,
      author: 'Tom & Linda',
      category: 'Youth Ministry',
      emoji: '📦',
      caption: 'Youth food bank volunteer day',
      likes: 29,
      color: '#F0F1F3',
      type: 'photo',
      date: '3 weeks ago',
    },
    {
      id: 9,
      author: 'Marcus',
      category: 'Church Events',
      emoji: '🎥',
      caption: 'Tech workshop for seniors - learning together',
      likes: 20,
      color: '#E2E4E8',
      type: 'video',
      date: '1 month ago',
    },
  ];

  const [posts, setPosts] = useState(initialPosts);

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const handleUpload = () => {
    if (!uploadData.caption.trim()) {
      alert('Please add a caption');
      return;
    }
    const newPost = {
      id: posts.length + 1,
      author: 'You',
      category: uploadData.category,
      emoji: '✨',
      caption: uploadData.caption,
      likes: 0,
      color: '#E5E7EB',
      type: uploadData.type,
      date: 'just now',
    };
    setPosts([newPost, ...posts]);
    setUploadData({ caption: '', category: GALLERY_CATS[0], type: 'photo' });
    setShowUploadForm(false);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const handleAddComment = (postId) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;
    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { text, author: 'You', date: 'just now' }]
    }));
    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div style={{ backgroundColor: T.bgSoft, minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Banner */}
        <div
          style={{
            ...S.card,
            background: 'linear-gradient(135deg, #4B5563, #374151)',
            border: 'none',
            color: T.white,
            textAlign: 'center',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: S.card.boxShadow,
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
          <h1 style={{ ...S.h1, color: T.white, marginBottom: '8px' }}>Church Gallery</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px', fontSize: '15px' }}>
            Sharing moments from our Vineyard Church of Baton Rouge family
          </p>
          <Button
            onClick={() => setShowUploadForm(true)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(255, 255, 255, 0.3)`,
            }}
          >
            📷 Share a Moment
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div
            style={{
              ...S.card,
              border: `2px solid ${T.primary}`,
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={S.h3}>Share Your Moment</h3>

            {/* Upload Zone */}
            <div
              style={{
                padding: '40px',
                border: `2px dashed ${T.primary}`,
                borderRadius: '12px',
                textAlign: 'center',
                backgroundColor: T.bgSoft,
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.primaryDark; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.primary; }}
            >
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>📸</div>
              <p style={{ color: T.text, fontWeight: '500', marginBottom: '4px' }}>
                Click to upload a photo or video
              </p>
              <p style={{ ...S.muted }}>JPG, PNG, MP4 up to 10MB</p>
            </div>

            {/* Caption */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: T.textMuted, marginBottom: '6px' }}>
                Caption
              </label>
              <TextArea
                placeholder="Describe this moment..."
                value={uploadData.caption}
                onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
                rows={3}
              />
            </div>

            {/* Grid: Category + Type */}
            <div style={S.grid2}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: T.textMuted, marginBottom: '6px' }}>
                  Category
                </label>
                <Select
                  options={GALLERY_CATS}
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: T.textMuted, marginBottom: '6px' }}>
                  Type
                </label>
                <Select
                  options={['photo', 'video']}
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ ...S.flex, gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowUploadForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                Share
              </Button>
            </div>
          </div>
        )}

        {/* Filter Row */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedCategory === 'All' ? T.primaryDark : T.primaryFaint,
              color: selectedCategory === 'All' ? T.white : T.primary,
              transition: 'all 0.2s ease',
            }}
          >
            All
          </button>
          {GALLERY_CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? T.primaryDark : T.primaryFaint,
                color: selectedCategory === cat ? T.white : T.primary,
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredPosts.map(post => (
            <div
              key={post.id}
              style={{
                ...S.card,
                padding: 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = T.shadowLg;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = S.card.boxShadow;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Image Placeholder */}
              <div
                style={{
                  height: '220px',
                  background: `linear-gradient(135deg, ${post.color}, ${post.color}cc)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  position: 'relative',
                }}
              >
                {post.emoji}

                {/* Video Badge */}
                {post.type === 'video' && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: T.white,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ▶ Video
                  </div>
                )}

                {/* Category Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: T.white,
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  {post.category}
                </div>
              </div>

              {/* Content Area */}
              <div style={{ padding: '16px' }}>
                {/* Author Info */}
                <div style={{ ...S.flex, marginBottom: '12px' }}>
                  <Avatar name={post.author} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: T.textDark }}>
                      {post.author}
                    </div>
                    <div style={{ fontSize: '12px', color: T.textMuted }}>{post.date}</div>
                  </div>
                </div>

                {/* Caption */}
                <p style={{ fontSize: '14px', color: T.text, marginBottom: '12px', lineHeight: '1.4' }}>
                  {post.caption}
                </p>

                {/* Divider */}
                <div style={S.divider}></div>

                {/* Actions */}
                <div style={{ ...S.flex, justifyContent: 'space-between', marginBottom: '12px' }}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: T.textMuted,
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = T.danger; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = T.textMuted; }}
                  >
                    ❤️ {post.likes}
                  </button>
                  <button
                    onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: T.textMuted,
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = T.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = T.textMuted; }}
                  >
                    💬 {(postComments[post.id] || []).length}
                  </button>
                </div>

                {/* Comments Section */}
                {expandedPostId === post.id && (
                  <div
                    style={{
                      backgroundColor: T.bgSoft,
                      padding: '12px',
                      borderRadius: '10px',
                      marginTop: '12px',
                    }}
                  >
                    {/* Comment List */}
                    {(postComments[post.id] || []).length > 0 && (
                      <div style={{ marginBottom: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                        {postComments[post.id].map((comment, idx) => (
                          <div key={idx} style={{ marginBottom: '8px', fontSize: '13px' }}>
                            <span style={{ fontWeight: '600', color: T.textDark }}>
                              {comment.author}
                            </span>
                            <p style={{ margin: '2px 0 0 0', color: T.text, lineHeight: '1.3' }}>
                              {comment.text}
                            </p>
                            <span style={{ fontSize: '11px', color: T.textMuted }}>
                              {comment.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Input */}
                    <div style={{ ...S.flex, gap: '6px' }}>
                      <Input
                        placeholder="Add a comment..."
                        value={newCommentText[post.id] || ''}
                        onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id);
                          }
                        }}
                        style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        style={{
                          backgroundColor: T.primary,
                          color: T.white,
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.primaryDark; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.primary; }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
            <h3 style={S.h3}>No photos yet</h3>
            <p style={S.muted}>Be the first to share a moment from our church family!</p>
          </div>
        )}
      </div>
    </div>
  );
}
