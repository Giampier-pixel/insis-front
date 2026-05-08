'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

export default function AdminCourses() {
  const { data, loading, refetch }        = useApi('/courses/');
  const { data: usersData }               = useApi('/auth/users/');
  const courses   = data?.results   || data   || [];
  const allUsers  = usersData?.results || usersData || [];
  const instructors = allUsers.filter(u => u.role === 'INSTRUCTOR');

  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', instructor: '', is_published: false });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditCourse(null);
    setForm({ title: '', description: '', instructor: instructors[0]?.id || '', is_published: false });
    setError('');
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditCourse(c);
    setForm({ title: c.title, description: c.description || '', instructor: c.instructor?.id || '', is_published: c.is_published });
    setError('');
    setShowModal(true);
  };

  const save = async () => {
    if (!form.title) { setError('El título es requerido.'); return; }
    if (!form.instructor) { setError('Asigna un instructor.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { title: form.title, description: form.description, instructor: parseInt(form.instructor), is_published: form.is_published };
      if (editCourse) {
        await api.patch(`/courses/${editCourse.slug}/`, payload);
      } else {
        await api.post('/courses/', payload);
      }
      setShowModal(false);
      refetch();
    } catch (e) {
      const d = e?.response?.data;
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Error al guardar.');
    } finally { setSaving(false); }
  };

  const deleteCourse = async (slug) => {
    if (!confirm('¿Eliminar este curso? Se eliminarán también sus quizzes.')) return;
    try { await api.delete(`/courses/${slug}/`); refetch(); } catch { alert('Error al eliminar.'); }
  };

  const instructorOptions = instructors.map(u => ({ value: String(u.id), label: u.full_name || u.email }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
          <span style={{ color: C.t3 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título o instructor…"
            style={{ flex: 1, border: 'none', fontSize: 13, color: C.t1, background: 'none', outline: 'none' }} />
        </div>
        <Button onClick={openCreate}>+ Nuevo Curso</Button>
      </div>

      <div style={{ fontSize: 13, color: C.t3 }}>
        <span style={{ fontWeight: 600, color: C.t1 }}>{filtered.length}</span> curso{filtered.length !== 1 ? 's' : ''}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Sin cursos" message="Crea el primer curso." action={<Button onClick={openCreate}>+ Nuevo Curso</Button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, lineHeight: 1.4, flex: 1 }}>{c.title}</div>
                <Badge label={c.is_published ? 'Publicado' : 'Borrador'} variant={c.is_published ? 'success' : 'warning'} />
              </div>
              {c.description && (
                <div style={{ fontSize: 12, color: C.t3, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {c.description}
                </div>
              )}
              <div style={{ fontSize: 12, color: C.t3 }}>
                Instructor: <span style={{ fontWeight: 600, color: C.t2 }}>{c.instructor?.full_name || '—'}</span>
              </div>
              <div style={{ fontSize: 12, color: C.t3 }}>
                {c.quiz_count || 0} quizzes · {c.enrolled_count || 0} inscritos
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => deleteCourse(c.slug)}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editCourse ? 'Editar curso' : 'Nuevo curso'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título *" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Nombre del curso" />
          <Input label="Descripción" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Descripción del curso" />
          {instructorOptions.length > 0 ? (
            <Select label="Instructor *" value={String(form.instructor)} onChange={v => setForm(f => ({ ...f, instructor: v }))} options={instructorOptions} />
          ) : (
            <div style={{ fontSize: 12, color: C.warning, background: '#FFFBEB', padding: '10px 12px', borderRadius: 8 }}>
              No hay instructores disponibles. Crea un instructor primero en Gestión de Usuarios.
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: C.accent }} />
            <label style={{ fontSize: 13, color: C.t2 }}>Publicar curso (visible para estudiantes)</label>
          </div>
          {error && <div style={{ fontSize: 12, color: C.danger, background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : editCourse ? 'Guardar' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
