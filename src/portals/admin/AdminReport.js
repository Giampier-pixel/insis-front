'use client';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import StatCard from '@/components/ui/StatCard';
import Spinner from '@/components/ui/Spinner';

export default function AdminReport() {
  const { data, loading } = useApi('/auth/admin/report/');

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>;

  const d = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <StatCard label="Estudiantes registrados" value={d.total_students ?? '—'} color={C.accent} />
        <StatCard label="Cursos activos"           value={d.total_courses  ?? '—'} color={C.info} />
        <StatCard label="Certificados emitidos"    value={d.total_certificates ?? '—'} color={C.success} />
      </div>

      {/* Recent completions */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 12 }}>Últimas completaciones</div>
        {!d.recent_completions?.length ? (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24, textAlign: 'center', fontSize: 13, color: C.t3 }}>
            Aún no hay completaciones registradas.
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', borderBottom: '1px solid #F1F5F9' }}>
              {['Estudiante', 'Curso', 'Fecha'].map(h => (
                <div key={h} style={{ padding: '11px 16px', fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {d.recent_completions.map((r, i) => (
              <div key={i}
                style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', borderBottom: i < d.recent_completions.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{r.student_name || '—'}</div>
                  <div style={{ fontSize: 11, color: C.t3 }}>{r.student_email}</div>
                </div>
                <div style={{ padding: '12px 16px', fontSize: 13, color: C.t2, display: 'flex', alignItems: 'center' }}>{r.course_title}</div>
                <div style={{ padding: '12px 16px', fontSize: 12, color: C.t3, display: 'flex', alignItems: 'center' }}>
                  {r.completed_at ? new Date(r.completed_at).toLocaleDateString('es-PE') : '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
