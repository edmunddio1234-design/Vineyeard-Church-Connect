import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar } from '../components/UI';

export function ConnectionTree({ members = [] }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  // Use real members if available, otherwise use demo data
  const realMembers = Array.isArray(members) && members.length > 0;
  const nodeMembers = realMembers
    ? members.filter(m => m.id)
    : [
        { id: 1, name: 'John Smith', location: 'Baton Rouge', currentGroups: ['Men\'s Fellowship'] },
        { id: 2, name: 'Maria Garcia', location: 'Baton Rouge', currentGroups: ['Women of Faith'] },
        { id: 3, name: 'David Johnson', location: 'Baton Rouge', currentGroups: ['Men\'s Fellowship', 'Couples Connect'] },
        { id: 4, name: 'Sarah Williams', location: 'Baton Rouge', currentGroups: ['Women of Faith', 'Prayer Warriors'] },
        { id: 5, name: 'Robert Brown', location: 'Baton Rouge', currentGroups: ['Couples Connect'] },
        { id: 6, name: 'Elizabeth Lee', location: 'Baton Rouge', currentGroups: ['Young Adults'] },
        { id: 7, name: 'James Davis', location: 'Baton Rouge', currentGroups: ['Young Adults', 'Worship Team'] },
        { id: 8, name: 'Jessica Miller', location: 'Baton Rouge', currentGroups: ['Worship Team', 'Prayer Warriors'] },
      ];

  // Auto-generate connections based on shared groups, location, or hobbies
  const generateConnections = () => {
    const conns = [];
    const seen = new Set();
    for (let i = 0; i < nodeMembers.length; i++) {
      for (let j = i + 1; j < nodeMembers.length; j++) {
        const a = nodeMembers[i];
        const b = nodeMembers[j];
        const aGroups = a.currentGroups || a.current_groups || [];
        const bGroups = b.currentGroups || b.current_groups || [];
        const sharedGroups = aGroups.filter(g => bGroups.includes(g));
        const aHobbies = a.hobbies || [];
        const bHobbies = b.hobbies || [];
        const sharedHobbies = aHobbies.filter(h => bHobbies.includes(h));
        const sameLocation = a.location && b.location && a.location === b.location;

        if (sharedGroups.length > 0 || sharedHobbies.length >= 2 || (sameLocation && (sharedHobbies.length > 0 || sharedGroups.length > 0))) {
          const key = `${a.id}-${b.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            conns.push({ from: a.id, to: b.id, reason: sharedGroups.join(', ') || sharedHobbies.join(', ') || a.location });
          }
        }
      }
    }
    // If no natural connections, create some based on proximity in the list
    if (conns.length === 0 && nodeMembers.length > 1) {
      for (let i = 0; i < nodeMembers.length; i++) {
        const next = (i + 1) % nodeMembers.length;
        conns.push({ from: nodeMembers[i].id, to: nodeMembers[next].id });
      }
    }
    return conns;
  };

  const connections = generateConnections();

  // Helper: Get all connections for a member
  const getMemberConns = (id) => {
    return connections.filter(c => c.from === id || c.to === id);
  };

  // Helper: Check if two members are connected
  const isConnected = (id) => {
    if (!selected) return false;
    return connections.some(
      c => (c.from === selected && c.to === id) || (c.from === id && c.to === selected)
    );
  };

  // Calculate positions in a circle
  const svgWidth = 800;
  const svgHeight = 640;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = 240;

  const memberCount = nodeMembers.length;

  const getNodePosition = (index) => {
    const angle = (2 * Math.PI * index / Math.max(memberCount, 1)) - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Get member by index
  const getMember = (index) => {
    return nodeMembers[index] || { id: index + 1, name: `Member ${index + 1}`, location: 'Baton Rouge' };
  };

  // Get first name from full name
  const getFirstName = (name) => {
    if (!name) return '';
    // Handle "& " pattern
    if (name.includes('&')) {
      return name.split('&')[0].trim();
    }
    return name.split(' ')[0];
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <h1 style={S.h1}>Connection Tree</h1>
      <p style={S.muted}>See how our Vineyard Church of Baton Rouge family is connected</p>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginTop: '24px' }}>
        {/* LEFT: SVG Visualization */}
        <div style={{ ...S.card, padding: '16px', overflow: 'hidden' }}>
          <svg
            width="100%"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ display: 'block' }}
          >
            {/* Background */}
            <rect
              width={svgWidth}
              height={svgHeight}
              fill={T.bgSoft}
              rx="16"
            />

            {/* Title */}
            <text
              x={svgWidth / 2}
              y="30"
              textAnchor="middle"
              style={{
                fontSize: '14px',
                fill: T.textMuted,
                fontWeight: '500',
              }}
            >
              Click a member to see their connections
            </text>

            {/* Connection Lines */}
            {connections.map((conn, idx) => {
              const fromIdx = nodeMembers.findIndex(m => m.id === conn.from);
              const toIdx = nodeMembers.findIndex(m => m.id === conn.to);
              if (fromIdx === -1 || toIdx === -1) return null;
              const fromPos = getNodePosition(fromIdx);
              const toPos = getNodePosition(toIdx);
              const isActive = selected && (isConnected(conn.from) || isConnected(conn.to));
              const isLineActive = selected && (
                (conn.from === selected || conn.to === selected)
              );

              return (
                <line
                  key={`conn-${idx}`}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={
                    isLineActive
                      ? T.primaryDark
                      : hovered === conn.from || hovered === conn.to
                      ? '#6B7280'
                      : T.border
                  }
                  strokeWidth={isLineActive ? 3 : hovered === conn.from || hovered === conn.to ? 2 : 1}
                  opacity={
                    isLineActive
                      ? 1
                      : hovered === conn.from || hovered === conn.to
                      ? 0.8
                      : selected
                      ? 0.15
                      : 0.4
                  }
                  style={{ pointerEvents: 'none' }}
                />
              );
            })}

            {/* Member Nodes */}
            {nodeMembers.map((member, idx) => {
              const memberId = member.id;
              const pos = getNodePosition(idx);
              const isSelected = selected === memberId;
              const isConnectedToSelected = selected && isConnected(memberId);
              const isHovered = hovered === memberId;

              // Determine node size and appearance
              let nodeRadius = 24;
              let nodeFill = '#9CA3AF';
              let fontSize = 12;

              if (isSelected) {
                nodeRadius = 36;
                nodeFill = T.primaryDark;
                fontSize = 14;
              } else if (isConnectedToSelected) {
                nodeRadius = 30;
                nodeFill = T.primary;
                fontSize = 12;
              } else if (isHovered) {
                nodeRadius = 28;
                nodeFill = '#6B7280';
                fontSize = 12;
              }

              return (
                <g key={`node-${memberId}`}>
                  {/* Glow circle for selected */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={nodeRadius + 8}
                      fill={T.primary}
                      opacity="0.15"
                    />
                  )}

                  {/* Main node circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeRadius}
                    fill={nodeFill}
                    stroke={T.white}
                    strokeWidth="3"
                    opacity={
                      selected && !isSelected && !isConnectedToSelected ? 0.3 : 1
                    }
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => setSelected(isSelected ? null : memberId)}
                    onMouseEnter={() => setHovered(memberId)}
                    onMouseLeave={() => setHovered(null)}
                  />

                  {/* Initials text */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: '700',
                      fill: T.white,
                      pointerEvents: 'none',
                    }}
                  >
                    {getInitials(member.name)}
                  </text>

                  {/* Connection count badge */}
                  {getMemberConns(memberId).length > 0 && (
                    <>
                      <circle
                        cx={pos.x + nodeRadius * 0.7}
                        cy={pos.y - nodeRadius * 0.7}
                        r="10"
                        fill={T.primaryDark}
                      />
                      <text
                        x={pos.x + nodeRadius * 0.7}
                        y={pos.y - nodeRadius * 0.7}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: '9px',
                          fontWeight: '700',
                          fill: T.white,
                          pointerEvents: 'none',
                        }}
                      >
                        {getMemberConns(memberId).length}
                      </text>
                    </>
                  )}

                  {/* Name label */}
                  <text
                    x={pos.x}
                    y={pos.y + nodeRadius + 16}
                    textAnchor="middle"
                    style={{
                      fontSize: '12px',
                      fill:
                        isSelected || isConnectedToSelected
                          ? T.primaryDark
                          : T.textMuted,
                      fontWeight: isSelected || isConnectedToSelected ? '700' : '500',
                      opacity:
                        selected && !isSelected && !isConnectedToSelected ? 0.3 : 1,
                      pointerEvents: 'none',
                    }}
                  >
                    {getFirstName(member.name)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* RIGHT: Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Network Stats Card */}
          <div style={S.card}>
            <h3 style={S.h3}>Network Stats</h3>
            <div style={S.flexCol}>
              <div
                style={{
                  backgroundColor: T.primaryFaint,
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <div style={{ fontSize: '12px', color: T.textMuted, marginBottom: '4px' }}>
                  Total Connections
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: T.primaryDark }}>
                  {connections.length}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: T.primaryFaint,
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <div style={{ fontSize: '12px', color: T.textMuted, marginBottom: '4px' }}>
                  Avg Connections per Member
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: T.primaryDark }}>
                  {(connections.length * 2 / memberCount).toFixed(1)}
                </div>
              </div>

              {/* Most Connected Member */}
              {memberCount > 0 && (() => {
                const mostConnected = nodeMembers.reduce((max, m, idx) => {
                  const conns = getMemberConns(m.id);
                  return conns.length > (max.count || 0)
                    ? { id: m.id, count: conns.length, name: m.name }
                    : max;
                }, { count: 0 });
                if (!mostConnected.name) return null;
                return (
                  <div
                    style={{
                      backgroundColor: T.primaryFaint,
                      borderRadius: '10px',
                      padding: '10px 14px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: T.textMuted, marginBottom: '4px' }}>
                      Most Connected
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: T.primaryDark }}>
                      {mostConnected.name} ({mostConnected.count})
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Selected Member Connections Card */}
          {selected && (
            <div style={S.card}>
              <div style={{ ...S.flex, marginBottom: '16px' }}>
                <Avatar name={(nodeMembers.find(m => m.id === selected) || {}).name || 'User'} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: T.textDark }}>
                    {(nodeMembers.find(m => m.id === selected) || {}).name || 'Member'}
                  </div>
                  <div style={{ fontSize: '12px', color: T.textMuted }}>
                    {getMemberConns(selected).length} connections
                  </div>
                </div>
              </div>

              <div style={S.divider} />

              <div style={{ fontSize: '12px', fontWeight: '600', color: T.textDark, marginBottom: '12px' }}>
                Connected to:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {getMemberConns(selected).map((conn) => {
                  const connectedId = conn.from === selected ? conn.to : conn.from;
                  const connectedMember = nodeMembers.find(m => m.id === connectedId) || { name: 'Member', location: '' };
                  return (
                    <div
                      key={`conn-sidebar-${connectedId}`}
                      onClick={() => setSelected(connectedId)}
                      style={{
                        backgroundColor: T.primaryFaint,
                        borderRadius: '10px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F0F0F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = T.primaryFaint;
                      }}
                    >
                      <Avatar name={connectedMember.name} size={28} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: T.textDark }}>
                          {connectedMember.name}
                        </div>
                        <div style={{ fontSize: '11px', color: T.textMuted }}>
                          {connectedMember.location}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How to Use Legend */}
          <div style={S.card}>
            <h3 style={S.h3}>How to Use</h3>
            <div style={S.flexCol}>
              <div style={{ ...S.flex, gap: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: T.primaryDark,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '12px', color: T.text }}>Selected member</span>
              </div>

              <div style={{ ...S.flex, gap: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: T.primary,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '12px', color: T.text }}>Connected to selected</span>
              </div>

              <div style={{ ...S.flex, gap: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#9CA3AF',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '12px', color: T.text }}>Not connected</span>
              </div>

              <div style={{ ...S.flex, gap: '8px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '3px',
                    backgroundColor: T.primaryDark,
                  }}
                />
                <span style={{ fontSize: '12px', color: T.text }}>Active connection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectionTree;
