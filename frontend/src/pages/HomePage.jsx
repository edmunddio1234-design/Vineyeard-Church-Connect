import React from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Button, Tag } from '../components/UI';
import Icon from '../components/Icons';
import { SMALL_GROUPS } from '../constants';

export default function HomePage({ user, members, setPage, setSelMember }) {
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const newestMembers = members?.slice(0, 4) || [];
  const membersCount = members?.length || 0;
  const smallGroupsCount = 18;
  const connectionsCount = 45;
  const helpersCount = 8;
  const availableToHelp = members?.slice(0, 3) || [];

  const quickActions = [
    { title: 'Browse Members', icon: 'users', page: 'directory' },
    { title: 'Messages', icon: 'chat', page: 'messages' },
    { title: 'Job Board', icon: 'briefcase', page: 'jobs' },
    { title: 'Prayer Requests', icon: 'hands', page: 'prayer' },
    { title: 'Gallery', icon: 'camera', page: 'gallery' },
    { title: 'Ideas', icon: 'star', page: 'suggestions' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.primaryDark} 0%, ${T.primary} 100%)`,
          borderRadius: '8px',
          padding: '32px',
          color: T.white,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '24px',
          boxShadow: T.shadow,
        }}
      >
        <Avatar name={user?.name || 'User'} size={56} style={{ backgroundColor: T.white, color: T.primary }} />
        <div>
          <h1 style={{ ...S.h1, color: T.white, marginBottom: '8px' }}>Welcome back, {firstName}!</h1>
          <p style={{ color: T.white, margin: 0, opacity: 0.95 }}>
            Stay connected with your Vineyard Church of Baton Rouge family.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Column (2fr) and Right Column (1fr) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ ...S.flexCol, gap: '24px' }}>
          {/* Quick Actions */}
          <div>
            <h2 style={S.h2}>Quick Actions</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  style={{
                    ...S.card,
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = T.shadowLg;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = T.shadow;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => setPage(action.page)}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: T.primaryFaint,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      color: T.primary,
                      fontSize: '20px',
                    }}
                  >
                    <Icon name={action.icon} size={20} color={T.primary} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: T.textDark }}>
                    {action.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newest Members */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={S.h2}>Newest Members</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage('directory')}
              >
                View All
              </Button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              {newestMembers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    ...S.card,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = T.shadowLg;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = T.shadow;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => {
                    setSelMember(member);
                    setPage('profile-view');
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Avatar name={member.name} size={44} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: T.textDark }}>{member.name}</div>
                      {member.retired && (
                        <Tag variant="default" style={{ marginTop: '4px' }}>
                          Retired
                        </Tag>
                      )}
                    </div>
                  </div>
                  <div style={{ ...S.muted, marginBottom: '4px' }}>
                    {member.location}, {member.age}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ ...S.flexCol, gap: '24px' }}>
          {/* Community Stats */}
          <div style={S.card}>
            <h3 style={S.h3}>Community</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              {[
                { label: 'Members', value: membersCount },
                { label: 'Small Groups', value: smallGroupsCount },
                { label: 'Connections', value: connectionsCount },
                { label: 'Helpers', value: helpersCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: T.primaryFaint,
                    padding: '12px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: '700', color: T.primary }}>
                    {stat.value}
                  </div>
                  <div style={{ ...S.muted, marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Available to Help */}
          <div style={S.card}>
            <h3 style={S.h3}>Available to Help</h3>
            <div style={{ ...S.flexCol, gap: '12px', marginTop: '12px' }}>
              {availableToHelp.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = T.primaryFaint;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => {
                    setSelMember(member);
                    setPage('profile-view');
                  }}
                >
                  <Avatar name={member.name} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: T.textDark }}>
                      {member.name}
                    </div>
                    <div style={{ ...S.muted }}>
                      {member.available?.[0] || 'Available'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verse of the Day */}
          <div
            style={{
              ...S.card,
              backgroundColor: T.primaryFaint,
              borderColor: T.border,
            }}
          >
            <h3 style={S.h3}>Verse of the Day</h3>
            <p
              style={{
                fontStyle: 'italic',
                color: T.text,
                marginTop: '12px',
                marginBottom: '12px',
                lineHeight: '1.6',
              }}
            >
              I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit.
            </p>
            <div style={{ ...S.muted, textAlign: 'right' }}>— John 15:5</div>
          </div>
        </div>
      </div>
    </div>
  );
}
