'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import ProgressBar from '@/components/ui/ProgressBar';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

export default function Employees() {
  const { data: employeesData, loading, refetch } = useApi('/employees/');
  const employees = employeesData?.results || employeesData || [];

  // Derive company ID from employee list (HR can't call GET /companies/)
  const companyId = employees.length > 0 ? employees[0].company : null;
  const { data: deptsData } = useApi(companyId ? `/companies/${companyId}/departments/` : null);
  const departments = deptsData?.results || deptsData || [];

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', department: '', is_hr_manager: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = employees.filter(e =>
    (e.user?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.user?.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const save = async () => {
    if (!form.full_name || !form.email) { setError('Nombre y email son requeridos.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        is_hr_manager: form.is_hr_manager,
        ...(form.department ? { department: parseInt(form.department) } : {}),
      };
      await api.post('/employees/', payload);
      setShowModal(false);
      setForm({ full_name: '', email: '', department: '', is_hr_manager: false });
      refetch();
    } catch (e) {
      const data = e?.response?.data;
      setError(typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Error al crear empleado.');
    } finally { setSaving(false); }
  };

  const statusBadge = (pct = 0) => {
    if (pct >= 80) return { label: 'Al día',    variant: 'success' };
    if (pct >= 40) return { label: 'En riesgo', variant: 'warning' };
    return          { label: 'Crítico',          variant: 'danger' };
  };

  const deptOptions = [
    { value: '', label: 'Sin departamento' },
    ...departments.map(d => ({ value: String(d.id), label: d.name })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
          <span style={{ color: C.t3 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email…"
            style={{ flex: 1, border: 'none', fontSize: 13, color: C.t1, background: 'none', outline: 'none' }} />
        </div>
        <Button onClick={() => { setError(''); setShowModal(true); }}>+ Nuevo empleado</Button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 160px 100px' }}>
          {['Empleado', 'Departamento', 'Cargo', 'Progreso', 'Estado'].map(h => (
            <div key={h} style={{ padding: '11px 16px', fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9' }}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="Sin empleados" message="Agrega el primer empleado." />
        ) : filtered.map(e => {
          const pct = e.completion_pct || 0;
          const badge = statusBadge(pct);
          return (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 160px 100px', borderBottom: '1px solid #F1F5F9', transition: 'background .12s' }}
              onMouseEnter={ev => ev.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={ev => ev.currentTarget.style.background = '#fff'}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={e.user?.full_name || e.user?.email || '?'} size={30} color={C.accent} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{e.user?.full_name}</div>
                  <div style={{ fontSize: 11, color: C.t3 }}>{e.user?.email}</div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', fontSize: 13, color: C.t2, display: 'flex', alignItems: 'center' }}>{e.department?.name || '—'}</div>
              <div style={{ padding: '12px 16px', fontSize: 13, color: C.t2, display: 'flex', alignItems: 'center' }}>{e.job_title || '—'}</div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <ProgressBar pct={pct} color={pct >= 80 ? C.success : pct >= 40 ? C.warning : C.danger} showLabel />
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <Badge label={badge.label} variant={badge.variant} />
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo empleado">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre completo" value={form.full_name} onChange={v => setForm({ ...form, full_name: v })} placeholder="Ana García" required />
          <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="ana@empresa.com" required />
          {departments.length > 0 && (
            <Select label="Departamento" value={form.department} onChange={v => setForm({ ...form, department: v })}
              options={deptOptions} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="is_hr" checked={form.is_hr_manager}
              onChange={e => setForm({ ...form, is_hr_manager: e.target.checked })} />
            <label htmlFor="is_hr" style={{ fontSize: 13, color: C.t2, cursor: 'pointer' }}>Es HR Manager</label>
          </div>
          {error && <div style={{ fontSize: 12, color: C.danger, background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Crear empleado'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
