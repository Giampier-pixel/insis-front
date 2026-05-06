'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import { ASSIGNMENTS, COURSES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Btn from '@/components/ui/Btn';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';

export default function HRAssignments() {
  const [assignments, setAssignments] = useState(ASSIGNMENTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', course: COURSES[0].title, dept: 'Todos', deadline: '' });

  const add = () => {
    if (!form.title) return;
    setAssignments([...assignments, { ...form, id: Date.now(), targets: 0, done: 0, pct: 0, status: 'active' }]);
    setShowModal(false);
    setForm({ title: '', course: COURSES[0].title, dept: 'Todos', deadline: '' });
  };

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: C.t3 }}>{assignments.length} asignaciones</div>
        <Btn onClick={() => setShowModal(true)}>+ Nueva</Btn>
      </div>
      {assignments.map(a => (
        <GlassCard key={a.id} className="glass card-hover" style={{ padding: '20px 22px', border: `1px solid ${a.status === 'overdue' ? C.red + '40' : C.b1}`, boxShadow: a.status === 'overdue' ? `0 0 20px ${C.red}15` : '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{a.title}</div>
                <Badge label={a.status === 'overdue' ? 'Vencido' : 'Activo'} color={a.status === 'overdue' ? C.red : C.teal} />
              </div>
              <div style={{ fontSize: 11, color: C.t3 }}>{a.course} · {a.dept}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: C.t3, marginBottom: 2 }}>Fecha límite</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.status === 'overdue' ? C.red : C.t1 }}>{a.deadline}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <ProgressBar pct={a.pct} color={a.pct >= 70 ? C.teal : a.pct >= 40 ? C.accent : C.red} height={6} glow />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, flexShrink: 0 }}>{a.pct}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: C.t3 }}>{a.done} / {a.targets} completaron</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn variant="ghost" style={{ fontSize: 11, padding: '5px 11px' }}>Detalle</Btn>
              <Btn variant="ghost" style={{ fontSize: 11, padding: '5px 11px' }}>Asignar dpto.</Btn>
            </div>
          </div>
        </GlassCard>
      ))}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva asignación">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Inducción Q3 2025" />
          <SelectField label="Curso" value={form.course} onChange={v => setForm({ ...form, course: v })} options={COURSES.map(c => ({ value: c.title, label: c.title }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SelectField label="Departamento" value={form.dept} onChange={v => setForm({ ...form, dept: v })} options={['Todos', 'Operaciones', 'Ventas', 'RR.HH.', 'Finanzas', 'TI', 'Legal']} />
            <Input label="Fecha límite" value={form.deadline} onChange={v => setForm({ ...form, deadline: v })} placeholder="31 Jul 2025" />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={add}>Crear</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
