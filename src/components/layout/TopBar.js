'use client';
import { C } from '@/lib/palette';
const TITLES = {
  dashboard:        'Dashboard',
  catalog:          'Catálogo de Cursos',
  'my-learning':    'Mi Aprendizaje',
  quiz:             'Quizzes',
  certificates:     'Mis Certificados',
  'hr-dashboard':   'Dashboard Corporativo',
  employees:        'Empleados',
  assignments:      'Asignaciones',
  reports:          'Reportes',
  'ins-dashboard':  'Dashboard del Instructor',
  'ins-courses':    'Mis Cursos',
  'ins-quiz-stats': 'Estadísticas de Quiz',
  'admin-dashboard':'Panel de Administración',
  'admin-companies':'Gestión de Empresas',
  'admin-users':    'Gestión de Usuarios',
};
export default function TopBar({ page }) {
  return (
    <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 28px', flexShrink: 0 }}>
      <h1 style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{TITLES[page] || 'INSIS'}</h1>
    </header>
  );
}
