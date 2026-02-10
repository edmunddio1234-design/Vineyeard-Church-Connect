import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Button } from '../components/UI';
import Icon from '../components/Icons';

export default function ConnectionsPage({ members }) {
  const [tab, setTab] = useState('connected');
  const [conns, setConns] = useState(members.slice(0, 3).map((m) => m.id));
  const [pend, setPend] = useState(members.slice(3, 6).map((m) => m.id));

  const handleAccept = (memberId) => {
    setPend((prev) => prev.filter((id) => id !== memberId));
    setConns((prev) => [...prev, memberId]);
  };

  const handleDecline = (memberId) => {
    setPend((prev) => prev.filter((id) => id !== memberId));
  };

  const connectedMembers = members.filter((m) => conns.includes(m.id));
  const pendingMembers = members.filter((m) => pend.includes(m.id));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={S.h1}>My Connections</h1>
      <p style={{ ...S.muted, marginBottom: '24px' }}>
        Manage your Vineyard Church of Baton Rouge community connections
      </p>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setTab('connected')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            border: `2px solid ${tab === 'connected' ? T.primaryDark : T.border}`,
            backgroundColor: tab === 'connected' ? T.primaryFaint : T.white,
            color: tab === 'connected' ? T.primaryDark : T.textMuted,
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Connected ({connectedMembers.length})
        </button>
        <button
          onClick={() => setTab('pending')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            border: `2px solid ${tab === 'pending' ? T.primaryDark : T.border}`,
            backgroundColor: tab === 'pending' ? T.primaryFaint : T.white,
            color: tab === 'pending' ? T.primaryDark : T.textMuted,
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Pending ({pendingMembers.length})
        </button>
      </div>

      {/* Connected Tab */}
      {tab === 'connected' && (
        <div style={S.grid2}>
          {connectedMembers.map((member) => (
            <div
              key={member.id}
              style={{
                ...S.card,
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
                    {member.location}, {member.age}
                  </div>
                </div>
              </div>

              <div style={S.divider} />

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  style={{ flex: 1 }}
                >
                  Message
                </Button>
                <span
                  style={{
                    fontSize: '12px',
                    color: T.success,
                    fontWeight: '600',
                  }}
                >
                  Connected
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Tab */}
      {tab === 'pending' && (
        <>
          {pendingMembers.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <div style={{ fontSize: '48px', color: T.borderLight, marginBottom: '12px' }}>
                <Icon name="check" size={48} color={T.borderLight} />
              </div>
              <h3 style={S.h3}>All caught up!</h3>
            </div>
          ) : (
            <div style={S.grid2}>
              {pendingMembers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    ...S.card,
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
                        {member.location}
                        {member.maritalStatus && ` • ${member.maritalStatus}`}
                        {member.kids !== undefined && ` • ${member.kids} kids`}
                      </div>
                    </div>
                  </div>

                  <div style={S.divider} />

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAccept(member.id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Icon name="check" size={16} color={T.white} />
                      Accept
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDecline(member.id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Icon name="x" size={16} color={T.textDark} />
                      Decline
                    </Button>
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
