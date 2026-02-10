import React from 'react';

export default function VineyardLogo({ size = 120 }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <svg
        viewBox="0 0 200 180"
        width={size}
        height={size * 0.9}
        style={{ marginBottom: '8px' }}
      >
        <defs>
          <linearGradient id="vineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6B7280', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#9CA3AF', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <path
          d="M 100 20 Q 90 35 85 50 Q 80 65 80 80 Q 80 95 90 100 L 100 105 L 110 100 Q 120 95 120 80 Q 120 65 115 50 Q 110 35 100 20 Z"
          fill="url(#vineGrad)"
          stroke="#374151"
          strokeWidth="1.5"
        />

        <circle cx="75" cy="45" r="8" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />
        <circle cx="125" cy="45" r="8" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />

        <circle cx="70" cy="65" r="7" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />
        <circle cx="130" cy="65" r="7" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />

        <circle cx="60" cy="85" r="7" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />
        <circle cx="140" cy="85" r="7" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />

        <circle cx="85" cy="70" r="6" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />
        <circle cx="115" cy="70" r="6" fill="url(#vineGrad)" stroke="#374151" strokeWidth="1" />

        <path
          d="M 80 45 Q 75 60 70 75"
          stroke="#374151"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 120 45 Q 125 60 130 75"
          stroke="#374151"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        <path
          d="M 100 20 L 100 10 M 95 15 L 90 8 M 105 15 L 110 8"
          stroke="#374151"
          strokeWidth="1.5"
          fill="none"
        />

        <path d="M 100 100 Q 95 115 100 130 Q 105 115 100 100" fill="#374151" opacity="0.3" />
      </svg>

      <div
        style={{
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1px',
          color: '#374151',
          textAlign: 'center',
          lineHeight: '1.3',
          marginTop: '4px',
        }}
      >
        <div>VINEYARD CHURCH</div>
        <div>OF BATON ROUGE</div>
      </div>
    </div>
  );
}
