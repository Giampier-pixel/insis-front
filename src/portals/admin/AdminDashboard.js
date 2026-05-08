'use client';
import { C } from '@/lib/palette';
import StatCard from '@/components/ui/StatCard';

export default function AdminDashboard({ onNav }) {
  const modules = [
    { id: 'admin-users',   label: 'Gestión de Usuarios',  desc: 'Administra instructores y admins' },
    { id: 'admin-courses', label: 'Gestión de Cursos',     desc: 'Crea y asigna cursos a instructores' },
    { id: 'admin-report',  label: 'Reportes',              desc: 'Estadísticas generales de la plataforma' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: C.accent, borderRadius: 14, padding: '24px 28px', color: '#fff' }}>
        <div style={{ fontSize: 12, opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Panel de control</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Administración INSIS</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {modules.map(item => (
          <div key={item.id} onClick={() => onNav(item.id)}
            style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px', cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: C.t3 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
