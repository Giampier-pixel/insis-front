'use client';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401 (skip logout and token-refresh endpoints to avoid loops)
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const url = error.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/logout/') || url.includes('/auth/token/refresh/') || url.includes('/auth/login/');
    if (error.response?.status === 401 && !error.config._retry && !isAuthEndpoint) {
      error.config._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('no refresh token');
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/token/refresh/`,
          { refresh }
        );
        localStorage.setItem('access_token', data.access);
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
        error.config.headers.Authorization = `Bearer ${data.access}`;
        return api(error.config);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
