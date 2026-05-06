'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import { COURSES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Btn from '@/components/ui/Btn';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';
import LessonEditor from './LessonEditor';

export default function InsCourses({ onNav }) {
  const [courses, setCourses] = useState(COURSES.slice(0, 4));
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Management', level: 'Intermedio', duration: '' });

  const save = () => {
    if (!form.title) return;
    if (editCourse) {
      setCourses(courses.map(c => c.id === editCourse.id ? { ...c, ...form } : c));
    } else {
      setCourses([...courses, { ...form, id: Date.now(), enrolled: 0, rating: 0, progress: 0, lessons: 0, published: false, instructor: 'Carlos Mendoza' }]);
    }
    setShowModal(false);
    setEditCourse(null);
    setForm({ title: '', category: 'Management', level: 'Intermedio', duration: '' });
  };

  if (selectedCourse) return <LessonEditor course={selectedCourse} onBack={() => setSelectedCourse(null)} />;

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: C.t3 }}>{courses.length} cursos</div>
        <Btn onClick={() => { setEditCourse(null); setForm({ title: '', category: 'Management', level: 'Intermedio', duration: '' }); setShowModal(true); }}>+ Nuevo curso</Btn>
      </div>
      {courses.map(c => (
        <GlassCard key={c.id} className="glass card-hover" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.published ? C.teal : C.amber, flexShrink: 0, boxShadow: `0 0 8px ${c.published ? C.teal : C.amber}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 3 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>{c.category} · {c.level} · {c.lessons} lecciones · {c.enrolled.toLocaleString()} inscritos</div>
          </div>
          <Badge label={c.published ? 'Publicado' : 'Borrador'} color={c.published ? C.teal : C.amber} />
          <div style={{ display: 'flex', gap: 6 }}>
            <Btn variant="ghost" style={{ fontSize: 11, padding: '5px 11px' }} onClick={() => setSelectedCourse(c)}>Lecciones</Btn>
            <Btn variant="ghost" style={{ fontSize: 11, padding: '5px 11px' }} onClick={() => { setEditCourse(c); setForm({ title: c.title, category: c.category, level: c.level, duration: c.duration }); setShowModal(true); }}>Editar</Btn>
            <Btn variant="danger" style={{ fontSize: 11, padding: '5px 11px' }} onClick={() => setCourses(courses.filter(x => x.id !== c.id))}>×</Btn>
          </div>
        </GlassCard>
      ))}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditCourse(null); }} title={editCourse ? 'Editar curso' : 'Nuevo curso'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Nombre del curso" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SelectField label="Categoría" value={form.category} onChange={v => setForm({ ...form, category: v })} options={['Management', 'Herramientas', 'Habilidades', 'Compliance', 'Análisis']} />
            <SelectField label="Nivel" value={form.level} onChange={v => setForm({ ...form, level: v })} options={['Básico', 'Intermedio', 'Avanzado']} />
          </div>
          <Input label="Duración" value={form.duration} onChange={v => setForm({ ...form, duration: v })} placeholder="5h 30m" />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => { setShowModal(false); setEditCourse(null); }}>Cancelar</Btn>
            <Btn onClick={save}>{editCourse ? 'Guardar' : 'Crear'}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
