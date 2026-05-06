'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getRole } from '@/lib/auth';
import Spinner from '@/components/ui/Spinner';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (!token) { router.replace('/login'); return; }
    if (role === 'INSTRUCTOR') router.replace('/dashboard?portal=instructor');
    else if (role === 'HR_MANAGER' || role === 'ADMIN') router.replace('/dashboard?portal=hr');
    else router.replace('/dashboard?portal=student');
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={36} />
    </div>
  );
}
