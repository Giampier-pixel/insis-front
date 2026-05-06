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
import LessonEditor from './LessonEditor';
import api from '@/lib/api';

export default function InsCourses() {
  const { data, loading, refetch } = useApi('/courses/?instructor=me');
  const courses = data?.results || data || [];
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', level: 'INTERMEDIATE', duration: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editCourse) await api.patch(`/courses/${editCourse.id}/`, form);
      else await api.post('/courses/', form);
      setShowModal(false); setEditCourse(null); setForm({ title: '', category: '', level: 'INTERMEDIATE', duration: '' }); refetch();
    } catch (e) { alert(e?.response?.data?.detail || 'Error al guardar.'); }
    finally { setSaving(false); }
  };

  const deleteCourse = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return;
    try { await api.delete(`/courses/${id}/`); refetch(); } catch { alert('Error al eliminar.'); }
  };

  if (selectedCourse) return <LessonEditor course={selectedCourse} onBack={() => setSelectedCourse(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: C.t3 }}><span style={{ fontWeight: 600, color: C.t1 }}>{courses.length}</span> cursos</div>
        <Button onClick={() => { setEditCourse(null); setForm({ title: '', category: '', level: 'INTERMEDIATE', duration: '' }); setShowModal(true); }}>+ Nuevo curso</Button>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
        : courses.length === 0 ? <EmptyState title="Sin cursos" message="Crea tu primer curso." action={<Button onClick={() => setShowModal(true)}>+ Nuevo curso</Button>} />
        : courses.map(c => (
          <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.is_published ? C.success : C.warning, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: C.t3 }}>{c.level} · {c.lesson_count || 0} lecciones · {(c.enrolled_count || 0).toLocaleString()} inscritos</div>
            </div>
            <Badge label={c.is_published ? 'Publicado' : 'Borrador'} variant={c.is_published ? 'success' : 'warning'} />
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(c)}>Lecciones</Button>
              <Button variant="ghost" size="sm" onClick={() => { setEditCourse(c); setForm({ title: c.title, category: c.category?.id || '', level: c.level, duration: c.duration || '' }); setShowModal(true); }}>Editar</Button>
              <Button variant="danger" size="sm" onClick={() => deleteCourse(c.id)}>×</Button>
            </div>
          </div>
        ))}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditCourse(null); }} title={editCourse ? 'Editar curso' : 'Nuevo curso'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Nombre del curso" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Select label="Nivel" value={form.level} onChange={v => setForm({ ...form, level: v })} options={[{ value: 'BEGINNER', label: 'Básico' }, { value: 'INTERMEDIATE', label: 'Intermedio' }, { value: 'ADVANCED', label: 'Avanzado' }]} />
            <Input label="Duración" value={form.duration} onChange={v => setForm({ ...form, duration: v })} placeholder="5h 30m" />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="ghost" onClick={() => { setShowModal(false); setEditCourse(null); }}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : editCourse ? 'Guardar' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
