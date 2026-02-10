import React from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Tag, Button, InfoRow } from '../components/UI';
import Icon from '../components/Icons';

export default function ProfileView({ member, setPage, onMessage }) {
  if (!member) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: T.textMuted }}>Member not found</p>
        <Button onClick={() => setPage('directory')} style={{ marginTop: '16px' }}>
          Back to Directory
        </Button>
      </div>
    );
  }

  const isRetired = member.retired === 'Yes';
  const hasAvailability = member.availableToHelp && member.availableToHelp.length > 0;
  const hasNeeds = member.needHelpWith && member.needHelpWith.length > 0;
  const hasSpiritual = member.spiritualGifts && member.spiritualGifts.length > 0;
  const hasSmallGroups = member.smallGroups && member.smallGroups.length > 0;
  const hasInterested = member.desiredGroups && member.desiredGroups.length > 0;
  const hasHobbies = member.hobbies && member.hobbies.length > 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Back Button */}
      <button
        onClick={() => setPage('directory')}
        style={{
          background: 'none',
          border: 'none',
          color: T.text,
          fontSize: '14px',
          cursor: 'pointer',
          padding: '8px 0',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '18px' }}>←</span>
        Back to Directory
      </button>

      {/* Hero Section */}
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
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '20px', gap: '20px' }}>
            <Avatar name={member.name} size={96} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ ...S.h1, marginBottom: 0 }}>{member.name}</h1>
                {isRetired && (
                  <Tag variant="warning">Retired</Tag>
                )}
              </div>
              <div style={{ ...S.muted, marginBottom: '12px' }}>
                {member.work && (
                  <div>{member.work}</div>
                )}
                {member.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="location" size={14} />
                    {member.location}
                  </div>
                )}
                {member.joinedSince && (
                  <div>Member since {member.joinedSince}</div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="primary"
              onClick={() => onMessage(member)}
            >
              Message
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPage('connections')}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* About Me */}
          {member.bio && (
            <div style={S.card}>
              <h3 style={S.h3}>About Me</h3>
              <p style={{ color: T.text, lineHeight: '1.6' }}>{member.bio}</p>
            </div>
          )}

          {/* Personal Details */}
          <div style={S.card}>
            <h3 style={S.h3}>Personal Details</h3>
            <div style={S.grid2}>
              {member.age && <InfoRow label="Age" value={member.age} />}
              {member.birthday && <InfoRow label="Birthday" value={member.birthday} />}
              {member.maritalStatus && <InfoRow label="Marital Status" value={member.maritalStatus} />}
              {member.kids && <InfoRow label="Kids" value={member.kids} />}
              {member.languages && <InfoRow label="Languages" value={member.languages.join(', ')} />}
              {member.canDrive === 'Yes' && <InfoRow label="Can Drive" value="Yes" />}
              {member.dietary && <InfoRow label="Dietary" value={member.dietary} />}
            </div>
          </div>

          {/* Current Small Groups & Activities */}
          {hasSmallGroups && (
            <div style={S.card}>
              <h3 style={S.h3}>Current Small Groups & Activities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {member.smallGroups.map((group) => (
                  <Tag key={group} variant="success">
                    {group}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Interested in Joining */}
          {hasInterested && (
            <div style={S.card}>
              <h3 style={S.h3}>Interested in Joining</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {member.desiredGroups.map((group) => (
                  <Tag key={group}>{group}</Tag>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies & Interests */}
          {hasHobbies && (
            <div style={S.card}>
              <h3 style={{ ...S.h3, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="star" size={20} />
                Hobbies & Interests
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {member.hobbies.map((hobby) => (
                  <Tag key={hobby} variant="success">
                    {hobby}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Social & Activities */}
          {member.socialInterests && (
            <div style={S.card}>
              <h3 style={S.h3}>Social & Activities</h3>
              <p style={{ color: T.text, lineHeight: '1.6' }}>{member.socialInterests}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Available to Help */}
          {hasAvailability && (
            <div
              style={{
                ...S.card,
                backgroundColor: T.primaryFaint,
                borderWidth: '2px',
              }}
            >
              <h3 style={S.h3}>Available to Help</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {member.availableToHelp.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="check" size={18} color={T.success} />
                    <span style={{ color: T.text }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Looking for Help */}
          {hasNeeds && (
            <div
              style={{
                ...S.card,
                backgroundColor: '#FEF3C7',
                borderWidth: '2px',
                borderColor: '#F59E0B',
              }}
            >
              <h3 style={S.h3}>Looking for Help With</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {member.needHelpWith.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="heart" size={18} color="#F59E0B" />
                    <span style={{ color: T.text }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spiritual Gifts */}
          {hasSpiritual && (
            <div style={S.card}>
              <h3 style={S.h3}>Spiritual Gifts</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {member.spiritualGifts.map((gift) => (
                  <Tag key={gift} variant="success">
                    {gift}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(member.email || member.phone) && (
            <div style={S.card}>
              <h3 style={S.h3}>Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {member.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="chat" size={18} color={T.text} />
                    <a href={`mailto:${member.email}`} style={{ color: T.primary, textDecoration: 'none' }}>
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="clock" size={18} color={T.text} />
                    <a href={`tel:${member.phone}`} style={{ color: T.primary, textDecoration: 'none' }}>
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Area */}
          {member.location && (
            <div style={S.card}>
              <h3 style={S.h3}>Area</h3>
              <div
                style={{
                  backgroundColor: T.bgSoft,
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  border: `2px dashed ${T.border}`,
                  marginBottom: '12px',
                }}
              >
                <Icon name="location" size={32} color={T.textMuted} />
              </div>
              <div style={{ color: T.text, fontWeight: '500', marginBottom: '4px' }}>
                {member.location}
              </div>
              <div style={{ ...S.muted }}>
                East Baton Rouge / Zachary Area
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
