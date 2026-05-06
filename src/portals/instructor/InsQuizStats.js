'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function InsQuizStats() {
  const { data: coursesData, loading: cl } = useApi('/courses/?instructor=me');
  const courses = coursesData?.results || coursesData || [];
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const { data: stats, loading: sl } = useApi(selectedQuizId ? `/quizzes/${selectedQuizId}/stats/` : null);
  const { data: attempts, loading: al } = useApi(selectedQuizId ? `/quizzes/${selectedQuizId}/attempts/` : null);
  const attemptList = attempts?.results || attempts || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {cl ? <Spinner /> : courses.length === 0 ? (
        <EmptyState title="Sin cursos" message="Crea cursos y quizzes para ver estadísticas." />
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>Selecciona un quiz</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {courses.flatMap(c => (c.quizzes || [])).map(q => (
              <button key={q.id} onClick={() => setSelectedQuizId(q.id)}
                style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${selectedQuizId === q.id ? C.accent : '#E2E8F0'}`, background: selectedQuizId === q.id ? C.accentLight : '#fff', color: selectedQuizId === q.id ? C.accent : C.t2, fontSize: 12, cursor: 'pointer' }}>
                {q.title}
              </button>
            ))}
            {courses.flatMap(c => c.quizzes || []).length === 0 && <div style={{ fontSize: 13, color: C.t3 }}>No hay quizzes en tus cursos.</div>}
          </div>
        </div>
      )}

      {selectedQuizId && (
        <>
          {sl ? <Spinner /> : stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              <StatCard label="Intentos"    value={stats.total_attempts}  color={C.accent} />
              <StatCard label="Aprobados"   value={stats.passed}          color={C.success} />
              <StatCard label="Score prom." value={`${stats.avg_score || 0}%`} color={C.info} />
              <StatCard label="Tiempo prom." value={stats.avg_time || '—'} color={C.warning} />
            </div>
          )}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', fontSize: 13, fontWeight: 700, color: C.t1 }}>Intentos recientes</div>
            {al ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
              : attemptList.length === 0 ? <EmptyState title="Sin intentos" message="Nadie ha respondido este quiz aún." />
              : attemptList.slice(0, 10).map((a, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px 70px 100px', borderBottom: '1px solid #F1F5F9', transition: 'background .12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <div style={{ padding: '11px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={a.student_name || 'S'} size={26} color={a.passed ? C.success : C.danger} />
                    <span style={{ fontSize: 12, color: C.t1 }}>{a.student_name}</span>
                  </div>
                  <div style={{ padding: '11px 12px', fontSize: 11, color: C.t3, display: 'flex', alignItems: 'center' }}>{a.submitted_at?.slice(0, 10)}</div>
                  <div style={{ padding: '11px 12px', fontSize: 13, fontWeight: 800, color: a.passed ? C.success : C.danger, display: 'flex', alignItems: 'center' }}>{a.score}%</div>
                  <div style={{ padding: '11px 12px', fontSize: 11, color: C.t3, display: 'flex', alignItems: 'center', fontFamily: 'monospace' }}>{a.time_spent || '—'}</div>
                  <div style={{ padding: '11px 12px', display: 'flex', alignItems: 'center' }}>
                    <Badge label={a.passed ? 'Aprobado' : 'Reprobado'} variant={a.passed ? 'success' : 'danger'} />
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
