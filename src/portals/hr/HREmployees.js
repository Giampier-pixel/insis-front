'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import { EMPLOYEES } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Avatar from '@/components/ui/Avatar';
import Btn from '@/components/ui/Btn';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';

export default function HREmployees() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', dept: 'Operaciones', role: '' });
  const [employees, setEmployees] = useState(EMPLOYEES);
  const depts = ['Todos', ...[...new Set(EMPLOYEES.map(e => e.dept))]];
  const filtered = employees.filter(e =>
    (deptFilter === 'Todos' || e.dept === deptFilter) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()))
  );

  const addEmp = () => {
    if (!newEmp.name || !newEmp.email) return;
    setEmployees([...employees, { ...newEmp, id: employees.length + 1, completed: 0, assigned: 0, pct: 0, status: 'ok' }]);
    setShowModal(false);
    setNewEmp({ name: '', email: '', dept: 'Operaciones', role: '' });
  };

  const statusColor = s => s === 'done' ? C.teal : s === 'ok' ? C.accent : s === 'warn' ? C.amber : C.red;
  const statusLabel = s => s === 'done' ? 'OK' : s === 'ok' ? 'Activo' : s === 'warn' ? 'Alerta' : 'Riesgo';

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(5,31,32,0.5)', border: `1px solid ${C.b1}`, borderRadius: 8, padding: '8px 14px', backdropFilter: 'blur(8px)' }}>
          <span style={{ color: C.t3 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nombre o email…"
            aria-label="Buscar empleado"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.t1, fontSize: 13, fontFamily: 'DM Sans' }}
          />
        </div>
        <SelectField label="" value={deptFilter} onChange={setDeptFilter} options={depts} />
        <Btn onClick={() => setShowModal(true)}>+ Nuevo</Btn>
        <Btn variant="ghost">Importar CSV</Btn>
      </div>
      <GlassCard style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 140px 60px 80px' }}>
          {['Empleado', 'Dpto.', 'Rol', 'Progreso', 'Cursos', 'Estado'].map(h => (
            <div key={h} style={{ padding: '10px 16px', fontSize: 10, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: `1px solid ${C.b3}` }}>{h}</div>
          ))}
        </div>
        {filtered.map(e => (
          <div
            key={e.id}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 140px 60px 80px', borderBottom: `1px solid ${C.b3}`, transition: 'background .15s', cursor: 'pointer' }}
            onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(140,183,155,0.06)'}
            onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
          >
            <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={e.name} size={28} color={statusColor(e.status)} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{e.name}</div>
                <div style={{ fontSize: 10, color: C.t3 }}>{e.email}</div>
              </div>
            </div>
            <div style={{ padding: '11px 16px', fontSize: 12, color: C.t2, display: 'flex', alignItems: 'center' }}>{e.dept}</div>
            <div style={{ padding: '11px 16px', fontSize: 12, color: C.t2, display: 'flex', alignItems: 'center' }}>{e.role}</div>
            <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ProgressBar pct={e.pct} color={e.pct >= 80 ? C.teal : e.pct >= 40 ? C.accent : C.red} height={4} glow />
              <span style={{ fontSize: 10, color: C.t3, flexShrink: 0, width: 26 }}>{e.pct}%</span>
            </div>
            <div style={{ padding: '11px 16px', fontSize: 12, color: C.t1, display: 'flex', alignItems: 'center' }}>{e.completed}/{e.assigned || '—'}</div>
            <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center' }}>
              <Badge label={statusLabel(e.status)} color={statusColor(e.status)} />
            </div>
          </div>
        ))}
      </GlassCard>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo empleado">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre completo" value={newEmp.name} onChange={v => setNewEmp({ ...newEmp, name: v })} placeholder="Ana García" />
          <Input label="Email" value={newEmp.email} onChange={v => setNewEmp({ ...newEmp, email: v })} placeholder="ana@empresa.com" type="email" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SelectField label="Departamento" value={newEmp.dept} onChange={v => setNewEmp({ ...newEmp, dept: v })} options={['Operaciones', 'Ventas', 'RR.HH.', 'Finanzas', 'TI', 'Legal']} />
            <Input label="Cargo" value={newEmp.role} onChange={v => setNewEmp({ ...newEmp, role: v })} placeholder="Analista Jr." />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={addEmp}>Crear empleado</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
