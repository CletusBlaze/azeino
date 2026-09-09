'use client';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useChatStore } from '../../../src/store/chatStore';

const actions = [
  { icon: '💡', title: 'Brainstorm Ideas', desc: 'Generate and explore ideas for any topic or problem', prompt: 'Help me brainstorm ideas.' },
  { icon: '📊', title: 'SWOT Analysis', desc: 'Analyze strengths, weaknesses, opportunities, and threats', prompt: 'Help me do a SWOT analysis for my business or idea.' },
  { icon: '🚀', title: 'Validate a Startup', desc: 'Check if your business idea has real potential', prompt: 'Help me validate my startup idea.' },
  { icon: '📋', title: 'Business Plan', desc: 'Build a structured plan for your business', prompt: 'Help me create a business plan.' },
  { icon: '🎯', title: 'Go-to-Market Strategy', desc: 'Plan how to launch and reach your target audience', prompt: 'Help me build a go-to-market strategy.' },
  { icon: '💰', title: 'Revenue Model', desc: 'Explore how your business can make money', prompt: 'Help me figure out the best revenue model for my business.' },
];

export default function BrainstormPage() {
  const router = useRouter();
  const { newConversation } = useChatStore();

  const handleAction = async (prompt: string) => {
    const id = await newConversation();
    router.push(`/app/chat/${id}?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="app-main" style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>💡 Brainstorm</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Your AI-powered business and creative thinking partner. Validate ideas, plan strategies, and build your vision.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }} className="stagger-children">
            {actions.map(({ icon, title, desc, prompt }) => (
              <button key={title} onClick={() => handleAction(prompt)}
                className="card-hover"
                style={{ textAlign: 'left', padding: 24, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
