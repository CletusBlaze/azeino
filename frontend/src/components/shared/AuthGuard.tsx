'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, init } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 8, height: 8, background: 'var(--color-primary)', borderRadius: '50%', display: 'inline-block', animation: `wave 1.1s ease-in-out ${i * 0.18}s infinite` }} />
          ))}
        </div>
        <style>{`@keyframes wave { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
