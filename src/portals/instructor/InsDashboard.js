'use client';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function InsDashboard({ onNav }) {
  const { data, loading } = useApi('/courses/?instructor=me');
  const courses = data?.results || data || [];
  const published = courses.filter(c => c.is_published);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatCard label="Mis cursos"    value={courses.length}  color={C.accent} />
        <StatCard label="Publicados"    value={published.length} color={C.success} />
        <StatCard label="Estudiantes"   value={courses.reduce((a, c) => a + (c.enrolled_count || 0), 0).toLocaleString()} color={C.info} />
        <StatCard label="Rating prom."  value={courses.length ? (courses.reduce((a, c) => a + (c.avg_rating || 0), 0) / courses.length).toFixed(1) + ' ★' : '—'} color={C.warning} />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Mis cursos</h2>
          <Button variant="ghost" size="sm" onClick={() => onNav('ins-courses')}>Gestionar →</Button>
        </div>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div> : courses.slice(0, 5).map(c => (
          <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 3 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: C.t3 }}>{c.lesson_count || 0} lecciones · {(c.enrolled_count || 0).toLocaleString()} inscritos</div>
            </div>
            <Badge label={c.is_published ? 'Publicado' : 'Borrador'} variant={c.is_published ? 'success' : 'warning'} />
            <span style={{ fontSize: 12, color: C.warning, fontWeight: 600 }}>★ {c.avg_rating?.toFixed(1) || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
