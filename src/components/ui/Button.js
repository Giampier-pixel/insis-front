'use client';
import { C } from '@/lib/palette';

const variants = {
  primary: {
    background: C.accent, color: '#fff',
    border: `1px solid ${C.accent}`,
  },
  secondary: {
    background: C.accentLight, color: C.accent,
    border: `1px solid ${C.border}`,
  },
  ghost: {
    background: 'transparent', color: C.t2,
    border: `1px solid ${C.border}`,
  },
  danger: {
    background: '#FEF2F2', color: C.danger,
    border: `1px solid #FECACA`,
  },
};

export default function Button({ children, variant = 'primary', onClick, disabled, style: s, type = 'button', size = 'md' }) {
  const pad = size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 28px' : '9px 20px';
  const fs  = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: pad, borderRadius: 8, fontSize: fs, fontWeight: 600,
        letterSpacing: '0.01em', transition: 'all .15s', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        ...variants[variant], ...s,
      }}
      onMouseEnter={e => { if (!disabled && variant === 'primary') e.currentTarget.style.background = C.accentHover; }}
      onMouseLeave={e => { if (!disabled && variant === 'primary') e.currentTarget.style.background = C.accent; }}
    >
      {children}
    </button>
  );
}
