'use client';
import { C } from '@/lib/palette';
export default function Input({ label, value, onChange, placeholder, type = 'text', error, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.t2 }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, color: C.t1, border: `1px solid ${error ? C.danger : C.border}`, background: '#fff', width: '100%', outline: 'none', transition: 'border-color .15s' }}
        onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
        onBlur={e => { e.target.style.borderColor = error ? C.danger : C.border; e.target.style.boxShadow = 'none'; }} />
      {error && <span style={{ fontSize: 11, color: C.danger }}>{error}</span>}
    </div>
  );
}
