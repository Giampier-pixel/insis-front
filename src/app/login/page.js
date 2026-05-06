'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { C } from '@/lib/palette';
import api from '@/lib/api';

function inputStyle(hasError) {
  return {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: `1px solid ${hasError ? C.danger : '#E2E8F0'}`,
    fontSize: 13, color: C.t1, outline: 'none', transition: 'border-color .15s',
  };
}

function onFocusStyle(e) {
  e.target.style.borderColor = C.accent;
  e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`;
}
function onBlurStyle(e) {
  e.target.style.borderColor = '#E2E8F0';
  e.target.style.boxShadow = 'none';
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  // Login form
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regName, setRegName]       = useState('');
  const [regEmail, setRegEmail]     = useState('');
  const [regPass, setRegPass]       = useState('');
  const [regPass2, setRegPass2]     = useState('');
  const [regError, setRegError]     = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setLoginError('Completa todos los campos.'); return; }
    setLoginLoading(true); setLoginError('');
    try {
      const me = await login(email, password);
      if (me.role === 'ADMIN')        router.replace('/dashboard?portal=admin');
      else if (me.role === 'INSTRUCTOR')   router.replace('/dashboard?portal=instructor');
      else if (me.role === 'HR_MANAGER')   router.replace('/dashboard?portal=hr');
      else                                 router.replace('/dashboard?portal=student');
    } catch (err) {
      setLoginError(err?.response?.data?.detail || 'Credenciales incorrectas.');
    } finally { setLoginLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) { setRegError('Todos los campos son requeridos.'); return; }
    if (regPass !== regPass2)               { setRegError('Las contraseñas no coinciden.'); return; }
    if (regPass.length < 8)                 { setRegError('La contraseña debe tener al menos 8 caracteres.'); return; }
    setRegLoading(true); setRegError(''); setRegSuccess('');
    try {
      await api.post('/auth/register/', { full_name: regName, email: regEmail, password: regPass });
      setRegSuccess('¡Cuenta creada! Ahora puedes iniciar sesión.');
      setRegName(''); setRegEmail(''); setRegPass(''); setRegPass2('');
      setTimeout(() => { setTab('login'); setRegSuccess(''); }, 2500);
    } catch (err) {
      const d = err?.response?.data;
      setRegError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Error al crear la cuenta.');
    } finally { setRegLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: 24 }}>
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', width: '100%', maxWidth: 420, overflow: 'hidden' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', padding: '32px 44px 24px' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.accent, letterSpacing: '-0.03em' }}>INSIS</div>
          <div style={{ fontSize: 12, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 4 }}>Learning Platform</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', margin: '0 44px' }}>
          {[['login','Iniciar sesión'], ['register','Registrarse']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
              color: tab === id ? C.accent : C.t3,
              borderBottom: `2px solid ${tab === id ? C.accent : 'transparent'}`,
              background: 'none', border: 'none', borderBottomStyle: 'solid',
              borderBottomWidth: 2, borderBottomColor: tab === id ? C.accent : 'transparent',
              cursor: 'pointer', transition: 'all .15s', marginBottom: -1,
            }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px 44px 36px' }}>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com" required
                  style={inputStyle(!!loginError)} onFocus={onFocusStyle} onBlur={onBlurStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={inputStyle(!!loginError)} onFocus={onFocusStyle} onBlur={onBlurStyle} />
              </div>
              {loginError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.danger }}>{loginError}</div>
              )}
              <button type="submit" disabled={loginLoading} style={{
                width: '100%', padding: '12px', borderRadius: 8, marginTop: 4,
                background: loginLoading ? C.t3 : C.accent, color: '#fff',
                fontSize: 14, fontWeight: 600, border: 'none', cursor: loginLoading ? 'not-allowed' : 'pointer',
              }}>
                {loginLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
              </button>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#F0F7F4', border: '1px solid #A7D4C0', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: C.accent }}>
                ℹ️ Las cuentas creadas aquí son de tipo <strong>Estudiante</strong>. Para otros roles, contacta al administrador.
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Nombre completo *</label>
                <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Ana García" required
                  style={inputStyle(!!regError)} onFocus={onFocusStyle} onBlur={onBlurStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Email *</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="ana@empresa.com" required
                  style={inputStyle(!!regError)} onFocus={onFocusStyle} onBlur={onBlurStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Contraseña *</label>
                <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Mínimo 8 caracteres" required
                  style={inputStyle(!!regError)} onFocus={onFocusStyle} onBlur={onBlurStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.t2, marginBottom: 5 }}>Confirmar contraseña *</label>
                <input type="password" value={regPass2} onChange={e => setRegPass2(e.target.value)} placeholder="Repite la contraseña" required
                  style={inputStyle(!!regError)} onFocus={onFocusStyle} onBlur={onBlurStyle} />
              </div>
              {regError   && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.danger }}>{regError}</div>}
              {regSuccess && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.success }}>{regSuccess}</div>}
              <button type="submit" disabled={regLoading} style={{
                width: '100%', padding: '12px', borderRadius: 8, marginTop: 4,
                background: regLoading ? C.t3 : C.accent, color: '#fff',
                fontSize: 14, fontWeight: 600, border: 'none', cursor: regLoading ? 'not-allowed' : 'pointer',
              }}>
                {regLoading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
