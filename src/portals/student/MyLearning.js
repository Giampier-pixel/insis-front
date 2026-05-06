'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function MyLearning() {
  const [filter, setFilter] = useState('all');
  const { data, loading } = useApi('/enrollments/');
  const list = data?.results || data || [];
  const filtered = list.filter(e => {
    if (filter === 'progress') return e.progress_pct > 0 && e.progress_pct < 100;
    if (filter === 'done')     return e.progress_pct === 100;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[['all','Todos'], ['progress','En progreso'], ['done','Completados']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${filter === val ? C.accent : '#E2E8F0'}`, background: filter === val ? C.accentLight : '#fff', color: filter === val ? C.accent : C.t2, fontSize: 12, fontWeight: filter === val ? 600 : 400, cursor: 'pointer' }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Sin cursos" message="No tienes cursos en esta categoría." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(e => (
            <div key={e.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{e.course_title || e.course?.title}</div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{e.course?.instructor_name} · {e.course?.duration}</div>
                  </div>
                  <Badge label={e.progress_pct === 100 ? '✓ Completado' : `${e.progress_pct || 0}%`} variant={e.progress_pct === 100 ? 'success' : 'accent'} />
                </div>
                <ProgressBar pct={e.progress_pct || 0} color={e.progress_pct === 100 ? C.success : C.accent} showLabel />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
