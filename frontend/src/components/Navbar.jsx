import React from 'react';
import { T } from '../theme';

import VineyardLogo from './VineyardLogo';
import Icon from './Icons';
import { Avatar, Badge, Button } from './UI';

export default function Navbar({ page, setPage, user, notifications = [], onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'directory', label: 'Members', icon: 'users' },
    { id: 'tree', label: 'My Network', icon: 'family' },
    { id: 'messages', label: 'Messages', icon: 'chat' },
    { id: 'connections', label: 'Help Board', icon: 'handshake' },
    { id: 'jobs', label: 'Jobs', icon: 'briefcase' },
    { id: 'prayer', label: 'Prayer', icon: 'pray' },
    { id: 'gallery', label: 'Gallery', icon: 'image' },
    { id: 'suggestions', label: 'Ideas', icon: 'megaphone' },
  ];

  const notificationCount = Array.isArray(notifications) ? notifications.length : 0;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: T.white,
        borderBottom: `2px solid ${T.borderLight}`,
        height: '64px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Left: Logo + Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: '0', flexShrink: 0 }}>
        <div style={{ width: '32px', height: '32px', flexShrink: 0 }}>
          <VineyardLogo size={32} hideText />
        </div>
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: T.textDark,
              lineHeight: '1.2',
            }}
          >
            VINEYARD
          </div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              color: T.textMuted,
              lineHeight: '1.2',
            }}
          >
            CHURCH OF BR
          </div>
        </div>
      </div>

      {/* Center: Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          justifyContent: 'center',
          maxWidth: '800px',
          margin: '0 20px',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {navItems.map((item) => {
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isActive ? T.primaryFaint : 'transparent',
                color: isActive ? T.primaryDark : T.textMuted,
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center' }}>
                <Icon name={item.icon} size={18} color="currentColor" />
              </div>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right: Bell + Avatar + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: '16px' }}>
        {/* Bell Icon with Badge */}
        <button
          onClick={() => setPage('connections')}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            color: T.textMuted,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
        >
          <Icon name="bell" size={20} color="currentColor" />
          {notificationCount > 0 && <Badge count={notificationCount} style={{ position: 'absolute', top: '-4px', right: '-4px' }} />}
        </button>

        {/* Avatar + Name */}
        <button
          onClick={() => setPage('profile-me')}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            gap: '10px',
          }}
        >
          <Avatar name={user?.name || 'User'} size={32} />
          <div
            style={{
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: 500,
              color: T.text,
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.name || 'Profile'}
          </div>
        </button>

        {/* Logout Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
          }}
        >
          <Icon name="logout" size={16} color={T.text} />
          <span style={{ fontSize: '12px' }}>Logout</span>
        </Button>
      </div>
    </div>
  );
}
