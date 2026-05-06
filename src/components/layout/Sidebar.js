'use client';
import { C } from '@/lib/palette';
import Avatar from '@/components/ui/Avatar';

const NAV = {
  student: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'my-learning', label: 'Mi Aprendizaje' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'certificates', label: 'Certificados' },
  ],
  hr: [
    { id: 'hr-dashboard', label: 'Dashboard' },
    { id: 'employees', label: 'Empleados' },
    { id: 'assignments', label: 'Asignaciones' },
    { id: 'reports', label: 'Reportes' },
  ],
  instructor: [
    { id: 'ins-dashboard', label: 'Dashboard' },
    { id: 'ins-courses', label: 'Mis Cursos' },
    { id: 'ins-quiz-stats', label: 'Estadísticas Quiz' },
  ],
};

const ROLE_LABELS = { student: 'Estudiante', hr: 'HR Manager', instructor: 'Instructor' };

export default function Sidebar({ active, onNav, role, onRoleChange, collapsed }) {
  const items = NAV[role] || NAV.student;
  return (
    <aside
      className="glass-sidebar"
      style={{ width: collapsed ? 0 : 248, minWidth: collapsed ? 0 : 248, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'width .25s ease, min-width .25s ease', flexShrink: 0, position: 'relative', zIndex: 10 }}
    >
      {/* logo */}
      <div style={{ padding: '24px 22px 18px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
          <span className="grad-text">INS</span>
          <span style={{ color: C.t2 }}>IS</span>
        </div>
        <div style={{ fontSize: 10, color: C.t3, marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Learning Platform</div>
      </div>

      {/* role switcher */}
      <div style={{ padding: '0 12px 10px' }}>
        <div style={{ fontSize: 9, color: C.t3, marginBottom: 6, paddingLeft: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Portal</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(ROLE_LABELS).map(([r, lbl]) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: role === r ? 'rgba(140,183,155,0.15)' : 'transparent', color: role === r ? C.accent : C.t3, fontSize: 12, fontWeight: role === r ? 600 : 400, transition: 'all .15s', textAlign: 'left' }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: role === r ? C.accent : C.t3 + '60', boxShadow: role === r ? `0 0 6px ${C.accent}` : '' }} />
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: C.b3, margin: '0 14px 8px' }} />

      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: active === item.id ? 'rgba(140,183,155,0.15)' : 'transparent', color: active === item.id ? C.accentL : C.t2, fontSize: 13, fontWeight: active === item.id ? 600 : 400, transition: 'all .15s', marginBottom: 1, textAlign: 'left', position: 'relative' }}
          >
            {active === item.id && (
              <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, background: C.accent, borderRadius: 2, boxShadow: `0 0 8px ${C.accent}` }} />
            )}
            <span style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, background: active === item.id ? C.accent + '30' : 'rgba(140,183,155,0.08)', border: `1px solid ${active === item.id ? C.accent + '50' : C.b3}` }} />
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '12px', borderTop: `1px solid ${C.b3}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(140,183,155,0.08)', border: `1px solid ${C.b1}` }}>
          <Avatar
            name={role === 'hr' ? 'Paula Nieto' : role === 'instructor' ? 'Carlos Mendoza' : 'Alejandro Ruiz'}
            size={32}
            color={C.accent}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {role === 'hr' ? 'Paula Nieto' : role === 'instructor' ? 'Carlos Mendoza' : 'Alejandro Ruiz'}
            </div>
            <div style={{ fontSize: 10, color: C.t3 }}>{ROLE_LABELS[role]}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
