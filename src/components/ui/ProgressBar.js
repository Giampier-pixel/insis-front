'use client';
import { C } from '@/lib/palette';
export default function ProgressBar({ pct, color = C.accent, height = 6, showLabel = false }) {
  const clamped = Math.min(Math.max(pct || 0, 0), 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: '#F1F5F9', borderRadius: height, height, overflow: 'hidden' }}>
        <div style={{ width: `${clamped}%`, height: '100%', background: color, borderRadius: height, transition: 'width .4s ease' }} />
      </div>
      {showLabel && <span style={{ fontSize: 11, fontWeight: 600, color: C.t2, flexShrink: 0, width: 32, textAlign: 'right' }}>{clamped}%</span>}
    </div>
  );
}
