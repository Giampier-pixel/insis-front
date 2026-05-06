'use client';
export default function Card({ children, style: s, onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        padding: '20px 24px', transition: hover ? 'box-shadow .15s, transform .15s' : undefined,
        cursor: onClick ? 'pointer' : undefined, ...s,
      }}
      onMouseEnter={e => { if (hover) { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
      onMouseLeave={e => { if (hover) { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}}
    >
      {children}
    </div>
  );
}
