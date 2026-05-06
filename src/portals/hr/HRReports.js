'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import api from '@/lib/api';

const REPORTS = [
  { id: 'company-summary',         title: 'Resumen de empresa',         desc: 'KPIs globales y completación general', color: C.accent },
  { id: 'completion-by-department', title: 'Por departamento',           desc: 'Desglose de completación por unidad',  color: C.info },
  { id: 'employee-ranking',         title: 'Ranking de empleados',       desc: 'Top performers y empleados en riesgo', color: C.success },
  { id: 'overdue-assignments',      title: 'Asignaciones vencidas',      desc: 'Fecha límite superada o próxima',      color: C.danger },
];

export default function Reports() {
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadReport = async (id) => {
    setLoading(true); setActiveReport(id); setReportData(null);
    try {
      const { data } = await api.get(`/reports/${id}/`);
      setReportData(data);
    } catch { setReportData({ error: 'No se pudo cargar el reporte.' }); }
    finally { setLoading(false); }
  };

  const exportReport = async () => {
    if (!activeReport) return;
    setExporting(true);
    try {
      const { data } = await api.post('/reports/exports/', { report_type: activeReport });
      alert(`Exportación iniciada. ID: ${data.id}. Verifica el estado en unos momentos.`);
    } catch { alert('Error al crear la exportación.'); }
    finally { setExporting(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {REPORTS.map(r => (
          <div key={r.id} onClick={() => loadReport(r.id)} style={{ background: '#fff', border: `1px solid ${activeReport === r.id ? r.color : '#E2E8F0'}`, borderRadius: 12, padding: '20px 22px', cursor: 'pointer', transition: 'all .15s', boxShadow: activeReport === r.id ? `0 0 0 2px ${r.color}30` : '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 24, height: 3, borderRadius: 2, background: r.color, marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{r.title}</div>
            <div style={{ fontSize: 12, color: C.t3, marginBottom: 14 }}>{r.desc}</div>
            <Button variant="ghost" size="sm">Ver reporte</Button>
          </div>
        ))}
      </div>

      {(loading || reportData) && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{REPORTS.find(r => r.id === activeReport)?.title}</div>
            <Button variant="ghost" size="sm" onClick={exportReport} disabled={exporting}>{exporting ? 'Exportando…' : '↓ Exportar CSV'}</Button>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
          ) : reportData?.error ? (
            <div style={{ color: C.danger, fontSize: 13 }}>{reportData.error}</div>
          ) : (
            <pre style={{ fontSize: 12, color: C.t2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
              {JSON.stringify(reportData, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
