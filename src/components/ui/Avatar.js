'use client';
import { C } from '@/lib/palette';

export default function Avatar({ name, size = 32, color = C.accent }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${color}30, ${color}18)`, border: `1.5px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.33, fontWeight: 700, color, letterSpacing: '0.02em', boxShadow: `0 0 12px ${color}22` }}>
      {initials}
    </div>
  );
}
