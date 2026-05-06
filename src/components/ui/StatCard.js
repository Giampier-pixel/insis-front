'use client';
import { C } from '@/lib/palette';
export default function StatCard({ label, value, sub, color = C.accent }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '18px 22px' }}>
      <div style={{ width: 24, height: 3, borderRadius: 2, background: color, marginBottom: 10 }} />
      <div style={{ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.t1, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.t3, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
