'use client';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function StudentDashboard({ onNav }) {
  const { data: enrollments, loading } = useApi('/enrollments/');
  const list = enrollments?.results || enrollments || [];
  const inProgress = list.filter(e => e.progress_pct > 0 && e.progress_pct < 100).slice(0, 3);
  const completed  = list.filter(e => e.progress_pct === 100).length;
  const userName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome */}
      <div style={{ background: C.accent, borderRadius: 14, padding: '24px 28px', color: '#fff' }}>
        <div style={{ fontSize: 12, opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Bienvenido de vuelta</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{userName || 'Estudiante'}</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Cursos activos"    value={inProgress.length} color={C.accent} />
        <StatCard label="Completados"       value={completed}         color={C.success} />
        <StatCard label="Total inscritos"   value={list.length}       color={C.info} />
        <StatCard label="Certificados"      value={completed}         color={C.warning} />
      </div>

      {/* In progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Continuar aprendiendo</h2>
          <Button variant="ghost" size="sm" onClick={() => onNav('my-learning')}>Ver todos →</Button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
        ) : inProgress.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '28px', textAlign: 'center', color: C.t3, fontSize: 13 }}>
            No tienes cursos en progreso. <button onClick={() => onNav('catalog')} style={{ color: C.accent, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Explorar catálogo →</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inProgress.map(e => (
              <div key={e.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8 }}>{e.course_title || e.course?.title}</div>
                  <ProgressBar pct={e.progress_pct} color={C.accent} showLabel />
                </div>
                <Button variant="secondary" size="sm" onClick={() => onNav('my-learning')}>Continuar</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
