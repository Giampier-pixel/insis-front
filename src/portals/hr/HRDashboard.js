'use client';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import Spinner from '@/components/ui/Spinner';

export default function HRDashboard() {
  const { data: summary, loading: ls } = useApi('/reports/company-summary/');
  const { data: dept,    loading: ld } = useApi('/reports/completion-by-department/');
  const { data: overdue, loading: lo } = useApi('/reports/overdue-assignments/');

  const depts = dept?.results || dept || [];
  const overdueList = overdue?.results || overdue || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPIs */}
      {ls ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <StatCard label="Empleados"    value={summary?.total_employees ?? '—'}    color={C.accent} />
          <StatCard label="Asignaciones" value={summary?.total_assignments ?? '—'}  color={C.info} />
          <StatCard label="Completación" value={summary?.avg_completion ? `${summary.avg_completion}%` : '—'} color={C.success} />
          <StatCard label="Vencidos"     value={summary?.overdue_count ?? '—'}      color={C.danger} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Dept chart */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 18 }}>Completación por departamento</div>
          {ld ? <Spinner /> : depts.length === 0 ? <div style={{ color: C.t3, fontSize: 13 }}>Sin datos</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {depts.map(d => (
                <div key={d.department} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 90, fontSize: 11, color: C.t2, textAlign: 'right', flexShrink: 0 }}>{d.department}</div>
                  <div style={{ flex: 1 }}><ProgressBar pct={d.completion_pct} color={d.completion_pct >= 80 ? C.success : d.completion_pct >= 50 ? C.accent : C.danger} showLabel /></div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Overdue */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 16 }}>Vencimientos próximos</div>
          {lo ? <Spinner /> : overdueList.slice(0, 5).map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{a.employee_name || a.title}</div>
                <div style={{ fontSize: 10, color: C.t3 }}>{a.course_title || a.course}</div>
              </div>
              <span style={{ fontSize: 11, color: C.danger, fontWeight: 600 }}>{a.days_overdue ? `${a.days_overdue}d` : 'Vencido'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
