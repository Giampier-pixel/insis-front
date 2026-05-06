'use client';
import { C } from '@/lib/palette';

export default function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 11, color: C.t2, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ background: 'rgba(5,31,32,0.6)', border: `1px solid ${C.b1}`, borderRadius: 8, padding: '10px 13px', fontSize: 13, color: C.t1, outline: 'none', fontFamily: 'DM Sans', width: '100%' }}
      >
        {options.map(o => (
          <option key={o.value || o} value={o.value || o} style={{ background: C.g1 }}>
            {o.label || o}
          </option>
        ))}
      </select>
    </div>
  );
}
