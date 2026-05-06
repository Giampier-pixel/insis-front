'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Spinner from '@/components/ui/Spinner';

export default function Shell({ page, onNav, children }) {
  const { user, role, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={36} />
    </div>
  );

  const handleLogout = async () => { await logout(); router.replace('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={page} onNav={onNav} role={role} userName={user.full_name || user.email} onLogout={handleLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar page={page} />
        <main className="page-content fade-in">{children}</main>
      </div>
    </div>
  );
}
