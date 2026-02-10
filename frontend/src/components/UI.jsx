import React from 'react';
import { T } from '../theme';
import Icon from './Icons';

// Avatar - supports initials string, name string, photo URL, and size
export function Avatar({ initials, name, size = 48, onClick, photo, style = {}, ...props }) {
  const getInitials = () => {
    if (initials) return initials;
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    return '?';
  };
  if (photo) {
    return <img src={photo} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', cursor: onClick ? 'pointer' : 'default', flexShrink: 0, ...style }} onClick={onClick} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg,${T.primary},${T.primaryLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.white, fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, letterSpacing: '0.5px', cursor: onClick ? 'pointer' : 'default', ...style }} onClick={onClick} {...props}>
      {getInitials()}
    </div>
  );
}

// Tag - supports active toggle and onClick
export function Tag({ label, children, active, onClick, variant, style = {}, ...props }) {
  const isActive = active || variant === 'active';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: 20, background: isActive ? T.primaryDark : T.primaryFaint, color: isActive ? T.white : T.primary, fontSize: 13, fontWeight: 500, cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s', border: `1px solid ${isActive ? T.primaryDark : T.border}`, margin: '3px', ...style }} onClick={onClick} {...props}>
      {label || children}
    </span>
  );
}

// Button - supports primary, outline, ghost variants + small size
export function Button({ children, variant = 'primary', small, size, onClick, style = {}, disabled, ...props }) {
  const isSmall = small || size === 'sm';
  const base = { padding: isSmall ? '6px 14px' : '10px 20px', borderRadius: isSmall ? 8 : 10, fontWeight: 600, fontSize: isSmall ? 13 : 14, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', opacity: disabled ? 0.6 : 1 };
  const variants = {
    primary: { ...base, border: 'none', background: `linear-gradient(135deg,${T.primary},${T.primaryDark})`, color: T.white },
    outline: { ...base, border: `2px solid ${T.primary}`, background: T.white, color: T.primary },
    ghost: { ...base, border: 'none', background: T.primaryFaint, color: T.primary },
    secondary: { ...base, border: 'none', background: T.primaryFaint, color: T.text },
    danger: { ...base, border: 'none', background: T.danger, color: T.white },
    success: { ...base, border: 'none', background: T.success, color: T.white },
  };
  return <button style={{ ...(variants[variant] || variants.primary), ...style }} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
}

// Input with optional label
export function Input({ label, style = {}, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: T.textDark, marginBottom: 6 }}>{label}</label>}
      <input style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `2px solid ${T.border}`, fontSize: 14, color: T.textDark, outline: 'none', background: T.white, transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit', ...style }} onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} {...props} />
    </div>
  );
}

// TextArea with optional label
export function TextArea({ label, style = {}, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: T.textDark, marginBottom: 6 }}>{label}</label>}
      <textarea style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `2px solid ${T.border}`, fontSize: 14, color: T.textDark, outline: 'none', background: T.white, transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit', minHeight: 100, resize: 'vertical', ...style }} onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} {...props} />
    </div>
  );
}

// Select dropdown
export function Select({ label, options = [], placeholder, style = {}, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: T.textDark, marginBottom: 6 }}>{label}</label>}
      <select style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `2px solid ${T.border}`, fontSize: 14, color: T.textDark, outline: 'none', background: T.white, transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit', ...style }} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// InfoRow for profile details
export function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.borderLight}` }}>
      {icon && (typeof icon === 'string' ? <Icon name={icon} size={16} color={T.primaryLight} /> : icon)}
      <span style={{ fontSize: 13, color: T.textMuted, minWidth: 100 }}>{label}</span>
      <span style={{ fontSize: 14, color: T.textDark, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// Badge for notification count
export function Badge({ count, style = {} }) {
  return (
    <div style={{ position: 'absolute', top: -4, right: -4, background: T.danger, color: T.white, fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      {count > 99 ? '99+' : count}
    </div>
  );
}

// Card wrapper
export function Card({ children, style = {}, ...props }) {
  return (
    <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.borderLight}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 16, transition: 'all 0.2s', ...style }} {...props}>
      {children}
    </div>
  );
}

// Spinner
export function Spinner() {
  return (
    <div style={{ display: 'inline-block', width: 20, height: 20, border: `3px solid ${T.borderLight}`, borderTop: `3px solid ${T.primary}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
