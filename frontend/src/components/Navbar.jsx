import React, { useState, useRef, useEffect } from 'react';
import { T } from '../theme';

import VineyardLogo from './VineyardLogo';
import Icon from './Icons';
import { Avatar, Badge, Button } from './UI';

export default function Navbar({ page, setPage, user, notifications = [], unreadCount = 0, onMarkAllRead, onMarkRead, onLogout }) {
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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

  const notificationCount = typeof unreadCount === 'number' ? unreadCount : (Array.isArray(notifications) ? notifications.filter(n => !n.is_read).length : 0);

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
        {/* Bell Icon with Badge + Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
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

          {/* Notifications Dropdown */}
          {showNotifPanel && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '360px',
                maxHeight: '420px',
                backgroundColor: T.white,
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                border: `1px solid ${T.borderLight}`,
                zIndex: 200,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderBottom: `1px solid ${T.borderLight}`,
                }}
              >
                <span style={{ fontWeight: '600', fontSize: '15px' }}>Notifications</span>
                {notificationCount > 0 && (
                  <button
                    onClick={() => { if (onMarkAllRead) onMarkAllRead(); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: T.primary,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => { if (onMarkRead && !notif.is_read) onMarkRead(notif.id); }}
                      style={{
                        padding: '12px 16px',
                        borderBottom: `1px solid ${T.borderLight}`,
                        backgroundColor: notif.is_read ? T.white : '#F0F4FF',
                        cursor: notif.is_read ? 'default' : 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>
                          {notif.type === 'prayer_request' ? '🙏' : '🔔'}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: notif.is_read ? '400' : '600', fontSize: '13px', color: T.text }}>
                            {notif.title}
                          </div>
                          {notif.message && (
                            <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '4px', lineHeight: '1.4' }}>
                              {notif.message.length > 100 ? notif.message.slice(0, 100) + '...' : notif.message}
                            </div>
                          )}
                          <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '4px' }}>
                            {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {!notif.is_read && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: T.primary, flexShrink: 0, marginTop: '4px' }} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: T.textMuted }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                    <div style={{ fontSize: '14px' }}>No notifications yet</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Join the Prayer Team to get notified about prayer requests
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
