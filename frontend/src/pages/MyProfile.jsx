import React from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Tag, Button } from '../components/UI';
import Icon from '../components/Icons';

export default function MyProfile({ user, setPage }) {
  const isEmpty = !user.bio || user.bio.trim() === '';
  const hasSmallGroups = user.smallGroups && user.smallGroups.length > 0;
  const hasHobbies = user.hobbies && user.hobbies.length > 0;
  const hasAvailability = user.availableToHelp && user.availableToHelp.length > 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={S.h1}>My Profile</h1>
        <Button variant="primary" onClick={() => setPage('profileedit')}>
          Edit Profile
        </Button>
      </div>

      {/* Hero Card */}
      <div
        style={{
          ...S.card,
          padding: 0,
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        {/* Gradient Banner */}
        <div
          style={{
            height: '140px',
            background: `linear-gradient(to right, ${T.primaryDark}, ${T.primary}, ${T.primaryLight})`,
          }}
        />

        {/* Content Area */}
        <div style={{ padding: '0 32px 32px', marginTop: '-50px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.fullName}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  backgroundColor: T.primaryLight,
                }}
              />
            ) : (
              <Avatar name={user.fullName || 'User'} size={96} />
            )}
            <div>
              <h2 style={{ ...S.h2, marginBottom: '8px' }}>{user.fullName || 'My Profile'}</h2>
              {user.work && (
                <div style={{ ...S.muted, marginBottom: '4px' }}>{user.work}</div>
              )}
              {user.location && (
                <div style={{ ...S.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="location" size={14} />
                  {user.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* About Me */}
          {!isEmpty ? (
            <div style={S.card}>
              <h3 style={S.h3}>About Me</h3>
              <p style={{ color: T.text, lineHeight: '1.6' }}>{user.bio}</p>
            </div>
          ) : null}

          {/* My Small Groups */}
          {hasSmallGroups && (
            <div style={S.card}>
              <h3 style={S.h3}>My Small Groups</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.smallGroups.map((group) => (
                  <Tag key={group} variant="success">
                    {group}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* My Hobbies */}
          {hasHobbies && (
            <div style={S.card}>
              <h3 style={S.h3}>My Hobbies</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.hobbies.map((hobby) => (
                  <Tag key={hobby} variant="success">
                    {hobby}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* I Can Help With */}
          {hasAvailability && (
            <div
              style={{
                ...S.card,
                backgroundColor: T.primaryFaint,
                borderWidth: '2px',
              }}
            >
              <h3 style={S.h3}>I Can Help With</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {user.availableToHelp.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="check" size={18} color={T.success} />
                    <span style={{ color: T.text }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty Profile Prompt */}
      {isEmpty && !hasSmallGroups && !hasHobbies && !hasAvailability && (
        <div
          style={{
            ...S.card,
            textAlign: 'center',
            padding: '40px 20px',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: T.borderLight,
              marginBottom: '12px',
            }}
          >
            <Icon name="user" size={48} color={T.borderLight} />
          </div>
          <h3 style={S.h3}>Your profile is looking empty!</h3>
          <p style={{ ...S.muted, marginTop: '8px', marginBottom: '20px' }}>
            Complete your profile to help others learn about you
          </p>
          <Button variant="primary" onClick={() => setPage('profileedit')}>
            Complete My Profile
          </Button>
        </div>
      )}
    </div>
  );
}
