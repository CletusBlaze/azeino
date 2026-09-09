'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { api } from '../../../src/services/api';
import { useToast } from '../../../src/components/shared/Toast';
import Modal from '../../../src/components/shared/Modal';
import { Skeleton } from '../../../src/components/shared/Skeleton';
import { Trash2, Brain } from 'lucide-react';

interface Memory { id: string; content: string; memory_type: string; created_at: string; }

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.getMemory().then(setMemories).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    await api.deleteMemory(deleteId);
    setMemories((prev) => prev.filter((m) => m.id !== deleteId));
    setDeleteId(null);
    show('Memory deleted', 'success');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="app-main page-enter" style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Brain size={22} color="var(--color-primary)" />
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Memory</h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 32 }}>What the AI remembers about you. Delete anything at any time.</p>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map((i) => <Skeleton key={i} height={64} radius={10} />)}
            </div>
          )}

          {!loading && memories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No memories yet</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>As you chat, the AI will remember useful facts about you here.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {memories.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                <div>
                  <p style={{ fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>{m.content}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{m.memory_type} · {new Date(m.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setDeleteId(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4, flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Memory">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Are you sure you want to delete this memory? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ padding: '9px 18px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer', color: 'var(--color-text)' }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding: '9px 18px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
