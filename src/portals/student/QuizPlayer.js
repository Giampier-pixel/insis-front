'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

export default function QuizPlayer() {
  const { data, loading } = useApi('/quizzes/');
  const quizzes = data?.results || data || [];
  const [selected, setSelected] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [starting, setStarting] = useState(false);

  const startQuiz = async (quiz) => {
    setStarting(true);
    try {
      const { data } = await api.post(`/quizzes/${quiz.id}/start/`);
      setSelected(quiz); setAttempt(data); setCurrent(0); setAnswers({}); setResult(null);
    } catch (e) { alert(e?.response?.data?.detail || 'Error al iniciar quiz'); }
    finally { setStarting(false); }
  };

  const submitQuiz = async () => {
    try {
      const payload = { answers: Object.entries(answers).map(([qid, oid]) => ({ question: parseInt(qid), selected_option: oid })) };
      const { data } = await api.post(`/quizzes/${selected.id}/submit/`, { attempt_id: attempt.id, ...payload });
      setResult(data);
    } catch (e) { alert(e?.response?.data?.detail || 'Error al enviar'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>;

  if (result) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '40px 48px', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: result.passed ? C.success : C.danger, marginBottom: 8 }}>{result.score}%</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{result.passed ? '¡Aprobado!' : 'No aprobado'}</div>
        <div style={{ fontSize: 13, color: C.t3, marginBottom: 24 }}>{result.correct_answers}/{result.total_questions} respuestas correctas</div>
        <Button onClick={() => { setSelected(null); setResult(null); }}>Volver a quizzes</Button>
      </div>
    </div>
  );

  if (selected && attempt) {
    const questions = attempt.questions || [];
    const q = questions[current];
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{selected.title}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>Pregunta {current + 1} de {questions.length}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSelected(null); setAttempt(null); }}>Cancelar</Button>
        </div>
        {/* Navigator */}
        <div style={{ display: 'flex', gap: 6 }}>
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${answers[questions[i]?.id] ? C.accent : i === current ? C.t2 : '#E2E8F0'}`, background: answers[questions[i]?.id] ? C.accentLight : i === current ? '#F8FAFC' : '#fff', color: C.t1, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{i + 1}</button>
          ))}
        </div>
        {q && (
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, lineHeight: 1.55, marginBottom: 20 }}>{q.text}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options?.map(opt => {
                const sel = answers[q.id] === opt.id;
                return (
                  <button key={opt.id} onClick={() => setAnswers({ ...answers, [q.id]: opt.id })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${sel ? C.accent : '#E2E8F0'}`, background: sel ? C.accentLight : '#fff', color: sel ? C.accent : C.t2, cursor: 'pointer', textAlign: 'left', fontSize: 13, transition: 'all .15s' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: `2px solid ${sel ? C.accent : '#CBD5E1'}`, background: sel ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {sel && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'block' }} />}
                    </span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="ghost" onClick={() => setCurrent(Math.max(0, current - 1))}>← Anterior</Button>
          {current < questions.length - 1
            ? <Button onClick={() => setCurrent(current + 1)}>Siguiente →</Button>
            : <Button onClick={submitQuiz} style={{ background: C.success }}>Enviar quiz</Button>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Quizzes disponibles</h2>
      {quizzes.length === 0 ? <EmptyState title="Sin quizzes" message="No hay quizzes disponibles en este momento." /> : quizzes.map(q => (
        <div key={q.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{q.title}</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{q.question_count || 0} preguntas · {q.time_limit ? `${q.time_limit} min` : 'Sin límite'} · Mín. {q.passing_score}% para aprobar</div>
          </div>
          <Button size="sm" onClick={() => startQuiz(q)} disabled={starting}>{starting ? '…' : 'Iniciar'}</Button>
        </div>
      ))}
    </div>
  );
}
