'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import api from '@/lib/api';

export default function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [enrolling, setEnrolling] = useState(null);
  const [msg, setMsg] = useState('');
  const { data, loading, refetch } = useApi('/courses/');
  const courses = data?.results || data || [];
  const { data: myEnrollments } = useApi('/enrollments/');
  const enrolledIds = new Set((myEnrollments?.results || myEnrollments || []).map(e => e.course?.id || e.course));

  const filtered = courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()));

  const enroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await api.post('/enrollments/', { course: courseId });
      setMsg('¡Inscripción exitosa!');
      refetch();
    } catch (e) {
      setMsg(e?.response?.data?.detail || 'Error al inscribirse.');
    } finally { setEnrolling(null); setTimeout(() => setMsg(''), 3000); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
          <span style={{ color: C.t3 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cursos…" style={{ flex: 1, border: 'none', fontSize: 13, color: C.t1, background: 'none', outline: 'none' }} />
        </div>
      </div>

      {msg && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.success }}>{msg}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map(c => {
            const isEnrolled = enrolledIds.has(c.id);
            return (
              <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ height: 80, background: `${C.accentLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: 28 }}>📚</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    <Badge label={c.category?.name || 'General'} variant="accent" />
                    {c.level && <Badge label={c.level} variant="default" />}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 4, lineHeight: 1.4 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: C.t3, marginBottom: 12 }}>{c.instructor_name || 'Instructor'} · {c.duration || '—'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: C.warning }}>★ {c.avg_rating?.toFixed(1) || '—'}</span>
                    {isEnrolled
                      ? <Badge label="✓ Inscrito" variant="success" />
                      : <Button size="sm" onClick={() => enroll(c.id)} disabled={enrolling === c.id}>{enrolling === c.id ? '…' : 'Inscribirse'}</Button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
