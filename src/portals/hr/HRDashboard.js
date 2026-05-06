'use client';
import { C } from '@/lib/palette';
import { DEPT_DATA } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import StatCard from '@/components/ui/StatCard';
import Avatar from '@/components/ui/Avatar';

export default function HRDashboard() {
  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Empleados" value="142" color={C.accent} />
        <StatCard label="Asignaciones" value="18" color={C.sky} />
        <StatCard label="Completación" value="68%" color={C.teal} />
        <StatCard label="Vencidos" value="6" color={C.red} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <GlassCard style={{ padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 18 }}>Por departamento</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEPT_DATA.map(d => (
              <div key={d.dept} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 80, fontSize: 11, color: C.t2, textAlign: 'right', flexShrink: 0 }}>{d.dept}</div>
                <div style={{ flex: 1 }}>
                  <ProgressBar pct={d.pct} color={d.pct >= 80 ? C.teal : d.pct >= 50 ? C.accent : C.red} height={6} glow />
                </div>
                <div style={{ width: 32, fontSize: 11, fontWeight: 700, color: C.t1, flexShrink: 0 }}>{d.pct}%</div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard style={{ padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 16 }}>Vencimientos <Badge label="6" color={C.red} /></div>
          {[{ name: 'Marco Delgado', course: 'Seguridad Industrial', days: 5 }, { name: 'Andrés Torres', course: 'Compliance 2024', days: 2 }, { name: 'Héctor Ramírez', course: 'Liderazgo Básico', days: 0 }].map(a => (
            <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.b3}` }}>
              <Avatar name={a.name} size={28} color={C.red} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{a.name}</div>
                <div style={{ fontSize: 10, color: C.t3 }}>{a.course}</div>
              </div>
              <Badge label={a.days === 0 ? 'Vencido' : `${a.days}d`} color={C.red} />
            </div>
          ))}
        </GlassCard>
      </div>
      <GlassCard style={{ padding: '20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 16 }}>Actividad semanal</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
          {[{ d: 'L', h: 3.2 }, { d: 'M', h: 5.1 }, { d: 'X', h: 4.7 }, { d: 'J', h: 6.3 }, { d: 'V', h: 3.9 }, { d: 'S', h: 1.2 }, { d: 'D', h: .4 }].map((day, i) => (
            <div key={day.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 9, color: i === 3 ? C.accent : C.t3, fontWeight: 600 }}>{day.h}h</div>
              <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${day.h / 6.3 * 62}px`, background: i === 3 ? `linear-gradient(to top, ${C.accent}, ${C.accent}80)` : C.b3, transition: 'height .5s ease', boxShadow: i === 3 ? `0 0 12px ${C.accent}50` : '' }} />
              <div style={{ fontSize: 10, color: C.t3 }}>{day.d}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
