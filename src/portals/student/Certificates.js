'use client';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function Certificates() {
  const { data, loading } = useApi('/certificates/');
  const certs = data?.results || data || [];
  const ready = certs.filter(c => c.is_ready);
  const pending = certs.filter(c => !c.is_ready);

  const download = (cert) => {
    if (cert.download_url) {
      window.open(cert.download_url, '_blank');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 13, color: C.t3 }}>
        <span style={{ fontWeight: 600, color: C.t1 }}>{ready.length}</span> certificado{ready.length !== 1 ? 's' : ''} disponible{ready.length !== 1 ? 's' : ''}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : certs.length === 0 ? (
        <EmptyState title="Sin certificados" message="Completa todos los quizzes de un curso para obtener tu certificado." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ready.map(c => (
            <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ECFDF5', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                🏆
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{c.course_title}</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                  Generado el {c.generated_at ? new Date(c.generated_at).toLocaleDateString('es-PE') : '—'}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => download(c)}>Descargar PDF</Button>
            </div>
          ))}

          {pending.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 8, fontWeight: 600 }}>Generándose…</div>
              {pending.map(c => (
                <div key={c.id} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    ⏳
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{c.course_title}</div>
                    <div style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>Certificado en proceso…</div>
                  </div>
                  <Badge label="Procesando" variant="warning" />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
