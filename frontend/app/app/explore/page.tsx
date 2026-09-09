'use client';

import { useRouter } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useChatStore } from '../../../src/store/chatStore';
import { useAuthStore } from '../../../src/store/authStore';

const quickActions = [
  { icon: '💬', label: 'New Chat', href: null, hint: undefined },
  { icon: '🔎', label: 'Research', href: null, hint: 'search' },
  { icon: '💻', label: 'Code', href: '/app/code', hint: undefined },
  { icon: '📚', label: 'Study', href: '/app/study', hint: undefined },
  { icon: '💡', label: 'Brainstorm', href: '/app/brainstorm', hint: undefined },
];

export default function ExplorePage() {
  const router = useRouter();
  const { newConversation } = useChatStore();
  const { user } = useAuthStore();

  const handleAction = async (hint?: string, href?: string | null) => {
    if (href) { router.push(href); return; }
    const id = await newConversation();
    router.push(`/app/chat/${id}${hint ? `?context=${hint}` : ''}`);
  };

  const name = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';


  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Greeting */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{greeting}, {name} 👋</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>What do you want to work on today?</p>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
            {quickActions.map(({ icon, label, href, hint }) => (
              <button key={label} onClick={() => handleAction(hint, href)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontSize: 14, color: 'var(--color-text)', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                <span style={{ fontSize: 18 }}>{icon}</span> {label}
              </button>
            ))}
          </div>


        </div>
      </main>
    </div>
  );
}
