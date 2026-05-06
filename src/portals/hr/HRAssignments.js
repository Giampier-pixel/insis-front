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
  const { data: coursesData } = useApi('/courses/');
  const { data: companiesData } = useApi('/companies/');

  const assignments = data?.results || data || [];
  const courseList = coursesData?.results || coursesData || [];
  const company = (companiesData?.results || companiesData || [])[0]; // HR's company

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', course: '', scope: 'COMPANY', due_date: '', is_mandatory: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.course) { setError('Selecciona un curso.'); return; }
    if (!company) { setError('No se encontró tu empresa. Contacta al administrador.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/assignments/', {
        course: parseInt(form.course),
        company: company.id,
        scope: form.scope,
        due_date: form.due_date || null,
        is_mandatory: form.is_mandatory,
      });
      setShowModal(false);
      setForm({ title: '', course: '', scope: 'COMPANY', due_date: '', is_mandatory: false });
      refetch();
    } catch (e) {
      const d = e?.response?.data;
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Error al crear asignación.');
    } finally { setSaving(false); }
  };

  const courseOptions = [
    { value: '', label: 'Seleccionar curso…' },
    ...courseList.map(c => ({ value: String(c.id), label: c.title })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: C.t3 }}>
          <span style={{ fontWeight: 600, color: C.t1 }}>{assignments.length}</span> asignaciones
          {company && <span style={{ marginLeft: 8, color: C.t3 }}>· {company.name}</span>}
        </div>
        <Button onClick={() => { setError(''); setShowModal(true); }}>+ Nueva asignación</Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : assignments.length === 0 ? (
        <EmptyState title="Sin asignaciones" message="Crea tu primera asignación de cursos para empleados."
          action={<Button onClick={() => setShowModal(true)}>+ Nueva asignación</Button>} />
      ) : assignments.map(a => (
        <div key={a.id} style={{ background: '#fff', border: `1px solid ${a.is_overdue ? '#FECACA' : '#E2E8F0'}`, borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{a.course_title || a.course}</div>
                <Badge label={a.is_overdue ? 'Vencido' : 'Activo'} variant={a.is_overdue ? 'danger' : 'success'} />
                {a.is_mandatory && <Badge label="Obligatorio" variant="warning" />}
              </div>
              <div style={{ fontSize: 12, color: C.t3 }}>Alcance: {a.scope} · {a.company_name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 2 }}>Fecha límite</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.is_overdue ? C.danger : C.t1 }}>{a.due_date || '—'}</div>
            </div>
          </div>
          <ProgressBar pct={a.completion_pct || 0}
            color={a.completion_pct >= 70 ? C.success : a.completion_pct >= 40 ? C.warning : C.danger} showLabel />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: C.t3 }}>{a.completed_targets || 0} / {a.total_targets || 0} completaron</div>
            <Button variant="ghost" size="sm">Ver detalle</Button>
          </div>
        </div>
      ))}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva asignación">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select label="Curso *" value={form.course} onChange={v => setForm({ ...form, course: v })} options={courseOptions} />
          <Select label="Alcance" value={form.scope} onChange={v => setForm({ ...form, scope: v })}
            options={[
              { value: 'COMPANY',    label: 'Toda la empresa' },
              { value: 'DEPARTMENT', label: 'Departamento' },
              { value: 'INDIVIDUAL', label: 'Individual' },
            ]} />
          <Input label="Fecha límite" value={form.due_date} onChange={v => setForm({ ...form, due_date: v })} type="date" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="mandatory" checked={form.is_mandatory}
              onChange={e => setForm({ ...form, is_mandatory: e.target.checked })} />
            <label htmlFor="mandatory" style={{ fontSize: 13, color: C.t2, cursor: 'pointer' }}>Curso obligatorio</label>
          </div>
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
