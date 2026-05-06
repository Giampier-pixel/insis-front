'use client';
import { C } from '@/lib/palette';

const NAV = {
  STUDENT:    [{ id:'dashboard',    label:'Dashboard',         icon:'⊞' }, { id:'catalog',      label:'Catálogo de Cursos', icon:'☰' }, { id:'my-learning', label:'Mi Aprendizaje',   icon:'◈' }, { id:'quiz',         label:'Quizzes',            icon:'✎' }, { id:'certificates', label:'Certificados',        icon:'★' }],
  HR_MANAGER: [{ id:'hr-dashboard', label:'Dashboard',         icon:'⊞' }, { id:'employees',    label:'Empleados',          icon:'◉' }, { id:'assignments',  label:'Asignaciones',       icon:'▤' }, { id:'reports',      label:'Reportes',           icon:'≡' }],
  INSTRUCTOR: [{ id:'ins-dashboard',label:'Dashboard',         icon:'⊞' }, { id:'ins-courses',  label:'Mis Cursos',         icon:'☰' }, { id:'ins-quiz-stats',label:'Estadísticas Quiz', icon:'≡' }],
  ADMIN:      [{ id:'hr-dashboard', label:'Dashboard',         icon:'⊞' }, { id:'employees',    label:'Empleados',          icon:'◉' }, { id:'assignments',  label:'Asignaciones',       icon:'▤' }, { id:'reports',      label:'Reportes',           icon:'≡' }],
};

export default function Sidebar({ active, onNav, role, userName, onLogout }) {
  const items = NAV[role] || NAV.STUDENT;
  return (
    <aside style={{ width: 240, minWidth: 240, background: '#fff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.accent, letterSpacing: '-0.03em' }}>INSIS</div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Learning Platform</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {items.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 8, marginBottom: 2, background: isActive ? C.accentLight : 'transparent', color: isActive ? C.accent : C.t2, fontSize: 13, fontWeight: isActive ? 600 : 400, transition: 'all .15s', textAlign: 'left' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accentLight, border: `1.5px solid ${C.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.accent, flexShrink: 0 }}>
            {(userName || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ fontSize: 10, color: C.t3 }}>{role}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', color: C.t3, fontSize: 12, background: '#fff', transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = C.danger; e.currentTarget.style.borderColor = '#FECACA'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
