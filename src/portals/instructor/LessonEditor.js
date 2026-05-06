'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import { LESSONS_BASE } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Btn from '@/components/ui/Btn';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';

export default function LessonEditor({ course, onBack }) {
  const [lessons, setLessons] = useState(LESSONS_BASE);
  const [showModal, setShowModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'video', duration: '' });

  const save = () => {
    if (!form.title) return;
    if (editLesson) {
      setLessons(lessons.map(l => l.id === editLesson.id ? { ...l, ...form } : l));
    } else {
      setLessons([...lessons, { ...form, id: Date.now(), order: lessons.length + 1, done: false }]);
    }
    setShowModal(false);
    setEditLesson(null);
    setForm({ title: '', type: 'video', duration: '' });
  };

  const typeColor = t => t === 'quiz' ? C.amber : t === 'text' ? C.teal : C.accent;
  const typeIcon = t => t === 'quiz' ? 'Q' : t === 'text' ? 'T' : '▶';

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans' }}>← Volver</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{course.title}</div>
          <div style={{ fontSize: 11, color: C.t3 }}>{lessons.length} lecciones</div>
        </div>
        <Btn onClick={() => { setEditLesson(null); setForm({ title: '', type: 'video', duration: '' }); setShowModal(true); }}>+ Nueva lección</Btn>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {lessons.map((l) => (
          <GlassCard key={l.id} className="glass-light card-hover" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: C.t3, fontSize: 10, cursor: 'grab', flexShrink: 0, lineHeight: 1.2 }}>⠿</div>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: typeColor(l.type) + '20', border: `1px solid ${typeColor(l.type)}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: typeColor(l.type), fontWeight: 800, flexShrink: 0 }}>
              {typeIcon(l.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{l.title}</div>
              <div style={{ fontSize: 10, color: C.t3 }}>{l.type === 'quiz' ? 'Quiz' : l.type === 'text' ? 'Lectura' : 'Video'} · {l.duration}</div>
            </div>
            {l.done && <Badge label="✓" color={C.teal} />}
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn variant="ghost" style={{ fontSize: 11, padding: '4px 9px' }} onClick={() => { setEditLesson(l); setForm({ title: l.title, type: l.type, duration: l.duration }); setShowModal(true); }}>Editar</Btn>
              <Btn variant="danger" style={{ fontSize: 11, padding: '4px 9px' }} onClick={() => setLessons(lessons.filter(x => x.id !== l.id))}>×</Btn>
            </div>
          </GlassCard>
        ))}
      </div>
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditLesson(null); }} title={editLesson ? 'Editar lección' : 'Nueva lección'} width={380}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Nombre de la lección" />
          <SelectField label="Tipo" value={form.type} onChange={v => setForm({ ...form, type: v })} options={[{ value: 'video', label: 'Video' }, { value: 'text', label: 'Lectura' }, { value: 'quiz', label: 'Quiz' }]} />
          <Input label="Duración" value={form.duration} onChange={v => setForm({ ...form, duration: v })} placeholder="20 min" />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => { setShowModal(false); setEditLesson(null); }}>Cancelar</Btn>
            <Btn onClick={save}>{editLesson ? 'Guardar' : 'Añadir'}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
