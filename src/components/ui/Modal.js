'use client';
import { C } from '@/lib/palette';
import GlassCard from './GlassCard';

export default function Modal({ open, onClose, title, children, width = 460 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,31,32,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <GlassCard style={{ width, maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto', padding: '26px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.t3, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        {children}
      </GlassCard>
    </div>
  );
}
