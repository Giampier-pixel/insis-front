'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import { COURSES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Btn from '@/components/ui/Btn';

export default function MyLearning() {
  const [filter, setFilter] = useState('Todos');
  const enrolled = COURSES.filter(c => {
    if (c.progress === 0) return false;
    if (filter === 'En progreso') return c.progress < 100;
    if (filter === 'Completados') return c.progress === 100;
    return true;
  });

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Todos', 'En progreso', 'Completados'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${filter === t ? C.accent + '80' : C.b1}`, background: filter === t ? 'rgba(140,183,155,0.15)' : 'transparent', color: filter === t ? C.accentL : C.t2, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {enrolled.map(c => (
          <GlassCard key={c.id} className="glass card-hover" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{c.instructor} · {c.duration}</div>
                </div>
                <Badge label={c.progress === 100 ? '✓ Completado' : `${c.progress}%`} color={c.progress === 100 ? C.teal : C.accent} size="sm" />
              </div>
              <ProgressBar pct={c.progress} color={c.progress === 100 ? C.teal : C.accent} height={4} glow />
            </div>
            <Btn variant="ghost" style={{ flexShrink: 0 }}>{c.progress === 100 ? 'Certificado' : 'Continuar'}</Btn>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
