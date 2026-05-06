'use client';
import { C } from '@/lib/palette';
import { COURSES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Btn from '@/components/ui/Btn';

export default function Certificates() {
  const done = COURSES.filter(c => c.progress === 100);

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 12, color: C.t3 }}>
        <span style={{ color: C.t1, fontWeight: 600 }}>{done.length}</span> certificados obtenidos
      </div>
      {done.map(c => (
        <GlassCard key={c.id} className="glass card-hover" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}25, ${C.teal}12)`, border: `1px solid ${C.teal}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 16px ${C.teal}20` }}>
            <span style={{ fontSize: 18, color: C.teal }}>★</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 3 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>Emitido el 15 Abr 2025 · ID: INS-{1000 + c.id}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" style={{ fontSize: 12, padding: '6px 12px' }}>PDF</Btn>
            <Btn variant="ghost" style={{ fontSize: 12, padding: '6px 12px' }}>Compartir</Btn>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
