'use client';
import { C } from '@/lib/palette';
import { COURSES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import StatCard from '@/components/ui/StatCard';

export default function InsDashboard({ onNav }) {
  const myCourses = COURSES.filter(c => c.instructor === 'Carlos Mendoza');

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Mis cursos" value="2" color={C.accent} />
        <StatCard label="Estudiantes" value="3.820" color={C.sky} />
        <StatCard label="Rating" value="4.9 ★" color={C.amber} />
        <StatCard label="Reseñas" value="312" color={C.teal} />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Mis cursos</div>
          <button onClick={() => onNav('ins-courses')} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>Gestionar →</button>
        </div>
        {myCourses.map(c => (
          <GlassCard key={c.id} className="glass-light card-hover" style={{ padding: '14px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: C.t3 }}>{c.lessons} lecciones · {c.enrolled.toLocaleString()} inscritos</div>
            </div>
            <Badge label={c.published ? 'Publicado' : 'Borrador'} color={c.published ? C.teal : C.amber} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>★ {c.rating}</span>
          </GlassCard>
        ))}
      </div>
      <GlassCard style={{ padding: '20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 16 }}>Rendimiento de quizzes</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[{ label: 'Aprobados', val: 24, pct: 80, color: C.teal }, { label: 'Reprobados', val: 6, pct: 20, color: C.red }, { label: 'Score prom.', val: '78%', pct: 78, color: C.accent }].map(s => (
            <GlassCard key={s.label} className="glass-light" style={{ flex: 1, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: C.t3, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginBottom: 10, letterSpacing: '-0.02em' }}>{s.val}</div>
              <ProgressBar pct={s.pct} color={s.color} height={3} glow />
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
