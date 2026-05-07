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
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

function exportToExcel(companies) {
  import('xlsx').then(XLSX => {
    // Sheet 1 — companies list
    const companyRows = companies.map(c => ({
      'ID':           c.id,
      'Nombre':       c.name,
      'RUC':          c.ruc,
      'Industria':    c.industry || '—',
      'País':         c.country  || '—',
      'Ciudad':       c.city     || '—',
      'Empleados':    c.employee_count   ?? 0,
      'Departamentos':c.department_count ?? 0,
      'Creado':       c.created_at ? new Date(c.created_at).toLocaleDateString('es-PE') : '—',
    }));

    const wb  = XLSX.utils.book_new();
    const ws  = XLSX.utils.json_to_sheet(companyRows);

    // Column widths
    ws['!cols'] = [
      { wch: 6 }, { wch: 30 }, { wch: 14 }, { wch: 18 },
      { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Empresas');

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `INSIS_Empresas_${fecha}.xlsx`);
  });
}

export default function AdminCompanies() {
  const { data, loading, refetch } = useApi('/companies/');
  const companies = data?.results || data || [];

  const [showModal, setShowModal]     = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [form, setForm]   = useState({ name: '', ruc: '', industry: '', country: 'PE', city: '' });
  const [deptForm, setDeptForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const { data: deptsData, refetch: refetchDepts } = useApi(
    selectedCompany ? `/companies/${selectedCompany.id}/departments/` : null
  );
  const departments = deptsData?.results || deptsData || [];

  const saveCompany = async () => {
    if (!form.name || !form.ruc) { setError('Nombre y RUC son requeridos.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/companies/', form);
      setShowModal(false);
      setForm({ name: '', ruc: '', industry: '', country: 'PE', city: '' });
      refetch();
    } catch (e) {
      const d = e?.response?.data;
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Error al crear empresa.');
    } finally { setSaving(false); }
  };

  const saveDept = async () => {
    if (!deptForm.name) { setError('El nombre es requerido.'); return; }
    setSaving(true); setError('');
    try {
      await api.post(`/companies/${selectedCompany.id}/departments/`, deptForm);
      setShowDeptModal(false);
      setDeptForm({ name: '' });
      refetchDepts();
    } catch (e) {
      const d = e?.response?.data;
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Error al crear departamento.');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: C.t3 }}>
          <span style={{ fontWeight: 600, color: C.t1 }}>{companies.length}</span> empresas registradas
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="ghost"
            onClick={() => exportToExcel(companies)}
            disabled={companies.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ↓ Exportar Excel
          </Button>
          <Button onClick={() => { setError(''); setShowModal(true); }}>+ Nueva empresa</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCompany ? '1fr 1fr' : '1fr', gap: 16 }}>
        {/* Companies list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
          ) : companies.length === 0 ? (
            <EmptyState title="Sin empresas" message="Crea la primera empresa." action={<Button onClick={() => setShowModal(true)}>+ Nueva empresa</Button>} />
          ) : companies.map(c => (
            <div key={c.id}
              onClick={() => setSelectedCompany(selectedCompany?.id === c.id ? null : c)}
              style={{ background: '#fff', border: `1px solid ${selectedCompany?.id === c.id ? C.accent : '#E2E8F0'}`, borderRadius: 12, padding: '16px 20px', cursor: 'pointer', transition: 'all .15s', boxShadow: selectedCompany?.id === c.id ? `0 0 0 2px ${C.accentLight}` : '' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>RUC: {c.ruc} · {c.industry || '—'} · {c.city || c.country}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12, color: C.t3 }}>
                  <span><span style={{ fontWeight: 600, color: C.t1 }}>{c.employee_count}</span> empl.</span>
                  <span><span style={{ fontWeight: 600, color: C.t1 }}>{c.department_count}</span> deptos.</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Departments panel */}
        {selectedCompany && (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Departamentos</div>
                <div style={{ fontSize: 11, color: C.t3 }}>{selectedCompany.name}</div>
              </div>
              <Button size="sm" onClick={() => { setError(''); setShowDeptModal(true); }}>+ Depto.</Button>
            </div>
            {departments.length === 0 ? (
              <div style={{ fontSize: 13, color: C.t3, textAlign: 'center', padding: 24 }}>Sin departamentos</div>
            ) : departments.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{d.name}</div>
                </div>
                <Badge label={`${d.employee_count} empl.`} variant="default" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create company modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva empresa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre de la empresa *" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="INSIS Corp" required />
          <Input label="RUC *" value={form.ruc} onChange={v => setForm({ ...form, ruc: v })} placeholder="20123456789" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input label="Industria" value={form.industry} onChange={v => setForm({ ...form, industry: v })} placeholder="Tecnología" />
            <Input label="Ciudad" value={form.city} onChange={v => setForm({ ...form, city: v })} placeholder="Lima" />
          </div>
          <Select label="País" value={form.country} onChange={v => setForm({ ...form, country: v })}
            options={[{ value: 'PE', label: 'Perú' }, { value: 'CO', label: 'Colombia' }, { value: 'MX', label: 'México' }, { value: 'CL', label: 'Chile' }, { value: 'AR', label: 'Argentina' }]} />
          {error && <div style={{ fontSize: 12, color: C.danger, background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={saveCompany} disabled={saving}>{saving ? 'Guardando…' : 'Crear empresa'}</Button>
          </div>
        </div>
      </Modal>

      {/* Create dept modal */}
      <Modal open={showDeptModal} onClose={() => setShowDeptModal(false)} title={`Nuevo departamento — ${selectedCompany?.name}`} width={380}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre del departamento *" value={deptForm.name} onChange={v => setDeptForm({ name: v })} placeholder="Operaciones" required />
          {error && <div style={{ fontSize: 12, color: C.danger, background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowDeptModal(false)}>Cancelar</Button>
            <Button onClick={saveDept} disabled={saving}>{saving ? 'Guardando…' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
