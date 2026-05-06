'use client';
import { C } from '@/lib/palette';
export default function EmptyState({ title = 'Sin datos', message, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 24px', color: C.t3 }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>📭</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.t2, marginBottom: 6 }}>{title}</div>
      {message && <div style={{ fontSize: 13, color: C.t3, textAlign: 'center', maxWidth: 320 }}>{message}</div>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}
