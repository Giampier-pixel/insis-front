'use client';
import { useState, useEffect } from 'react';
import { C } from '@/lib/palette';
import { QUIZ_QUESTIONS } from '@/lib/mock';
import GlassCard from '@/components/ui/GlassCard';
import Btn from '@/components/ui/Btn';

export default function QuizPlayer() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const q = QUIZ_QUESTIONS[current];

  if (submitted) {
    const score = QUIZ_QUESTIONS.filter((_, i) => selected[i] === QUIZ_QUESTIONS[i].correct).length;
    const pct = Math.round(score / QUIZ_QUESTIONS.length * 100);
    const pass = pct >= 70;
    return (
      <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GlassCard style={{ padding: '44px 52px', maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: pass ? C.teal : C.red, marginBottom: 6, letterSpacing: '-0.03em' }}>{pct}%</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{pass ? '¡Aprobado!' : 'No aprobado'}</div>
          <div style={{ fontSize: 12, color: C.t2, marginBottom: 28 }}>Respondiste correctamente {score}/{QUIZ_QUESTIONS.length}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {QUIZ_QUESTIONS.map((qq, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(5,31,32,0.4)', borderRadius: 9, padding: '10px 14px', textAlign: 'left', border: `1px solid ${selected[i] === qq.correct ? C.teal + '30' : C.red + '30'}` }}>
                <span style={{ color: selected[i] === qq.correct ? C.teal : C.red, flexShrink: 0, marginTop: 1, fontSize: 14 }}>{selected[i] === qq.correct ? '✓' : '✗'}</span>
                <div>
                  <div style={{ fontSize: 12, color: C.t1, marginBottom: 2 }}>{qq.text.slice(0, 60)}…</div>
                  <div style={{ fontSize: 10, color: C.t3 }}>Correcta: {qq.options[qq.correct]}</div>
                </div>
              </div>
            ))}
          </div>
          <Btn onClick={() => { setSubmitted(false); setCurrent(0); setSelected({}); setTimeLeft(900); }}>Reintentar</Btn>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="scrollable" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Liderazgo de Equipos</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>Quiz Final</div>
        </div>
        <div style={{ padding: '8px 18px', borderRadius: 9, background: timeLeft < 120 ? 'rgba(240,120,120,0.15)' : 'rgba(5,31,32,0.55)', border: `1px solid ${timeLeft < 120 ? C.red + '50' : C.b1}`, color: timeLeft < 120 ? C.red : C.t1, fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, backdropFilter: 'blur(8px)', boxShadow: timeLeft < 120 ? `0 0 20px ${C.red}30` : '' }}>
          {fmt(timeLeft)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {QUIZ_QUESTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${selected[i] !== undefined ? C.accent + '80' : i === current ? C.b2 : C.b1}`, background: selected[i] !== undefined ? 'rgba(140,183,155,0.2)' : i === current ? 'rgba(140,183,155,0.08)' : 'transparent', color: selected[i] !== undefined ? C.accentL : i === current ? C.t1 : C.t3, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s', boxShadow: selected[i] !== undefined ? `0 0 10px ${C.accent}30` : '' }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <GlassCard style={{ padding: '26px' }}>
        <div style={{ fontSize: 10, color: C.t3, marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pregunta {current + 1} de {QUIZ_QUESTIONS.length}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.t1, lineHeight: 1.55, marginBottom: 22 }}>{q.text}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {q.options.map((opt, i) => {
            const sel = selected[current] === i;
            return (
              <button
                key={i}
                onClick={() => setSelected({ ...selected, [current]: i })}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${sel ? C.accent + '80' : C.b1}`, background: sel ? 'rgba(140,183,155,0.15)' : 'rgba(5,31,32,0.35)', color: sel ? C.accentL : C.t2, cursor: 'pointer', textAlign: 'left', transition: 'all .18s', fontSize: 13, fontFamily: 'DM Sans', boxShadow: sel ? `0 0 16px ${C.accent}20` : '' }}
              >
                <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: `2px solid ${sel ? C.accent : C.b2}`, background: sel ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s', boxShadow: sel ? `0 0 10px ${C.accent}80` : '' }}>
                  {sel && <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.g0, display: 'block' }} />}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </GlassCard>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Btn variant="ghost" onClick={() => setCurrent(Math.max(0, current - 1))}>← Anterior</Btn>
        {current < QUIZ_QUESTIONS.length - 1
          ? <Btn onClick={() => setCurrent(current + 1)}>Siguiente →</Btn>
          : <Btn style={{ background: `linear-gradient(135deg,${C.teal}cc,${C.teal})`, color: C.g0 }} onClick={() => setSubmitted(true)}>Enviar quiz</Btn>
        }
      </div>
    </div>
  );
}
