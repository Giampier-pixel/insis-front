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
import api from '@/lib/api';

export default function Employees() {
  const { data, loading, refetch } = useApi('/employees/');
  const employees = data?.results || data || [];
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', department: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = employees.filter(e =>
    e.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const save = async () => {
    if (!form.full_name || !form.email) { setError('Nombre y email son requeridos.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/employees/', form);
      setShowModal(false); setForm({ full_name: '', email: '', department: '', role: '' }); refetch();
    } catch (e) { setError(e?.response?.data?.detail || JSON.stringify(e?.response?.data) || 'Error al crear empleado.'); }
    finally { setSaving(false); }
  };

  const statusBadge = (pct) => {
    if (pct >= 80) return { label: 'Al día', variant: 'success' };
    if (pct >= 40) return { label: 'En riesgo', variant: 'warning' };
    return { label: 'Crítico', variant: 'danger' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
          <span style={{ color: C.t3 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email…" style={{ flex: 1, border: 'none', fontSize: 13, color: C.t1, background: 'none', outline: 'none' }} />
        </div>
        <Button onClick={() => setShowModal(true)}>+ Nuevo empleado</Button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 160px 100px' }}>
          {['Empleado', 'Departamento', 'Cargo', 'Progreso', 'Estado'].map(h => (
            <div key={h} style={{ padding: '11px 16px', fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9' }}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
        ) : filtered.map(e => {
          const pct = e.completion_pct || 0;
          const badge = statusBadge(pct);
          return (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 160px 100px', borderBottom: '1px solid #F1F5F9', transition: 'background .12s', cursor: 'default' }}
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
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}><ProgressBar pct={pct} color={pct >= 80 ? C.success : pct >= 40 ? C.warning : C.danger} showLabel /></div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}><Badge label={badge.label} variant={badge.variant} /></div>
            </div>
          );
        })}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo empleado">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre completo" value={form.full_name} onChange={v => setForm({ ...form, full_name: v })} placeholder="Ana García" required />
          <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="ana@empresa.com" required />
          <Input label="Departamento" value={form.department} onChange={v => setForm({ ...form, department: v })} placeholder="Operaciones" />
          <Input label="Cargo" value={form.role} onChange={v => setForm({ ...form, role: v })} placeholder="Analista Jr." />
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
