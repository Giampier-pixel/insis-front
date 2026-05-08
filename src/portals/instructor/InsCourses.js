'use client';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { C } from '@/lib/palette';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import api from '@/lib/api';

/* ─── Question Editor ─── */
function QuestionEditor({ quiz, onBack }) {
  const [form, setForm] = useState({ text: '', type: 'SINGLE', options: [{ text: '', is_correct: false }, { text: '', is_correct: false }] });
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [loadingQ, setLoadingQ] = useState(true);

  useState(() => {
    api.get(`/quizzes/${quiz.id}/questions/`).then(r => {
      setQuestions(r.data?.results || r.data || []);
      setLoadingQ(false);
    }).catch(() => setLoadingQ(false));
  }, [quiz.id]);

  const addOption = () => setForm(f => ({ ...f, options: [...f.options, { text: '', is_correct: false }] }));
  const removeOption = (i) => setForm(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));
  const setOption = (i, key, val) => setForm(f => {
    const opts = [...f.options];
    if (key === 'is_correct' && f.type === 'SINGLE') opts.forEach((o, idx) => opts[idx] = { ...o, is_correct: false });
    opts[i] = { ...opts[i], [key]: val };
    return { ...f, options: opts };
  });

  const save = async () => {
    if (!form.text || form.options.some(o => !o.text)) { alert('Completa el texto de la pregunta y todas las opciones.'); return; }
    if (!form.options.some(o => o.is_correct)) { alert('Marca al menos una opción como correcta.'); return; }
    setSaving(true);
    try {
      await api.post(`/quizzes/${quiz.id}/questions/`, { ...form, order: (questions?.length || 0) + 1 });
      const r = await api.get(`/quizzes/${quiz.id}/questions/`);
      setQuestions(r.data?.results || r.data || []);
      setForm({ text: '', type: 'SINGLE', options: [{ text: '', is_correct: false }, { text: '', is_correct: false }] });
    } catch (e) { alert(e?.response?.data?.detail || 'Error al guardar.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack} style={{ fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>← Volver a quizzes</button>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>Preguntas — {quiz.title}</div>

      {/* Existing questions */}
      {loadingQ ? <Spinner /> : questions?.length === 0 ? (
        <div style={{ fontSize: 13, color: C.t3 }}>Aún no hay preguntas. Agrega la primera abajo.</div>
      ) : questions?.map((q, i) => (
        <div key={q.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8 }}>{i + 1}. {q.text}</div>
          {q.options?.map(o => (
            <div key={o.id} style={{ fontSize: 12, color: o.is_correct ? C.success : C.t3, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span>{o.is_correct ? '✓' : '○'}</span> {o.text}
            </div>
          ))}
        </div>
      ))}

      {/* New question form */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 14 }}>Nueva pregunta</div>
        <Input label="Pregunta *" value={form.text} onChange={v => setForm(f => ({ ...f, text: v }))} placeholder="Escribe la pregunta…" />
        <div style={{ marginTop: 12, marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.t2, display: 'block', marginBottom: 6 }}>Tipo</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: C.t1, background: '#fff' }}>
            <option value="SINGLE">Una sola respuesta</option>
            <option value="MULTIPLE">Múltiple respuesta</option>
            <option value="TRUE_FALSE">Verdadero / Falso</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
          {form.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type={form.type === 'MULTIPLE' ? 'checkbox' : 'radio'} checked={opt.is_correct} onChange={e => setOption(i, 'is_correct', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: C.accent, flexShrink: 0 }} />
              <input value={opt.text} onChange={e => setOption(i, 'text', e.target.value)} placeholder={`Opción ${i + 1}`}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 13, color: C.t1 }} />
              {form.options.length > 2 && (
                <button onClick={() => removeOption(i)} style={{ color: C.danger, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={addOption}>+ Opción</Button>
          <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar pregunta'}</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Quiz Editor ─── */
function QuizEditor({ course, onBack }) {
  const { data, loading, refetch } = useApi(`/courses/${course.slug}/quizzes/`);
  const quizzes = data?.results || data || [];
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', passing_score: '60' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editQuiz) {
        await api.patch(`/quizzes/${editQuiz.id}/`, { title: form.title, description: form.description, passing_score: parseFloat(form.passing_score) });
      } else {
        await api.post('/quizzes/', { course: course.id, title: form.title, description: form.description, passing_score: parseFloat(form.passing_score) });
      }
      setShowModal(false); setEditQuiz(null); setForm({ title: '', description: '', passing_score: '60' });
      refetch();
    } catch (e) { alert(e?.response?.data?.detail || 'Error al guardar.'); }
    finally { setSaving(false); }
  };

  const deleteQuiz = async (id) => {
    if (!confirm('¿Eliminar este quiz?')) return;
    try { await api.patch(`/quizzes/${id}/`, { is_active: false }); refetch(); } catch { alert('Error.'); }
  };

  if (activeQuiz) return <QuestionEditor quiz={activeQuiz} onBack={() => setActiveQuiz(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBack} style={{ fontSize: 12, color: C.t3, background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>← Volver a cursos</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>Quizzes — {course.title}</div>
        <Button onClick={() => { setEditQuiz(null); setForm({ title: '', description: '', passing_score: '60' }); setShowModal(true); }}>+ Nuevo Quiz</Button>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
        : quizzes.length === 0 ? <EmptyState title="Sin quizzes" message="Crea el primer quiz para este curso." />
        : quizzes.map(q => (
          <div key={q.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{q.title}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                {q.question_count || 0} preguntas · Mínimo {parseFloat(q.passing_score).toFixed(0)}% para aprobar
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="ghost" size="sm" onClick={() => setActiveQuiz(q)}>Preguntas</Button>
              <Button variant="ghost" size="sm" onClick={() => { setEditQuiz(q); setForm({ title: q.title, description: q.description || '', passing_score: String(q.passing_score) }); setShowModal(true); }}>Editar</Button>
              <Button variant="danger" size="sm" onClick={() => deleteQuiz(q.id)}>×</Button>
            </div>
          </div>
        ))}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditQuiz(null); }} title={editQuiz ? 'Editar quiz' : 'Nuevo quiz'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Título *" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Nombre del quiz" />
          <Input label="Descripción" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Opcional" />
          <Input label="Nota mínima (%)" value={form.passing_score} onChange={v => setForm(f => ({ ...f, passing_score: v }))} placeholder="60" type="number" />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => { setShowModal(false); setEditQuiz(null); }}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : editQuiz ? 'Guardar' : 'Crear'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Instructor Courses (main) ─── */
export default function InsCourses() {
  const { data, loading, refetch } = useApi('/courses/');
  const courses = (data?.results || data || []).filter(c => c.instructor);
  const [selectedCourse, setSelected] = useState(null);

  if (selectedCourse) return <QuizEditor course={selectedCourse} onBack={() => setSelected(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 13, color: C.t3 }}>
        <span style={{ fontWeight: 600, color: C.t1 }}>{courses.length}</span> curso{courses.length !== 1 ? 's' : ''} asignados
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
        : courses.length === 0 ? <EmptyState title="Sin cursos" message="Aún no tienes cursos asignados. Contacta al administrador." />
        : courses.map(c => (
          <div key={c.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.is_published ? C.success : C.warning, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: C.t3 }}>
                {c.quiz_count || 0} quizzes · {(c.enrolled_count || 0).toLocaleString()} estudiantes inscritos
              </div>
            </div>
            <Badge label={c.is_published ? 'Publicado' : 'Borrador'} variant={c.is_published ? 'success' : 'warning'} />
            <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>Quizzes</Button>
          </div>
        ))}
    </div>
  );
}
