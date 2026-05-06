'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Spinner from '@/components/ui/Spinner';

export default function Shell({ page, onNav, children }) {
  const { user, role, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={36} />
    </div>
  );

  if (!user) { router.replace('/login'); return null; }

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
