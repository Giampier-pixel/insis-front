'use client';
import { C } from '@/lib/palette';

export default function ProgressBar({ pct, color = C.accent, height = 4, glow = false }) {
  return (
    <div style={{ background: 'rgba(5,31,32,0.5)', borderRadius: height, height, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(90deg, ${color}cc, ${color})`, borderRadius: height, transition: 'width .5s ease', boxShadow: glow ? `0 0 8px ${color}88` : 'none' }} />
    </div>
  );
}
