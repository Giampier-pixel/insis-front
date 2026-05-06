'use client';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function Certificates() {
  const { data, loading } = useApi('/enrollments/my-certificates/');
  const certs = data?.results || data || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 13, color: C.t3 }}><span style={{ fontWeight: 600, color: C.t1 }}>{certs.length}</span> certificados obtenidos</div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : certs.length === 0 ? (
        <EmptyState title="Sin certificados" message="Completa un curso para obtener tu certificado." />
      ) : certs.map(c => (
        <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ECFDF5', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏆</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{c.course_title || c.course?.title}</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Completado · ID: INS-{1000 + c.id}</div>
          </div>
          <Button variant="ghost" size="sm">Descargar PDF</Button>
        </div>
      ))}
    </div>
  );
}
