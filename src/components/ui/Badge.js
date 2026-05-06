'use client';
import { C } from '@/lib/palette';
const presets = { success: { color: C.success, bg: '#ECFDF5' }, warning: { color: C.warning, bg: '#FFFBEB' }, danger: { color: C.danger, bg: '#FEF2F2' }, info: { color: C.info, bg: '#F0F9FF' }, default: { color: C.t2, bg: '#F1F5F9' }, accent: { color: C.accent, bg: '#F0F7F4' } };
export default function Badge({ label, variant = 'default', color, style: s }) {
  const p = presets[variant] || presets.default;
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: p.bg, color: color || p.color, ...s }}>{label}</span>;
}
