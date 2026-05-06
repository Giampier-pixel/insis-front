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
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

const ROLE_COLORS = {
  ADMIN:      { variant: 'danger',  label: 'Admin' },
  INSTRUCTOR: { variant: 'info',    label: 'Instructor' },
  HR_MANAGER: { variant: 'warning', label: 'HR Manager' },
  STUDENT:    { variant: 'success', label: 'Estudiante' },
  SUPPORT:    { variant: 'default', label: 'Soporte' },
};

export default function AdminUsers() {
  const { data, loading, refetch } = useApi('/employees/');
  const { data: companiesData } = useApi('/companies/');
  const employees = data?.results || data || [];
  const companies = companiesData?.results || companiesData || [];

  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'STUDENT', company: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const filtered = employees.filter(e =>
    (e.user?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.user?.role || '').toLowerCase().includes(search.toLowerCase())
  );

  const createUser = async () => {
    if (!form.full_name || !form.email || !form.password) {
      setError('Nombre, email y contraseña son requeridos.'); return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      // Step 1: Register user (creates as STUDENT by default)
      await api.post('/auth/register/', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });

      // Step 2: If company selected, create employee record
      if (form.company) {
        await api.post('/employees/', {
          full_name: form.full_name,
          email: form.email,
          is_hr_manager: form.role === 'HR_MANAGER',
          company: parseInt(form.company),
        });
      }

      setSuccess(`Usuario ${form.email} creado correctamente como ${ROLE_COLORS[form.role]?.label || form.role}.`);
      setForm({ full_name: '', email: '', password: '', role: 'STUDENT', company: '' });
      refetch();
      setTimeout(() => { setShowModal(false); setSuccess(''); }, 2000);
    } catch (e) {
      const d = e?.response?.data;
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Error al crear usuario.');
    } finally { setSaving(false); }
  };

  const companyOptions = [
    { value: '', label: 'Sin empresa asignada' },
    ...companies.map(c => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
          <span style={{ color: C.t3 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o rol…"
            style={{ flex: 1, border: 'none', fontSize: 13, color: C.t1, background: 'none', outline: 'none' }} />
        </div>
        <Button onClick={() => { setError(''); setSuccess(''); setShowModal(true); }}>+ Nuevo usuario</Button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
          {['Usuario', 'Rol', 'Empresa', 'Departamento'].map(h => (
            <div key={h} style={{ padding: '11px 16px', fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9' }}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="Sin usuarios" message="No hay usuarios que coincidan." />
        ) : filtered.map(e => {
          const role = e.user?.role || 'STUDENT';
          const rb = ROLE_COLORS[role] || ROLE_COLORS.STUDENT;
          return (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid #F1F5F9', transition: 'background .12s' }}
              onMouseEnter={ev => ev.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={ev => ev.currentTarget.style.background = '#fff'}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={e.user?.full_name || e.user?.email || '?'} size={30} color={C.accent} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{e.user?.full_name || '—'}</div>
                  <div style={{ fontSize: 11, color: C.t3 }}>{e.user?.email}</div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <Badge label={rb.label} variant={rb.variant} />
              </div>
              <div style={{ padding: '12px 16px', fontSize: 13, color: C.t2, display: 'flex', alignItems: 'center' }}>
                {e.company_name || '—'}
              </div>
              <div style={{ padding: '12px 16px', fontSize: 13, color: C.t2, display: 'flex', alignItems: 'center' }}>
                {e.department_name || '—'}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo usuario">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre completo *" value={form.full_name} onChange={v => setForm({ ...form, full_name: v })} placeholder="Ana García" required />
          <Input label="Email *" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="ana@empresa.com" required />
          <Input label="Contraseña *" value={form.password} onChange={v => setForm({ ...form, password: v })} type="password" placeholder="Mínimo 8 caracteres" required />
          <Select label="Rol" value={form.role} onChange={v => setForm({ ...form, role: v })}
            options={[
              { value: 'STUDENT',    label: 'Estudiante' },
              { value: 'INSTRUCTOR', label: 'Instructor' },
              { value: 'HR_MANAGER', label: 'HR Manager' },
              { value: 'ADMIN',      label: 'Admin' },
            ]} />
          {companies.length > 0 && (
            <Select label="Empresa (opcional)" value={form.company} onChange={v => setForm({ ...form, company: v })}
              options={companyOptions} />
          )}
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400E' }}>
            ⚠️ El usuario se crea como <strong>Estudiante</strong> en el sistema de autenticación. Para roles de Instructor, HR Manager o Admin, coordina con el equipo técnico.
          </div>
          {error   && <div style={{ fontSize: 12, color: C.danger,  background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}
          {success && <div style={{ fontSize: 12, color: C.success, background: '#ECFDF5', padding: '8px 12px', borderRadius: 6 }}>{success}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={createUser} disabled={saving}>{saving ? 'Creando…' : 'Crear usuario'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
