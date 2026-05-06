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
  // Backend lookup is by slug, not id
  const slug = course.slug;
  const { data, loading, refetch } = useApi(`/courses/${slug}/lessons/`);
  const lessons = data?.results || data || [];
  const [showModal, setShowModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [form, setForm] = useState({ title: '', duration_minutes: '', video_url: '', is_published: true });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        duration_minutes: parseInt(form.duration_minutes) || 0,
        video_url: form.video_url || '',
        is_published: form.is_published,
      };
      if (editLesson) {
        await api.patch(`/courses/${slug}/lessons/${editLesson.id}/`, payload);
      } else {
        await api.post(`/courses/${slug}/lessons/`, payload);
      }
      setShowModal(false);
      setEditLesson(null);
      setForm({ title: '', duration_minutes: '', video_url: '', is_published: true });
      refetch();
    } catch (e) { alert(e?.response?.data?.detail || JSON.stringify(e?.response?.data) || 'Error al guardar.'); }
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

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div> : lessons.map((l, i) => (
        <div key={l.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: C.t3, fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{l.title}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>{l.duration_minutes ? `${l.duration_minutes} min` : '—'}{l.video_url ? ' · Video' : ''}</div>
          </div>
          <Badge label={l.is_published ? 'Publicada' : 'Borrador'} variant={l.is_published ? 'success' : 'warning'} />
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="ghost" size="sm" onClick={() => {
              setEditLesson(l);
              setForm({ title: l.title, duration_minutes: l.duration_minutes || '', video_url: l.video_url || '', is_published: l.is_published });
              setShowModal(true);
            }}>Editar</Button>
          </div>
        </div>
      ))}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditLesson(null); }} title={editLesson ? 'Editar lección' : 'Nueva lección'} width={380}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Nombre de la lección" required />
          <Input label="Duración (minutos)" value={form.duration_minutes} onChange={v => setForm({ ...form, duration_minutes: v })} placeholder="20" type="number" />
          <Input label="URL del video (opcional)" value={form.video_url} onChange={v => setForm({ ...form, video_url: v })} placeholder="https://youtube.com/..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            <label htmlFor="is_published" style={{ fontSize: 13, color: C.t2, cursor: 'pointer' }}>Publicar lección</label>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="ghost" onClick={() => { setShowModal(false); setEditLesson(null); }}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : editLesson ? 'Guardar' : 'Añadir'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
