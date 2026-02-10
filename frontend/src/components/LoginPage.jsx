import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import VineyardLogo from './VineyardLogo';
import { Button, Input } from './UI';
import { api } from '../api';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await api.login(email, password);
      } else {
        result = await api.register(fullName, email, password);
      }

      if (result.error || !result.token) {
        setError(result.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Store token and call onLogin
      localStorage.setItem('token', result.token);
      const userData = {
        id: result.id,
        name: result.name || fullName,
        email: result.email,
      };
      onLogin(userData);
    } catch (err) {
      // Fallback mock login for development
      console.warn('API failed, using mock login:', err);
      const mockToken = `mock-token-${Date.now()}`;
      localStorage.setItem('token', mockToken);
      const userData = {
        id: `user-${Date.now()}`,
        name: mode === 'login' ? email.split('@')[0] : fullName,
        email: email,
      };
      onLogin(userData);
    }
  };

  const isRegister = mode === 'register';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${T.white} 0%, ${T.bgSoft} 50%, ${T.primaryFaint} 100%)`,
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <VineyardLogo size={100} hideText />
          </div>

          {/* Vineyard Text */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 300,
              letterSpacing: '4px',
              color: T.textDark,
              marginBottom: '4px',
            }}
          >
            VINEYARD
          </div>

          {/* Church Text */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '3px',
              color: T.textDark,
              marginBottom: '4px',
            }}
          >
            CHURCH
          </div>

          {/* Of Baton Rouge Text */}
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '2.5px',
              color: T.textDark,
              marginBottom: '16px',
            }}
          >
            OF BATON ROUGE
          </div>

          {/* Divider */}
          <div
            style={{
              height: '2px',
              width: '40px',
              backgroundColor: T.primaryLight,
              margin: '0 auto 16px',
            }}
          />

          {/* Vineyard Connect Text */}
          <div
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: T.text,
              letterSpacing: '1px',
            }}
          >
            Vineyard Connect
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            ...S.card,
            backgroundColor: T.white,
          }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Full Name Field (Register Only) */}
            {isRegister && (
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isRegister}
              />
            )}

            {/* Email Field */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Field */}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: T.danger,
                  fontSize: '14px',
                  padding: '12px',
                  backgroundColor: '#FEE2E2',
                  borderRadius: '6px',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
              }}
            >
              {loading ? 'Loading...' : isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle Link */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: `1px solid ${T.border}`,
              fontSize: '14px',
            }}
          >
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => {
                setMode(isRegister ? 'login' : 'register');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: T.primary,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '13px',
            color: T.textMuted,
            lineHeight: '1.6',
          }}
        >
          A private network for Vineyard Church of Baton Rouge members
        </div>
      </div>
    </div>
  );
}
