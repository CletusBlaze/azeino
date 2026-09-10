import { create } from 'zustand';
import { createClient } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  user_metadata?: { display_name?: string };
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem('access_token');
    set({ user: null });
    window.location.href = '/';
  },

  init: async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      localStorage.setItem('access_token', session.access_token);
      set({ user: session.user as User, loading: false });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem('access_token', session.access_token);
        set({ user: session.user as User });
      } else {
        localStorage.removeItem('access_token');
        set({ user: null });
      }
    });
  },
}));
