'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

/* ─── Quiz Player inline ─── */
function QuizPlayer({ quiz, courseSlug, onBack }) {
  const [questions, setQuestions] = useState(null);
  const [attempt, setAttempt]     = useState(null);
  const [answers, setAnswers]     = useState({});
  const [current, setCurrent]     = useState(0);
  const [result, setResult]       = useState(null);
  const [busy, setBusy]           = useState(false);

  const start = async () => {
    setBusy(true);
    try {
      const [{ data: att }, { data: qz }] = await Promise.all([
        api.post(`/quizzes/${quiz.id}/start/`),
        api.get(`/quizzes/${quiz.id}/`),
      ]);
      setAttempt(att);
      setQuestions(qz.questions || []);
      setCurrent(0);
      setAnswers({});
    } catch (e) {
      alert(e?.response?.data?.detail || 'Error al iniciar');
    } finally { setBusy(false); }
  };

  const submit = async () => {
    setBusy(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([qid, optIds]) => ({
          question_id: parseInt(qid),
          selected_option_ids: Array.isArray(optIds) ? optIds : [optIds],
        })),
      };
      const { data } = await api.post(`/quizzes/${quiz.id}/submit/`, payload);
      setResult(data);
    } catch (e) {
      alert(e?.response?.data?.detail || 'Error al enviar');
    } finally { setBusy(false); }
  };

  const toggleOption = (qid, optId, type) => {
    if (type === 'MULTIPLE') {
      const prev = answers[qid] || [];
      const next = prev.includes(optId) ? prev.filter(x => x !== optId) : [...prev, optId];
      setAnswers({ ...answers, [qid]: next });
    } else {
      setAnswers({ ...answers, [qid]: [optId] });
    }
  };

  /* Result screen */
  if (result) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '40px 52px', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: result.passed ? C.success : C.danger, marginBottom: 6 }}>
          {result.score != null ? `${parseFloat(result.score).toFixed(0)}%` : '—'}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>
          {result.passed ? '¡Aprobado!' : 'No aprobado'}
        </div>
        <div style={{ fontSize: 13, color: C.t3, marginBottom: 24 }}>
          Nota mínima: {parseFloat(quiz.passing_score).toFixed(0)}%
        </div>
        <Button onClick={() => { setResult(null); setAttempt(null); setQuestions(null); }}>Volver al curso</Button>
      </div>
    </div>
  );

  /* Start screen */
  if (!attempt || !questions) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
      <button onClick={onBack} style={{ fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20 }}>← Volver al curso</button>
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px 36px' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>{quiz.title}</div>
        {quiz.description && <div style={{ fontSize: 13, color: C.t3, marginBottom: 16 }}>{quiz.description}</div>}
        <div style={{ fontSize: 12, color: C.t3, marginBottom: 28 }}>
          Nota mínima para aprobar: <strong>{parseFloat(quiz.passing_score).toFixed(0)}%</strong>
        </div>
        <Button onClick={start} disabled={busy}>{busy ? 'Iniciando…' : 'Iniciar Quiz'}</Button>
      </div>
    </div>
  );

  /* Question screen */
  const q = questions[current];
  const qAnswers = answers[q?.id] || [];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{quiz.title}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>Pregunta {current + 1} de {questions.length}</div>
        </div>
        <button onClick={() => { setAttempt(null); setQuestions(null); }} style={{ fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer' }}>Cancelar</button>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${answers[questions[i]?.id]?.length ? C.accent : i === current ? C.t2 : '#E2E8F0'}`, background: answers[questions[i]?.id]?.length ? C.accentLight : i === current ? '#F8FAFC' : '#fff', color: C.t1, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{i + 1}</button>
        ))}
      </div>

      {q && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, lineHeight: 1.55, marginBottom: 20 }}>{q.text}</div>
          {q.type === 'MULTIPLE' && <div style={{ fontSize: 11, color: C.t3, marginBottom: 12 }}>Puedes seleccionar varias opciones</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options?.map(opt => {
              const sel = qAnswers.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleOption(q.id, opt.id, q.type)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${sel ? C.accent : '#E2E8F0'}`, background: sel ? C.accentLight : '#fff', color: sel ? C.accent : C.t2, cursor: 'pointer', textAlign: 'left', fontSize: 13, transition: 'all .15s' }}>
                  <span style={{ width: 18, height: 18, borderRadius: q.type === 'MULTIPLE' ? 4 : '50%', flexShrink: 0, border: `2px solid ${sel ? C.accent : '#CBD5E1'}`, background: sel ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel && <span style={{ width: 8, height: 8, borderRadius: q.type === 'MULTIPLE' ? 2 : '50%', background: '#fff', display: 'block' }} />}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="ghost" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>← Anterior</Button>
        {current < questions.length - 1
          ? <Button onClick={() => setCurrent(current + 1)}>Siguiente →</Button>
          : <Button onClick={submit} disabled={busy} style={{ background: C.success }}>{busy ? 'Enviando…' : 'Enviar Quiz'}</Button>}
      </div>
    </div>
  );
}

/* ─── Course Detail ─── */
function CourseDetail({ course, onBack }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const { data, loading } = useApi(`/courses/${course.slug}/quizzes/`);
  const quizzes = data?.results || data || [];

  if (activeQuiz) return <QuizPlayer quiz={activeQuiz} courseSlug={course.slug} onBack={() => setActiveQuiz(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack} style={{ fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>← Volver al catálogo</button>
      <div style={{ background: C.accent, borderRadius: 14, padding: '24px 28px', color: '#fff' }}>
        <div style={{ fontSize: 12, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Curso</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{course.title}</div>
        {course.description && <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>{course.description}</div>}
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Instructor: {course.instructor?.full_name || '—'}
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Quizzes del curso</div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
      ) : quizzes.length === 0 ? (
        <EmptyState title="Sin quizzes" message="Este curso aún no tiene quizzes disponibles." />
      ) : quizzes.map(q => (
        <div key={q.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{q.title}</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 3 }}>
              {q.question_count || 0} preguntas · Mínimo {parseFloat(q.passing_score).toFixed(0)}% para aprobar
            </div>
          </div>
          <Button size="sm" onClick={() => setActiveQuiz(q)}>Tomar Quiz</Button>
        </div>
      ))}
    </div>
  );
}

/* ─── Course Catalog (main view) ─── */
export default function CourseCatalog() {
  const [search, setSearch]           = useState('');
  const [selectedCourse, setSelected] = useState(null);
  const [enrolling, setEnrolling]     = useState(null);
  const [msg, setMsg]                 = useState('');
  const { data, loading, refetch }    = useApi('/courses/');
  const courses = data?.results || data || [];

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const enroll = async (e, courseId) => {
    e.stopPropagation();
    setEnrolling(courseId);
    try {
      await api.post('/enrollments/', { course: courseId });
      setMsg('¡Inscripción exitosa!');
      refetch();
    } catch (err) {
      setMsg(err?.response?.data?.detail || 'Error al inscribirse.');
    } finally {
      setEnrolling(null);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (selectedCourse) return <CourseDetail course={selectedCourse} onBack={() => setSelected(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
        <span style={{ color: C.t3 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cursos…"
          style={{ flex: 1, border: 'none', fontSize: 13, color: C.t1, background: 'none', outline: 'none' }} />
      </div>

      {msg && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.success }}>{msg}</div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Sin cursos" message="No hay cursos disponibles." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(c => {
            const isEnrolled = c.is_enrolled;
            return (
              <div key={c.id}
                onClick={() => isEnrolled && setSelected(c)}
                style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', cursor: isEnrolled ? 'pointer' : 'default', transition: 'box-shadow .15s' }}
                onMouseEnter={e => { if (isEnrolled) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ height: 80, background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: 32 }}>📚</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 4, lineHeight: 1.4 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: C.t3, marginBottom: 4 }}>
                    {c.instructor?.full_name || 'Instructor'} · {c.quiz_count || 0} quiz{c.quiz_count !== 1 ? 'zes' : ''}
                  </div>
                  {c.description && (
                    <div style={{ fontSize: 11, color: C.t3, marginBottom: 10, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {c.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {isEnrolled ? (
                      <Badge label="✓ Inscrito — clic para entrar" variant="success" />
                    ) : (
                      <Button size="sm" onClick={e => enroll(e, c.id)} disabled={enrolling === c.id}>
                        {enrolling === c.id ? '…' : 'Inscribirse'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
