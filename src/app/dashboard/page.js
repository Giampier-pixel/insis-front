'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Shell from '@/components/layout/Shell';
import Spinner from '@/components/ui/Spinner';

import StudentDashboard from '@/portals/student/StudentDashboard';
import CourseCatalog from '@/portals/student/CourseCatalog';
import MyLearning from '@/portals/student/MyLearning';
import QuizPlayer from '@/portals/student/QuizPlayer';
import Certificates from '@/portals/student/Certificates';

import HRDashboard from '@/portals/hr/HRDashboard';
import Employees from '@/portals/hr/HREmployees';
import Assignments from '@/portals/hr/HRAssignments';
import Reports from '@/portals/hr/HRReports';

import InsDashboard from '@/portals/instructor/InsDashboard';
import InsCourses from '@/portals/instructor/InsCourses';
import InsQuizStats from '@/portals/instructor/InsQuizStats';

import AdminCompanies from '@/portals/admin/AdminCompanies';
import AdminUsers from '@/portals/admin/AdminUsers';

function AdminDashboard({ onNav }) {
  const { C } = require('@/lib/palette');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#1E4D3F', borderRadius: 14, padding: '24px 28px', color: '#fff' }}>
        <div style={{ fontSize: 12, opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Panel de control</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Administración INSIS</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {[
          { id: 'admin-companies', label: 'Gestión de Empresas',  desc: 'Crear y administrar empresas y departamentos', icon: '🏢' },
          { id: 'admin-users',     label: 'Gestión de Usuarios',  desc: 'Crear y administrar cuentas de usuario',       icon: '👥' },
          { id: 'hr-dashboard',    label: 'Vista HR',             desc: 'Dashboard corporativo, empleados y asignaciones', icon: '◉' },
          { id: 'reports',         label: 'Reportes globales',    desc: 'Reportes de completación y rendimiento',       icon: '≡' },
        ].map(item => (
          <div key={item.id} onClick={() => onNav(item.id)}
            style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 22px', cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E4D3F'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role, loading } = useAuth();

  const defaultPage = () => {
    const portal = searchParams.get('portal');
    if (portal === 'admin')      return 'admin-dashboard';
    if (portal === 'hr')         return 'hr-dashboard';
    if (portal === 'instructor') return 'ins-dashboard';
    return 'dashboard';
  };

  const [page, setPage] = useState(defaultPage);

  useEffect(() => {
    if (!loading && role) {
      if (role === 'ADMIN'      && page === 'dashboard') setPage('admin-dashboard');
      if (role === 'HR_MANAGER' && page === 'dashboard') setPage('hr-dashboard');
      if (role === 'INSTRUCTOR' && page === 'dashboard') setPage('ins-dashboard');
    }
  }, [role, loading]);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':        return <StudentDashboard onNav={setPage} />;
      case 'catalog':          return <CourseCatalog onNav={setPage} />;
      case 'my-learning':      return <MyLearning />;
      case 'quiz':             return <QuizPlayer />;
      case 'certificates':     return <Certificates />;
      case 'hr-dashboard':     return <HRDashboard />;
      case 'employees':        return <Employees />;
      case 'assignments':      return <Assignments />;
      case 'reports':          return <Reports />;
      case 'ins-dashboard':    return <InsDashboard onNav={setPage} />;
      case 'ins-courses':      return <InsCourses onNav={setPage} />;
      case 'ins-quiz-stats':   return <InsQuizStats />;
      case 'admin-dashboard':  return <AdminDashboard onNav={setPage} />;
      case 'admin-companies':  return <AdminCompanies />;
      case 'admin-users':      return <AdminUsers />;
      default:                 return <StudentDashboard onNav={setPage} />;
    }
  };

  return (
    <Shell page={page} onNav={setPage}>
      {renderPage()}
    </Shell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={36} /></div>}>
      <DashboardInner />
    </Suspense>
  );
}
