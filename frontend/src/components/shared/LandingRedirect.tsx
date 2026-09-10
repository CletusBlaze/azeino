'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function LandingRedirect() {
  const router = useRouter();
  const { init } = useAuthStore();

  useEffect(() => {
    init().then(() => {
      const { user } = useAuthStore.getState();
      if (user) router.replace('/app/explore');
    });
  }, []);

  return null;
}
