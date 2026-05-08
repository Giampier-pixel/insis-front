'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { setTokens, clearTokens, getToken } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!getToken()) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me/');
      setUser(data);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_name', data.full_name || data.email);
    } catch {
      clearTokens();
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login/', { email, password });
    setTokens(data.access, data.refresh);
    // Save role from login response (faster than extra /me/ call)
    if (data.role) localStorage.setItem('user_role', data.role);
    const { data: me } = await api.get('/auth/me/');
    setUser(me);
    localStorage.setItem('user_role', me.role);
    localStorage.setItem('user_name', me.full_name || me.email);
    return me;
  };

  const logout = async () => {
    try { await api.post('/auth/logout/', { refresh: localStorage.getItem('refresh_token') }); } catch {}
    clearTokens();
    setUser(null);
  };

  return { user, role: user?.role, loading, login, logout };
}
