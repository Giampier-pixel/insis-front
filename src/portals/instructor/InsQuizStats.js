'use client';
import { C } from '@/lib/palette';
import { QUIZ_QUESTIONS } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import StatCard from '@/components/ui/StatCard';
import Avatar from '@/components/ui/Avatar';

export default function InsQuizStats() {
  const attempts = [
    { student: 'Alejandro Ruiz', date: '2 May', score: 92, time: '8:34', passed: true },
    { student: 'Lucía Fernández', date: '3 May', score: 75, time: '11:20', passed: true },
    { student: 'Marco Delgado', date: '4 May', score: 58, time: '14:55', passed: false },
    { student: 'Daniela Cruz', date: '4 May', score: 100, time: '6:12', passed: true },
    { student: 'Andrés Torres', date: '5 May', score: 42, time: '13:01', passed: false },
  ];
  const avg = Math.round(attempts.reduce((a, x) => a + x.score, 0) / attempts.length);
  const passed = attempts.filter(x => x.passed).length;

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 12, color: C.t2 }}>Quiz: <span style={{ color: C.t1, fontWeight: 600 }}>Liderazgo de Equipos — Quiz Final</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Intentos" value={attempts.length} color={C.accent} />
        <StatCard label="Aprobados" value={passed} color={C.teal} />
        <StatCard label="Score prom." value={`${avg}%`} color={C.sky} />
        <StatCard label="Tiempo prom." value="10m 48s" color={C.amber} />
      </div>
      <GlassCard style={{ padding: '22px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 16 }}>Aciertos por pregunta</div>
        {QUIZ_QUESTIONS.map((q, i) => {
          const pct = [80, 60, 100, 40][i];
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ fontSize: 12, color: C.t2, flex: 1, paddingRight: 16 }}>P{i + 1}: {q.text.slice(0, 55)}…</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 70 ? C.teal : C.red, flexShrink: 0 }}>{pct}%</span>
              </div>
              <ProgressBar pct={pct} color={pct >= 70 ? C.teal : C.red} height={6} glow />
            </div>
          );
        })}
      </GlassCard>
      <GlassCard style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.b3}`, fontSize: 13, fontWeight: 600, color: C.t1 }}>Intentos recientes</div>
        {attempts.map((a, i) => (
          <div
            key={i}
            style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px 70px 90px', borderBottom: `1px solid ${C.b3}`, transition: 'background .15s', cursor: 'pointer' }}
            onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(140,183,155,0.06)'}
            onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
          >
            <div style={{ padding: '11px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={a.student} size={26} color={a.passed ? C.teal : C.red} />
              <span style={{ fontSize: 12, color: C.t1 }}>{a.student}</span>
            </div>
            <div style={{ padding: '11px 12px', fontSize: 11, color: C.t3, display: 'flex', alignItems: 'center' }}>{a.date}</div>
            <div style={{ padding: '11px 12px', fontSize: 13, fontWeight: 800, color: a.passed ? C.teal : C.red, display: 'flex', alignItems: 'center' }}>{a.score}%</div>
            <div style={{ padding: '11px 12px', fontSize: 11, color: C.t3, display: 'flex', alignItems: 'center', fontFamily: 'DM Mono, monospace' }}>{a.time}</div>
            <div style={{ padding: '11px 12px', display: 'flex', alignItems: 'center' }}>
              <Badge label={a.passed ? 'Aprobado' : 'Reprobado'} color={a.passed ? C.teal : C.red} />
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
