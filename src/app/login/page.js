'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { C } from '@/lib/palette';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Completa todos los campos.'); return; }
    setLoading(true); setError('');
    try {
      const me = await login(email, password);
      const role = me.role;
      if (role === 'INSTRUCTOR') router.replace('/dashboard?portal=instructor');
      else if (role === 'HR_MANAGER' || role === 'ADMIN') router.replace('/dashboard?portal=hr');
      else router.replace('/dashboard?portal=student');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Credenciales incorrectas.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: 24 }}>
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '40px 44px', width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.accent, letterSpacing: '-0.03em' }}>INSIS</div>
          <div style={{ fontSize: 12, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 4 }}>Learning Platform</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@empresa.com" required
              style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: `1px solid ${error ? C.danger : '#E2E8F0'}`, fontSize: 13, color: C.t1, outline: 'none', transition: 'border-color .15s' }}
              onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: `1px solid ${error ? C.danger : '#E2E8F0'}`, fontSize: 13, color: C.t1, outline: 'none', transition: 'border-color .15s' }}
              onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.danger }}>{error}</div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', borderRadius: 8, background: loading ? C.t3 : C.accent, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .15s', marginTop: 4 }}>
            {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: C.t3 }}>
          ¿No tienes cuenta? Contacta a tu administrador.
        </div>
      </div>
    </div>
  );
}
