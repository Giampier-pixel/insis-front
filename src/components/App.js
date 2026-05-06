'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import StudentDashboard from '@/portals/student/StudentDashboard';
import CourseCatalog from '@/portals/student/CourseCatalog';
import MyLearning from '@/portals/student/MyLearning';
import QuizPlayer from '@/portals/student/QuizPlayer';
import Certificates from '@/portals/student/Certificates';
import HRDashboard from '@/portals/hr/HRDashboard';
import HREmployees from '@/portals/hr/HREmployees';
import HRAssignments from '@/portals/hr/HRAssignments';
import HRReports from '@/portals/hr/HRReports';
import InsDashboard from '@/portals/instructor/InsDashboard';
import InsCourses from '@/portals/instructor/InsCourses';
import InsQuizStats from '@/portals/instructor/InsQuizStats';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  catalog: 'Catálogo de Cursos',
  'my-learning': 'Mi Aprendizaje',
  quiz: 'Quiz — Liderazgo de Equipos',
  certificates: 'Mis Certificados',
  'hr-dashboard': 'Dashboard Corporativo',
  employees: 'Gestión de Empleados',
  assignments: 'Asignaciones',
  reports: 'Reportes',
  'ins-dashboard': 'Dashboard del Instructor',
  'ins-courses': 'Gestión de Cursos',
  'ins-quiz-stats': 'Estadísticas de Quiz',
};

export default function App() {
  const [role, setRole] = useState('student');
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const handleRoleChange = r => {
    setRole(r);
    if (r === 'student') setPage('dashboard');
    else if (r === 'hr') setPage('hr-dashboard');
    else setPage('ins-dashboard');
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <StudentDashboard onNav={setPage} />;
      case 'catalog': return <CourseCatalog onNav={setPage} />;
      case 'my-learning': return <MyLearning />;
      case 'quiz': return <QuizPlayer />;
      case 'certificates': return <Certificates />;
      case 'hr-dashboard': return <HRDashboard />;
      case 'employees': return <HREmployees />;
      case 'assignments': return <HRAssignments />;
      case 'reports': return <HRReports />;
      case 'ins-dashboard': return <InsDashboard onNav={setPage} />;
      case 'ins-courses': return <InsCourses onNav={setPage} />;
      case 'ins-quiz-stats': return <InsQuizStats />;
      default: return <StudentDashboard onNav={setPage} />;
    }
  };

  return (
    <div className="app-bg" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Orbs for ambient depth */}
      <div className="orb" style={{ width: 400, height: 400, top: '-10%', left: '15%', background: `radial-gradient(circle, ${C.g2}50, transparent 70%)` }} />
      <div className="orb" style={{ width: 300, height: 300, bottom: '5%', right: '10%', background: `radial-gradient(circle, ${C.g1}60, transparent 70%)`, animationDelay: '-4s' }} />
      <div className="orb" style={{ width: 200, height: 200, top: '50%', left: '45%', background: `radial-gradient(circle, ${C.g2}30, transparent 70%)`, animationDelay: '-2s' }} />

      <Sidebar active={page} onNav={setPage} role={role} onRoleChange={handleRoleChange} collapsed={collapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <TopBar title={PAGE_TITLES[page] || 'INSIS'} onMenuToggle={() => setCollapsed(c => !c)} />
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
