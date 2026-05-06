'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

export default function Assignments() {
  const { data, loading, refetch } = useApi('/assignments/');
  const { data: courses } = useApi('/courses/');
  const assignments = data?.results || data || [];
  const courseList = courses?.results || courses || [];
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', course: '', scope: 'COMPANY', deadline: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.title || !form.course) { setError('Título y curso son requeridos.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/assignments/', form);
      setShowModal(false); setForm({ title: '', course: '', scope: 'COMPANY', deadline: '' }); refetch();
    } catch (e) { setError(e?.response?.data?.detail || 'Error al crear asignación.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: C.t3 }}><span style={{ fontWeight: 600, color: C.t1 }}>{assignments.length}</span> asignaciones</div>
        <Button onClick={() => setShowModal(true)}>+ Nueva asignación</Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : assignments.length === 0 ? (
        <EmptyState title="Sin asignaciones" message="Crea tu primera asignación de cursos para empleados." action={<Button onClick={() => setShowModal(true)}>+ Nueva asignación</Button>} />
      ) : assignments.map(a => (
        <div key={a.id} style={{ background: '#fff', border: `1px solid ${a.status === 'OVERDUE' ? '#FECACA' : '#E2E8F0'}`, borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{a.title}</div>
                <Badge label={a.status === 'OVERDUE' ? 'Vencido' : 'Activo'} variant={a.status === 'OVERDUE' ? 'danger' : 'success'} />
              </div>
              <div style={{ fontSize: 12, color: C.t3 }}>{a.course_title || a.course} · Alcance: {a.scope}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 2 }}>Fecha límite</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.status === 'OVERDUE' ? C.danger : C.t1 }}>{a.deadline || '—'}</div>
            </div>
          </div>
          <ProgressBar pct={a.completion_pct || 0} color={a.completion_pct >= 70 ? C.success : a.completion_pct >= 40 ? C.warning : C.danger} showLabel />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: C.t3 }}>{a.completed_targets || 0} / {a.total_targets || 0} completaron</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="ghost" size="sm">Ver detalle</Button>
              <Button variant="ghost" size="sm">Asignar departamento</Button>
            </div>
          </div>
        </div>
      ))}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva asignación">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Inducción Q3 2025" required />
          <Select label="Curso" value={form.course} onChange={v => setForm({ ...form, course: v })} options={[{ value: '', label: 'Seleccionar curso…' }, ...courseList.map(c => ({ value: c.id, label: c.title }))]} />
          <Select label="Alcance" value={form.scope} onChange={v => setForm({ ...form, scope: v })} options={[{ value: 'COMPANY', label: 'Toda la empresa' }, { value: 'DEPARTMENT', label: 'Departamento' }, { value: 'INDIVIDUAL', label: 'Individual' }]} />
          <Input label="Fecha límite" value={form.deadline} onChange={v => setForm({ ...form, deadline: v })} type="date" />
          {error && <div style={{ fontSize: 12, color: C.danger, background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
