'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { api } from '../../../src/services/api';
import { useToast } from '../../../src/components/shared/Toast';
import Modal from '../../../src/components/shared/Modal';
import { Skeleton } from '../../../src/components/shared/Skeleton';
import { FileText, Image, Trash2, File, FolderOpen } from 'lucide-react';

interface FileRecord { id: string; file_name: string; file_type: string; file_size: number; created_at: string; }

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <Image size={18} color="var(--color-cyan)" />;
  if (type.includes('pdf') || type.includes('document')) return <FileText size={18} color="var(--color-primary)" />;
  return <File size={18} color="var(--color-text-muted)" />;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { show } = useToast();

  useEffect(() => {
    api.getFiles().then(setFiles).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    await api.deleteFile(deleteId);
    setFiles((prev) => prev.filter((f) => f.id !== deleteId));
    setDeleteId(null);
    show('File deleted', 'success');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }} className="page-enter">
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <FolderOpen size={22} color="var(--color-primary)" />
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Files</h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 32 }}>All files you've uploaded across conversations.</p>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3].map((i) => <Skeleton key={i} height={64} radius={10} />)}
            </div>
          )}

          {!loading && files.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No files yet</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Upload images or documents in any chat and they'll appear here.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {files.map((f) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                <FileIcon type={f.file_type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.file_name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{f.file_type} · {formatSize(f.file_size)} · {new Date(f.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setDeleteId(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4, flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete File">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Are you sure you want to delete this file? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ padding: '9px 18px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer', color: 'var(--color-text)' }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding: '9px 18px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
