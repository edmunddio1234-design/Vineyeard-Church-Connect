import React, { useState, useMemo } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Button, Input, Select, Tag } from '../components/UI';
import Icon from '../components/Icons';
import { LOCATIONS, SMALL_GROUPS, AVAIL_OPTS } from '../constants';

export default function DirectoryPage({ members, setPage, setSelMember }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('');
  const [filterGroup, setFilterGroup] = useState('');

  // Filtering logic
  const filteredMembers = useMemo(() => {
    return (members || []).filter((member) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          member.name?.toLowerCase().includes(query) ||
          member.work?.toLowerCase().includes(query) ||
          member.bio?.toLowerCase().includes(query) ||
          member.location?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filterLocation && member.location !== filterLocation) {
        return false;
      }

      // Available filter
      if (filterAvailable && (!member.available || !member.available.includes(filterAvailable))) {
        return false;
      }

      // Group filter
      if (filterGroup && (!member.currentGroups || !member.currentGroups.includes(filterGroup))) {
        return false;
      }

      return true;
    });
  }, [members, searchQuery, filterLocation, filterAvailable, filterGroup]);

  const hasActiveFilters = filterLocation || filterAvailable || filterGroup;

  const handleClearFilters = () => {
    setFilterLocation('');
    setFilterAvailable('');
    setFilterGroup('');
  };

  const handleMemberClick = (member) => {
    setSelMember(member);
    setPage('profile-view');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={S.h1}>Member Directory</h1>
        <p style={S.muted}>
          {filteredMembers.length} members in our Vineyard family
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ ...S.card, padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <Input
            placeholder="Search by name, work, location, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: T.primaryFaint,
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: T.text,
              fontWeight: '500',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = T.borderLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = T.primaryFaint;
            }}
          >
            <Icon name="filter" size={16} color={T.text} />
            Filters
          </button>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              paddingTop: '12px',
              borderTop: `1px solid ${T.border}`,
            }}
          >
            <Select
              options={LOCATIONS}
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              placeholder="Location"
            />
            <Select
              options={AVAIL_OPTS}
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              placeholder="Available For"
            />
            <Select
              options={SMALL_GROUPS}
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              placeholder="Small Group"
            />
            {hasActiveFilters && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Grid */}
      {filteredMembers.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredMembers.map((member) => {
            const joinYear = member.joinDate ? new Date(member.joinDate).getFullYear() : new Date().getFullYear();
            const groupsList = member.currentGroups || [];
            const displayGroups = groupsList.slice(0, 2);

            return (
              <div
                key={member.id}
                style={{
                  ...S.card,
                  padding: '20px',
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
                onClick={() => handleMemberClick(member)}
              >
                {/* Top: Avatar + Name + Retired Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <Avatar name={member.name} size={52} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: T.textDark }}>
                      {member.name}
                    </div>
                    {member.retired && (
                      <Tag variant="default" style={{ marginTop: '4px' }}>
                        Retired
                      </Tag>
                    )}
                  </div>
                </div>

                {/* Work Title */}
                {member.work && (
                  <div style={{ ...S.muted, marginBottom: '12px', fontSize: '13px' }}>
                    {member.work}
                  </div>
                )}

                {/* Divider */}
                <div style={S.divider}></div>

                {/* Info Grid: 2x2 */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '12px',
                    fontSize: '13px',
                  }}
                >
                  {/* Location */}
                  <div style={{ ...S.muted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Icon name="location" size={14} color={T.textMuted} />
                      <span>Location</span>
                    </div>
                    <div style={{ color: T.text, fontWeight: '500' }}>
                      {member.location || 'Not specified'}
                    </div>
                  </div>

                  {/* Age */}
                  <div style={{ ...S.muted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Icon name="cake" size={14} color={T.textMuted} />
                      <span>Age</span>
                    </div>
                    <div style={{ color: T.text, fontWeight: '500' }}>
                      {member.age || 'Not specified'}
                    </div>
                  </div>

                  {/* Kids Count */}
                  <div style={{ ...S.muted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Icon name="family" size={14} color={T.textMuted} />
                      <span>Kids</span>
                    </div>
                    <div style={{ color: T.text, fontWeight: '500' }}>
                      {member.kidsCount || '0'}
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div style={{ ...S.muted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Icon name="heart" size={14} color={T.textMuted} />
                      <span>Status</span>
                    </div>
                    <div style={{ color: T.text, fontWeight: '500' }}>
                      {member.maritalStatus || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Current Groups Tags */}
                {displayGroups.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {displayGroups.map((group) => (
                      <Tag key={group} variant="default">
                        {group}
                      </Tag>
                    ))}
                    {groupsList.length > 2 && (
                      <Tag variant="default">+{groupsList.length - 2}</Tag>
                    )}
                  </div>
                )}

                {/* Bio Preview */}
                <div
                  style={{
                    ...S.muted,
                    marginBottom: '12px',
                    lineHeight: '1.5',
                    color: T.text,
                  }}
                >
                  {member.bio
                    ? member.bio.length > 90
                      ? member.bio.substring(0, 90) + '...'
                      : member.bio
                    : 'No bio provided'}
                </div>

                {/* Divider */}
                <div style={S.divider}></div>

                {/* Bottom: Since Year + View Profile Button */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ ...S.muted }}>Since {joinYear}</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMemberClick(member);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: T.textMuted,
          }}
        >
          <Icon name="users" size={48} color={T.borderLight} style={{ marginBottom: '16px' }} />
          <h3 style={S.h3}>No members found</h3>
          <p style={S.muted}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
