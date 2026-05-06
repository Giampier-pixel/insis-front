'use client';
import { useState, useEffect } from 'react';
import { C } from '@/lib/palette';
import { COURSES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import StatCard from '@/components/ui/StatCard';

export default function StudentDashboard({ onNav }) {
  const inProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(72), 400);
    return () => clearTimeout(t);
  }, []);

  const circumference = 2 * Math.PI * 28;

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Welcome hero */}
      <GlassCard style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'absolute', top: -20, right: 80, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${C.g2}60, transparent)`, filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Bienvenido de vuelta</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.t1, letterSpacing: '-0.025em', marginBottom: 6 }}>Alejandro Ruiz</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.t2 }}>
            <span><span style={{ color: C.accent, fontWeight: 600 }}>3</span> en progreso</span>
            <span style={{ color: C.t3 }}>·</span>
            <span>Racha <span style={{ color: C.teal, fontWeight: 600 }}>12 días</span></span>
          </div>
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: C.t3, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Semanal</div>
          <div style={{ position: 'relative', width: 72, height: 72 }}>
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(5,31,32,0.6)" strokeWidth="6" />
              <circle cx="36" cy="36" r="28" fill="none" stroke={C.accent} strokeWidth="6"
                strokeDasharray={`${circumference * animPct / 100} ${circumference}`}
                strokeLinecap="round" style={{ transition: 'stroke-dasharray .9s ease', filter: `drop-shadow(0 0 6px ${C.accent})` }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: C.t1 }}>{animPct}%</div>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Activos" value="3" color={C.accent} />
        <StatCard label="Completados" value="5" color={C.teal} />
        <StatCard label="Horas" value="24h" color={C.sky} />
        <StatCard label="Quizzes" value="12" color={C.amber} />
      </div>

      {/* In progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>En progreso</div>
          <button onClick={() => onNav('my-learning')} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>Ver todos →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {inProgress.map(c => (
            <GlassCard key={c.id} className="glass-light card-hover" hoverable onClick={() => onNav('my-learning')} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 6 }}>{c.title}</div>
                <ProgressBar pct={c.progress} color={C.accent} height={3} glow />
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{c.progress}%</div>
                <Badge label={c.category} size="sm" color={C.t2} />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Quiz scores */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>Últimos quizzes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[{ name: 'Liderazgo I', score: 92, color: C.accent }, { name: 'Excel Básico', score: 100, color: C.teal }, { name: 'Comunicación', score: 74, color: C.amber }].map(q => (
            <GlassCard key={q.name} className="glass-light" style={{ padding: '16px' }}>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 8 }}>{q.name}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: q.color, letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1 }}>{q.score}<span style={{ fontSize: 13, color: C.t3 }}>%</span></div>
              <ProgressBar pct={q.score} color={q.color} height={3} glow />
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
