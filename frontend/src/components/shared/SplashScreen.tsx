'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (!sessionStorage.getItem('splash_seen')) {
      setVisible(true);
      const t = setTimeout(() => dismiss(), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem('splash_seen', '1');
    setFading(true);
    setTimeout(() => setVisible(false), 400);
  }

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--color-bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 32, padding: 24,
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.4s ease',
        cursor: 'pointer',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, animation: 'fadeUp 0.6s ease both' }}>
        <Logo size={64} />

        <div style={{
          padding: '5px 16px',
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 20, fontSize: 11,
          color: 'var(--color-primary)',
          fontWeight: 500, letterSpacing: '0.08em',
        }}>
          MULTIMODAL AI PLATFORM
        </div>

        <p style={{
          fontSize: 16, color: 'var(--color-text-muted)',
          textAlign: 'center', maxWidth: 300, lineHeight: 1.6,
        }}>
          One AI for almost everything
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280, animation: 'fadeUp 0.6s 0.15s ease both' }}>
        <Link
          href="/auth/signup"
          onClick={e => e.stopPropagation()}
          style={{
            padding: '14px 24px', background: 'var(--color-primary)',
            color: '#fff', borderRadius: 'var(--radius-md)',
            textDecoration: 'none', fontSize: 15, fontWeight: 600,
            textAlign: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.4)',
          }}
        >
          Get Started Free
        </Link>
        <Link
          href="/auth/login"
          onClick={e => e.stopPropagation()}
          style={{
            padding: '14px 24px',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none', fontSize: 15,
            textAlign: 'center',
          }}
        >
          Sign In
        </Link>
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', opacity: 0.5, animation: 'fadeUp 0.6s 0.3s ease both' }}>
        Tap anywhere to continue
      </p>
    </div>
  );
}
