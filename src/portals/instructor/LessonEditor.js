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
import api from '@/lib/api';

const TYPE_COLOR = { VIDEO: C.accent, TEXT: C.info, QUIZ: C.warning };
const TYPE_LABEL = { VIDEO: '▶ Video', TEXT: 'T Lectura', QUIZ: 'Q Quiz' };

export default function LessonEditor({ course, onBack }) {
  const { data, loading, refetch } = useApi(`/courses/${course.id}/lessons/`);
  const lessons = data?.results || data || [];
  const [showModal, setShowModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [form, setForm] = useState({ title: '', lesson_type: 'VIDEO', duration: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editLesson) await api.patch(`/courses/${course.id}/lessons/`, { id: editLesson.id, ...form });
      else await api.post(`/courses/${course.id}/lessons/`, form);
      setShowModal(false); setEditLesson(null); setForm({ title: '', lesson_type: 'VIDEO', duration: '' }); refetch();
    } catch (e) { alert(e?.response?.data?.detail || 'Error al guardar.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" size="sm" onClick={onBack}>← Volver</Button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{course.title}</div>
          <div style={{ fontSize: 11, color: C.t3 }}>{lessons.length} lecciones</div>
        </div>
        <Button onClick={() => { setEditLesson(null); setForm({ title: '', lesson_type: 'VIDEO', duration: '' }); setShowModal(true); }}>+ Nueva lección</Button>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div> : lessons.map(l => (
        <div key={l.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: C.t3, cursor: 'grab' }}>⠿</span>
          <div style={{ width: 52, flexShrink: 0 }}>
            <Badge label={TYPE_LABEL[l.lesson_type] || l.lesson_type} style={{ background: `${TYPE_COLOR[l.lesson_type] || C.t3}15`, color: TYPE_COLOR[l.lesson_type] || C.t3 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{l.title}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>{l.duration || '—'}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="ghost" size="sm" onClick={() => { setEditLesson(l); setForm({ title: l.title, lesson_type: l.lesson_type, duration: l.duration || '' }); setShowModal(true); }}>Editar</Button>
          </div>
        </div>
      ))}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditLesson(null); }} title={editLesson ? 'Editar lección' : 'Nueva lección'} width={380}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Nombre de la lección" required />
          <Select label="Tipo" value={form.lesson_type} onChange={v => setForm({ ...form, lesson_type: v })} options={[{ value: 'VIDEO', label: 'Video' }, { value: 'TEXT', label: 'Lectura' }, { value: 'QUIZ', label: 'Quiz' }]} />
          <Input label="Duración" value={form.duration} onChange={v => setForm({ ...form, duration: v })} placeholder="20 min" />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="ghost" onClick={() => { setShowModal(false); setEditLesson(null); }}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : editLesson ? 'Guardar' : 'Añadir'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
