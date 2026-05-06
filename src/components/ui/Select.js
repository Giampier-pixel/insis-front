'use client';
import { C } from '@/lib/palette';
export default function Select({ label, value, onChange, options, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, letterSpacing: '0.03em' }}>{label}</label>}
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          padding: '10px 14px', borderRadius: 8, fontSize: 13, color: C.t1,
          border: `1px solid ${error ? C.danger : C.border}`,
          background: '#fff', width: '100%', cursor: 'pointer',
        }}
        onFocus={e => { e.target.style.borderColor = C.accent; }}
        onBlur={e => { e.target.style.borderColor = C.border; }}
      >
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      {error && <span style={{ fontSize: 11, color: C.danger }}>{error}</span>}
    </div>
  );
}
