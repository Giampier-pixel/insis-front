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

function DashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role, loading } = useAuth();

  const defaultPage = () => {
    const portal = searchParams.get('portal');
    if (portal === 'hr') return 'hr-dashboard';
    if (portal === 'instructor') return 'ins-dashboard';
    return 'dashboard';
  };

  const [page, setPage] = useState(defaultPage);

  useEffect(() => {
    if (!loading && role) {
      if ((role === 'HR_MANAGER' || role === 'ADMIN') && page === 'dashboard') setPage('hr-dashboard');
      if (role === 'INSTRUCTOR' && page === 'dashboard') setPage('ins-dashboard');
    }
  }, [role, loading]);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':      return <StudentDashboard onNav={setPage} />;
      case 'catalog':        return <CourseCatalog onNav={setPage} />;
      case 'my-learning':    return <MyLearning />;
      case 'quiz':           return <QuizPlayer />;
      case 'certificates':   return <Certificates />;
      case 'hr-dashboard':   return <HRDashboard />;
      case 'employees':      return <Employees />;
      case 'assignments':    return <Assignments />;
      case 'reports':        return <Reports />;
      case 'ins-dashboard':  return <InsDashboard onNav={setPage} />;
      case 'ins-courses':    return <InsCourses onNav={setPage} />;
      case 'ins-quiz-stats': return <InsQuizStats />;
      default:               return <StudentDashboard onNav={setPage} />;
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
