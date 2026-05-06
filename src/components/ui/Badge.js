'use client';
import { C } from '@/lib/palette';

export default function Badge({ label, color = C.accent, size = 'sm' }) {
  const pad = size === 'sm' ? '2px 8px' : '4px 12px';
  const fs = size === 'sm' ? 10 : 12;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: pad, borderRadius: 20, fontSize: fs, fontWeight: 600, letterSpacing: '0.04em', color, background: color + '22', border: `1px solid ${color}33` }}>
      {label}
    </span>
  );
}
