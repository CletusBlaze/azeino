'use client';
import Sidebar from '../../../src/components/sidebar/Sidebar';

export default function CreatePage() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 48 }}>🎨</span>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Image Studio</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Coming in Stage 4 — generate and edit images with conversation.</p>
      </main>
    </div>
  );
}
