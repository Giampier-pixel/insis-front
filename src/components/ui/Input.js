'use client';
import { C } from '@/lib/palette';

export default function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 11, color: C.t2, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ background: 'rgba(5,31,32,0.5)', border: `1px solid ${C.b1}`, borderRadius: 8, padding: '10px 13px', fontSize: 13, color: C.t1, outline: 'none', fontFamily: 'DM Sans', width: '100%', backdropFilter: 'blur(8px)' }}
        onFocus={e => { e.target.style.borderColor = C.accent + '80'; e.target.style.boxShadow = `0 0 0 3px ${C.accent}18`; }}
        onBlur={e => { e.target.style.borderColor = C.b1; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
