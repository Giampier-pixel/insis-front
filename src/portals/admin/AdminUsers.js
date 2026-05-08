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

const ROLE_MAP = {
  ADMIN:      { variant: 'danger', label: 'Admin' },
  INSTRUCTOR: { variant: 'info',   label: 'Instructor' },
};

export default function AdminUsers() {
  const { data, loading, refetch } = useApi('/auth/users/');
  const users = data?.results || data || [];

  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [form, setForm]           = useState({ full_name: '', email: '', password: '', role: 'INSTRUCTOR', is_active: true });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditUser(null);
    setForm({ full_name: '', email: '', password: '', role: 'INSTRUCTOR', is_active: true });
    setError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ full_name: u.full_name, email: u.email, password: '', role: u.role, is_active: u.is_active });
    setError('');
    setShowModal(true);
  };

  const save = async () => {
    if (!form.full_name || !form.email) { setError('Nombre y email son requeridos.'); return; }
    if (!editUser && !form.password) { setError('La contraseña es requerida.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { full_name: form.full_name, email: form.email, role: form.role, is_active: form.is_active };
      if (form.password) payload.password = form.password;
      if (editUser) {
        await api.patch(`/auth/users/${editUser.id}/`, payload);
      } else {
        await api.post('/auth/users/', { ...payload, password: form.password });
      }
      setShowModal(false);
      refetch();
    } catch (e) {
      const d = e?.response?.data;
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Error al guardar.');
    } finally { setSaving(false); }
  };

  const deleteUser = async (id) => {
    try { await api.delete(`/auth/users/${id}/`); refetch(); } catch { alert('Error al eliminar.'); }
    setConfirmDelete(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
          <span style={{ color: C.t3 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o rol…"
            style={{ flex: 1, border: 'none', fontSize: 13, color: C.t1, background: 'none', outline: 'none' }} />
        </div>
        <Button onClick={openCreate}>+ Nuevo usuario</Button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr' }}>
          {['Usuario', 'Email', 'Rol', 'Acciones'].map(h => (
            <div key={h} style={{ padding: '11px 16px', fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9' }}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="Sin usuarios" message="No hay usuarios que coincidan." />
        ) : filtered.map((u, i) => {
          const rb = ROLE_MAP[u.role] || { variant: 'default', label: u.role };
          return (
            <div key={u.id}
              style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', transition: 'background .12s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={u.full_name || u.email} size={30} color={C.accent} />
                <div style={{ fontSize: 13, fontWeight: 600, color: u.is_active ? C.t1 : C.t3 }}>{u.full_name || '—'}</div>
              </div>
              <div style={{ padding: '12px 16px', fontSize: 13, color: C.t2, display: 'flex', alignItems: 'center' }}>{u.email}</div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <Badge label={rb.label} variant={rb.variant} />
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(u)}>×</Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editUser ? 'Editar usuario' : 'Nuevo usuario'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre completo *" value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} placeholder="Ana García" />
          <Input label="Email *" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" placeholder="ana@insis.com" />
          <Input label={editUser ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'} value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" placeholder="Mínimo 8 caracteres" />
          <Select label="Rol" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))}
            options={[
              { value: 'INSTRUCTOR', label: 'Instructor' },
              { value: 'ADMIN',      label: 'Admin' },
            ]} />
          {error && <div style={{ fontSize: 12, color: C.danger, background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : editUser ? 'Guardar' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar eliminación">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 14, color: C.t1 }}>
            ¿Eliminar al usuario <strong>{confirmDelete?.full_name || confirmDelete?.email}</strong>? Esta acción no se puede deshacer.
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={() => deleteUser(confirmDelete.id)}>Eliminar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
