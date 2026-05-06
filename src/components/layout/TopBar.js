'use client';
import { useState } from 'react';
import { C } from '@/lib/palette';

export default function TopBar({ title, onMenuToggle }) {
  const [notifs, setNotifs] = useState(3);
  return (
    <header
      className="glass-topbar"
      style={{ height: 56, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', flexShrink: 0, position: 'relative', zIndex: 10 }}
    >
      <button
        onClick={onMenuToggle}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t2, fontSize: 16, padding: 6, borderRadius: 6, transition: 'color .15s' }}
        onMouseEnter={e => e.currentTarget.style.color = C.t1}
        onMouseLeave={e => e.currentTarget.style.color = C.t2}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <h1 style={{ fontSize: 14, fontWeight: 600, color: C.t1, flex: 1, letterSpacing: '-0.01em' }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(5,31,32,0.5)', border: `1px solid ${C.b1}`, borderRadius: 8, padding: '7px 12px', backdropFilter: 'blur(8px)' }}>
          <span style={{ color: C.t3, fontSize: 13 }}>⌕</span>
          <input
            placeholder="Buscar…"
            aria-label="Buscar"
            style={{ background: 'none', border: 'none', outline: 'none', color: C.t1, fontSize: 12, width: 150, fontFamily: 'DM Sans' }}
          />
        </div>
        <button
          onClick={() => setNotifs(0)}
          style={{ position: 'relative', background: 'rgba(5,31,32,0.5)', border: `1px solid ${C.b1}`, borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: C.t2, fontSize: 14, backdropFilter: 'blur(8px)' }}
          aria-label="Notificaciones"
        >
          🔔
          {notifs > 0 && (
            <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: C.red, border: `2px solid ${C.g0}`, boxShadow: `0 0 6px ${C.red}` }} />
          )}
        </button>
      </div>
    </header>
  );
}
