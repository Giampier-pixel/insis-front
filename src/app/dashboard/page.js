'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Shell from '@/components/layout/Shell';
import Spinner from '@/components/ui/Spinner';

import CourseCatalog from '@/portals/student/CourseCatalog';
import Certificates from '@/portals/student/Certificates';

import InsCourses from '@/portals/instructor/InsCourses';
import InsStudents from '@/portals/instructor/InsStudents';

import AdminDashboard from '@/portals/admin/AdminDashboard';
import AdminUsers from '@/portals/admin/AdminUsers';
import AdminCourses from '@/portals/admin/AdminCourses';
import AdminReport from '@/portals/admin/AdminReport';

function DashboardInner() {
  const searchParams = useSearchParams();
  const { role, loading } = useAuth();

  const defaultPage = () => {
    const portal = searchParams.get('portal');
    if (portal === 'admin')      return 'admin-dashboard';
    if (portal === 'instructor') return 'ins-courses';
    return 'catalog';
  };

  const [page, setPage] = useState(defaultPage);

  useEffect(() => {
    if (!loading && role) {
      if (role === 'ADMIN' && page === 'catalog')      setPage('admin-dashboard');
      if (role === 'INSTRUCTOR' && page === 'catalog') setPage('ins-courses');
    }
  }, [role, loading]);

  const renderPage = () => {
    switch (page) {
      // Student
      case 'catalog':       return <CourseCatalog />;
      case 'certificates':  return <Certificates />;
      // Instructor
      case 'ins-courses':   return <InsCourses />;
      case 'ins-students':  return <InsStudents />;
      // Admin
      case 'admin-dashboard': return <AdminDashboard onNav={setPage} />;
      case 'admin-users':     return <AdminUsers />;
      case 'admin-courses':   return <AdminCourses />;
      case 'admin-report':    return <AdminReport />;
      default:              return <CourseCatalog />;
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
