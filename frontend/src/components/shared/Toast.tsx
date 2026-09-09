'use client';
import { create } from 'zustand';
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

interface ToastStore {
  toasts: Toast[];
  show: (message: string, type?: Toast['type']) => void;
  remove: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, type = 'info') => {
    const id = Date.now().toString();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const icons = { success: CheckCircle, error: XCircle, info: AlertCircle };
const colors = { success: 'var(--color-success)', error: 'var(--color-error)', info: 'var(--color-primary)' };

export default function ToastContainer() {
  const { toasts, remove } = useToast();
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(({ id, message, type }) => {
        const Icon = icons[type];
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--color-surface)', border: `1px solid ${colors[type]}`, borderRadius: 'var(--radius-md)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', minWidth: 260, maxWidth: 380, animation: 'slideIn 0.2s ease' }}>
            <Icon size={16} color={colors[type]} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--color-text)' }}>{message}</span>
            <button onClick={() => remove(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 2 }}>
              <X size={13} />
            </button>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
