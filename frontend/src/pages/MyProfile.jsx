import React from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Tag, Button } from '../components/UI';
import Icon from '../components/Icons';

export default function MyProfile({ user, setPage }) {
  // Normalize field names (API returns name, frontend uses fullName)
  const u = {
    ...user,
    fullName: user.fullName || user.name || 'User',
    smallGroups: user.smallGroups || user.currentGroups || [],
    hobbies: user.hobbies || [],
    availableToHelp: user.availableToHelp || user.available || [],
    needHelpWith: user.needHelpWith || user.need_help_with || [],
    isBusinessOwner: user.isBusinessOwner || user.is_business_owner || false,
    businessName: user.businessName || user.business_name || '',
    businessDescription: user.businessDescription || user.business_description || '',
  };
  const isEmpty = !u.bio || u.bio.trim() === '';
  const hasSmallGroups = u.smallGroups && u.smallGroups.length > 0;
  const hasHobbies = u.hobbies && u.hobbies.length > 0;
  const hasAvailability = u.availableToHelp && u.availableToHelp.length > 0;
  const hasNeeds = u.needHelpWith && u.needHelpWith.length > 0;
  const isBizOwner = u.isBusinessOwner;

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
        <Button variant="primary" onClick={() => setPage('profile-edit')}>
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
            {u.profilePhoto ? (
              <img
                src={u.profilePhoto}
                alt={u.fullName}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  backgroundColor: T.primaryLight,
                }}
              />
            ) : (
              <Avatar name={u.fullName || 'User'} size={96} />
            )}
            <div>
              <h2 style={{ ...S.h2, marginBottom: '8px' }}>{u.fullName || 'My Profile'}</h2>
              {u.work && (
                <div style={{ ...S.muted, marginBottom: '4px' }}>{u.work}</div>
              )}
              {u.location && (
                <div style={{ ...S.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="location" size={14} />
                  {u.location}
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
              <p style={{ color: T.text, lineHeight: '1.6' }}>{u.bio}</p>
            </div>
          ) : null}

          {/* My Business */}
          {isBizOwner && (
            <div
              style={{
                ...S.card,
                borderLeft: '4px solid #2563EB',
                backgroundColor: '#EFF6FF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Icon name="briefcase" size={20} color="#2563EB" />
                <h3 style={{ ...S.h3, marginBottom: 0, color: '#1E40AF' }}>Business Owner</h3>
              </div>
              {u.businessName && (
                <div style={{ fontSize: '16px', fontWeight: '600', color: T.textDark, marginBottom: '6px' }}>
                  {u.businessName}
                </div>
              )}
              {u.businessDescription && (
                <p style={{ color: T.text, lineHeight: '1.6', fontSize: '14px' }}>
                  {u.businessDescription}
                </p>
              )}
              {!u.businessName && !u.businessDescription && (
                <p style={{ ...S.muted, fontSize: '13px' }}>
                  Edit your profile to add your business details
                </p>
              )}
            </div>
          )}

          {/* My Small Groups */}
          {hasSmallGroups && (
            <div style={S.card}>
              <h3 style={S.h3}>My Small Groups</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {u.smallGroups.map((group) => (
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
                {u.hobbies.map((hobby) => (
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
              <h3 style={S.h3}>I'm Willing to Help With</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {u.availableToHelp.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="check" size={18} color={T.success} />
                    <span style={{ color: T.text }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* I Need Help With */}
          {hasNeeds && (
            <div
              style={{
                ...S.card,
                backgroundColor: '#FEF3C7',
                borderWidth: '2px',
                borderColor: '#F59E0B',
              }}
            >
              <h3 style={S.h3}>I'm Looking for Help With</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {u.needHelpWith.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="heart" size={18} color="#F59E0B" />
                    <span style={{ color: T.text }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty Profile Prompt */}
      {isEmpty && !hasSmallGroups && !hasHobbies && !hasAvailability && !hasNeeds && (
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
          <Button variant="primary" onClick={() => setPage('profile-edit')}>
            Complete My Profile
          </Button>
        </div>
      )}
    </div>
  );
}
