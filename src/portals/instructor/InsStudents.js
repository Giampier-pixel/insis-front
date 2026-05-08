'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function InsStudents() {
  const [courseFilter, setCourseFilter] = useState('');
  const { data: coursesData } = useApi('/courses/');
  const courses = coursesData?.results || coursesData || [];

  const url = courseFilter
    ? `/instructor/students/?course=${courseFilter}`
    : '/instructor/students/';
  const { data, loading } = useApi(url);
  const students = data?.results || data || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: C.t2, fontWeight: 600 }}>Filtrar por curso:</div>
        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: C.t1, background: '#fff' }}
        >
          <option value="">Todos los cursos</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: 13, color: C.t3 }}>
        <span style={{ fontWeight: 600, color: C.t1 }}>{students.length}</span> estudiante{students.length !== 1 ? 's' : ''}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : students.length === 0 ? (
        <EmptyState title="Sin estudiantes" message="No hay estudiantes inscritos en tus cursos." />
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', borderBottom: '1px solid #F1F5F9' }}>
            {['Estudiante', 'Correo', 'Curso', 'Quizzes'].map(h => (
              <div key={h} style={{ padding: '11px 16px', fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {students.map((s, i) => (
            <div key={i}
              style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', borderBottom: i < students.length - 1 ? '1px solid #F1F5F9' : 'none', transition: 'background .12s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={s.student_name || s.student_email || '?'} size={30} color={C.accent} />
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{s.student_name || '—'}</div>
              </div>
              <div style={{ padding: '12px 16px', fontSize: 13, color: C.t2, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.student_email}</span>
              </div>
              <div style={{ padding: '12px 16px', fontSize: 12, color: C.t2, display: 'flex', alignItems: 'center' }}>
                {s.course_title}
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <Badge
                  label={`${s.quizzes_completed}/${s.total_quizzes}`}
                  variant={s.quizzes_completed >= s.total_quizzes && s.total_quizzes > 0 ? 'success' : s.quizzes_completed > 0 ? 'info' : 'default'}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
