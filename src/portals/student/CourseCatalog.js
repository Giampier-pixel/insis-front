'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import { COURSES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Btn from '@/components/ui/Btn';

export default function CourseCatalog({ onNav }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todos');
  const categories = ['Todos', 'Management', 'Herramientas', 'Habilidades', 'Compliance', 'Análisis'];
  const filtered = COURSES.filter(c => (cat === 'Todos' || c.category === cat) && c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(5,31,32,0.5)', border: `1px solid ${C.b1}`, borderRadius: 9, padding: '9px 14px', backdropFilter: 'blur(8px)' }}>
          <span style={{ color: C.t3 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cursos…"
            aria-label="Buscar cursos"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.t1, fontSize: 13, fontFamily: 'DM Sans' }}
          />
        </div>
        <Btn variant="ghost">Filtros</Btn>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${cat === c ? C.accent + '80' : C.b1}`, background: cat === c ? 'rgba(140,183,155,0.15)' : 'transparent', color: cat === c ? C.accentL : C.t2, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', boxShadow: cat === c ? `0 0 12px ${C.accent}22` : '' }}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {filtered.map(c => (
          <GlassCard key={c.id} hoverable onClick={() => onNav('my-learning')} style={{ overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 90, background: `linear-gradient(135deg, ${C.g2}80, ${C.g1}60)`, borderBottom: `1px solid ${C.b1}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 70% 30%, ${C.accent}20, transparent)` }} />
              <div style={{ fontSize: 9, color: C.t3, fontFamily: 'DM Mono, monospace', textAlign: 'center', padding: '0 16px', position: 'relative' }}>[ thumbnail: {c.title} ]</div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <Badge label={c.category} />
                <Badge label={c.level} color={C.t2} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4, lineHeight: 1.4 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 10 }}>{c.instructor} · {c.duration}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: C.amber }}>★ <span style={{ fontWeight: 700, color: C.t1 }}>{c.rating}</span></span>
                {c.progress > 0 && (
                  <span style={{ fontSize: 11, color: c.progress === 100 ? C.teal : C.accent, fontWeight: 600 }}>
                    {c.progress === 100 ? '✓ Listo' : `${c.progress}%`}
                  </span>
                )}
              </div>
              {c.progress > 0 && c.progress < 100 && (
                <div style={{ marginTop: 8 }}><ProgressBar pct={c.progress} color={C.accent} height={3} /></div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
