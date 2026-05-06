'use client';
import { C } from '@/lib/palette';
import { DEPT_DATA, EMPLOYEES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import ProgressBar from '@/components/ui/ProgressBar';
import Avatar from '@/components/ui/Avatar';
import Btn from '@/components/ui/Btn';

export default function HRReports() {
  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {[
          { title: 'Resumen de empresa', desc: 'KPIs globales y completación', color: C.accent },
          { title: 'Por departamento', desc: 'Desglose por unidad organizacional', color: C.sky },
          { title: 'Ranking de empleados', desc: 'Top performers y en riesgo', color: C.teal },
          { title: 'Asignaciones vencidas', desc: 'Fecha límite superada o próxima', color: C.amber },
        ].map(r => (
          <GlassCard key={r.title} hoverable style={{ padding: '20px', cursor: 'pointer' }}>
            <div style={{ width: 28, height: 3, borderRadius: 2, background: r.color, marginBottom: 12, boxShadow: `0 0 8px ${r.color}` }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{r.title}</div>
            <div style={{ fontSize: 12, color: C.t3, lineHeight: 1.5, marginBottom: 16 }}>{r.desc}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="ghost" style={{ fontSize: 11, padding: '5px 11px' }}>Ver</Btn>
              <Btn variant="ghost" style={{ fontSize: 11, padding: '5px 11px' }}>CSV</Btn>
            </div>
          </GlassCard>
        ))}
      </div>
      <GlassCard style={{ padding: '22px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 18 }}>Completación por departamento</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 110 }}>
          {DEPT_DATA.map(d => (
            <div key={d.dept} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: d.pct >= 80 ? C.teal : d.pct >= 50 ? C.accent : C.red }}>{d.pct}%</div>
              <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${d.pct * 0.82}px`, background: d.pct >= 80 ? `linear-gradient(to top, ${C.teal}cc,${C.teal}55)` : d.pct >= 50 ? `linear-gradient(to top, ${C.accent}cc,${C.accent}55)` : `linear-gradient(to top, ${C.red}cc,${C.red}55)`, transition: 'height .6s ease', boxShadow: `0 0 10px ${d.pct >= 80 ? C.teal : d.pct >= 50 ? C.accent : C.red}40` }} />
              <div style={{ fontSize: 9, color: C.t3, textAlign: 'center' }}>{d.dept}</div>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.b3}`, fontSize: 13, fontWeight: 600, color: C.t1 }}>Ranking de empleados</div>
        {[...EMPLOYEES].sort((a, b) => b.pct - a.pct).slice(0, 5).map((e, i) => (
          <div
            key={e.id}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: `1px solid ${C.b3}`, transition: 'background .15s', cursor: 'pointer' }}
            onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(140,183,155,0.06)'}
            onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: 22, fontSize: 13, fontWeight: 800, color: i < 3 ? C.amber : C.t3 }}>#{i + 1}</div>
            <Avatar name={e.name} size={28} color={e.pct >= 80 ? C.teal : C.accent} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{e.name}</div>
              <div style={{ fontSize: 10, color: C.t3 }}>{e.dept}</div>
            </div>
            <div style={{ width: 110 }}>
              <ProgressBar pct={e.pct} color={e.pct >= 80 ? C.teal : C.accent} height={4} glow />
            </div>
            <div style={{ width: 34, textAlign: 'right', fontSize: 12, fontWeight: 700, color: C.t1 }}>{e.pct}%</div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
