'use client';
import { C } from '@/lib/palette';

export default function GlassCard({ children, style: s, className = 'glass', onClick, hoverable }) {
  return (
    <div
      className={`${className}${hoverable ? ' card-hover' : ''}`}
      style={{ position: 'relative', overflow: 'hidden', ...s }}
      onClick={onClick}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.b2}, transparent)`, pointerEvents: 'none' }} />
      {children}
    </div>
  );
}
