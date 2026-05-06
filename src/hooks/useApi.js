'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useApi(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!url) return;
    setLoading(true); setError(null);
    try {
      const { data: d } = await api.get(url);
      setData(d);
    } catch (e) {
      setError(e?.response?.data || e.message);
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
