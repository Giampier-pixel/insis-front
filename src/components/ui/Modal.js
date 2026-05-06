'use client';
import { C } from '@/lib/palette';
export default function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width, maxWidth: '92vw', maxHeight: '88vh', overflow: 'auto', padding: '26px 28px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{title}</span>
          <button onClick={onClose} style={{ color: C.t3, fontSize: 20, lineHeight: 1, padding: '2px 6px', borderRadius: 6 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
