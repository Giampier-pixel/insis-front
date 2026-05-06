'use client';
import { C } from '@/lib/palette';
import GlassCard from './GlassCard';

export default function StatCard({ label, value, sub, color = C.accent }) {
  return (
    <GlassCard hoverable style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ width: 28, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${color}66)`, marginBottom: 4, boxShadow: `0 0 8px ${color}88` }} />
      <div style={{ fontSize: 11, color: C.t2, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.t1, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.t3 }}>{sub}</div>}
    </GlassCard>
  );
}
