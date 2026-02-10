import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Button, Tag } from '../components/UI';
import Icon from '../components/Icons';

export default function ConnectionsPage({ members }) {
  const [tab, setTab] = useState('needs');
  const [searchTerm, setSearchTerm] = useState('');

  // Members who need help (have needHelpWith array)
  const membersNeedingHelp = members.filter(
    (m) => m.needHelpWith && m.needHelpWith.length > 0
  );

  // Members willing to help (have availableToHelp array)
  const membersWillingToHelp = members.filter(
    (m) => m.availableToHelp && m.availableToHelp.length > 0
  );

  const filteredNeeds = searchTerm
    ? membersNeedingHelp.filter(
        (m) =>
          m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.needHelpWith.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : membersNeedingHelp;

  const filteredHelpers = searchTerm
    ? membersWillingToHelp.filter(
        (m) =>
          m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.availableToHelp.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : membersWillingToHelp;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div
        style={{
          ...S.card,
          background: 'linear-gradient(135deg, #4B5563, #374151)',
          border: 'none',
          color: T.white,
          textAlign: 'center',
          padding: '32px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤝</div>
        <h1 style={{ ...S.h1, color: T.white, marginBottom: '8px' }}>Help Board</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '15px' }}>
          See who needs help and who's willing to lend a hand in our church family
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or help category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '14px',
            border: `2px solid ${T.border}`,
            borderRadius: '10px',
            outline: 'none',
            backgroundColor: T.white,
            color: T.text,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setTab('needs')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            border: `2px solid ${tab === 'needs' ? '#F59E0B' : T.border}`,
            backgroundColor: tab === 'needs' ? '#FEF3C7' : T.white,
            color: tab === 'needs' ? '#92400E' : T.textMuted,
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="heart" size={18} color={tab === 'needs' ? '#F59E0B' : T.textMuted} />
          Looking for Help ({filteredNeeds.length})
        </button>
        <button
          onClick={() => setTab('helpers')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            border: `2px solid ${tab === 'helpers' ? T.success : T.border}`,
            backgroundColor: tab === 'helpers' ? T.primaryFaint : T.white,
            color: tab === 'helpers' ? T.primaryDark : T.textMuted,
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="check" size={18} color={tab === 'helpers' ? T.success : T.textMuted} />
          Willing to Help ({filteredHelpers.length})
        </button>
      </div>

      {/* Looking for Help Tab */}
      {tab === 'needs' && (
        <>
          {filteredNeeds.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤝</div>
              <h3 style={S.h3}>No help requests yet</h3>
              <p style={S.muted}>
                Members can add what they need help with on their profile's Edit page.
              </p>
            </div>
          ) : (
            <div style={S.grid2}>
              {filteredNeeds.map((member) => (
                <div
                  key={member.id}
                  style={{
                    ...S.card,
                    borderLeft: '4px solid #F59E0B',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Avatar name={member.name} size={50} />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: T.textDark }}>
                        {member.name}
                      </div>
                      <div style={{ ...S.muted }}>
                        {member.location || 'Vineyard Church member'}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400E', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Looking for help with:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {member.needHelpWith.map((item) => (
                        <span
                          key={item}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            borderRadius: '12px',
                            border: '1px solid #F59E0B',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Willing to Help Tab */}
      {tab === 'helpers' && (
        <>
          {filteredHelpers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💚</div>
              <h3 style={S.h3}>No helpers listed yet</h3>
              <p style={S.muted}>
                Members can add what they're willing to help with on their profile's Edit page.
              </p>
            </div>
          ) : (
            <div style={S.grid2}>
              {filteredHelpers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    ...S.card,
                    borderLeft: `4px solid ${T.success}`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Avatar name={member.name} size={50} />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: T.textDark }}>
                        {member.name}
                      </div>
                      <div style={{ ...S.muted }}>
                        {member.location || 'Vineyard Church member'}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: T.success, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Willing to help with:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {member.availableToHelp.map((item) => (
                        <span
                          key={item}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: T.primaryFaint,
                            color: T.primaryDark,
                            borderRadius: '12px',
                            border: `1px solid ${T.primary}`,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
