'use client';
import { C } from '@/lib/palette';

export default function Btn({ children, variant = 'primary', onClick, style: s, disabled }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', border: 'none',
    transition: 'all .18s', letterSpacing: '0.02em', fontFamily: 'DM Sans', opacity: disabled ? .5 : 1
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.g2}, ${C.g1})`, color: C.accentL, border: `1px solid ${C.b2}`, boxShadow: `0 4px 16px rgba(5,31,32,0.4), inset 0 1px 0 ${C.b2}` },
    ghost: { background: 'rgba(140,183,155,0.08)', color: C.t2, border: `1px solid ${C.b1}` },
    danger: { background: 'rgba(240,120,120,0.12)', color: C.red, border: `1px solid rgba(240,120,120,0.3)` },
    success: { background: 'rgba(45,212,191,0.1)', color: C.teal, border: `1px solid rgba(45,212,191,0.3)` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...s }} onClick={disabled ? undefined : onClick}>
      {children}
    </button>
  );
}
