'use client';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useChatStore } from '../../../src/store/chatStore';

const actions = [
  { icon: '🔎', title: 'Research a Topic', desc: 'Get current, cited information on any subject', prompt: '/search Research this topic for me with sources:' },
  { icon: '📰', title: 'Latest News', desc: 'Find the most recent news on any topic', prompt: '/search What is the latest news about' },
  { icon: '⚖️', title: 'Compare Options', desc: 'Research and compare products, services, or ideas', prompt: '/search Compare these options for me with up-to-date information:' },
  { icon: '📈', title: 'Market Research', desc: 'Explore market trends and industry insights', prompt: '/search Give me current market research and trends for:' },
  { icon: '🧪', title: 'Fact Check', desc: 'Verify claims with real sources', prompt: '/search Fact check this claim for me:' },
  { icon: '📚', title: 'Deep Dive', desc: 'Comprehensive research report on any topic', prompt: '/search Write a comprehensive research report on:' },
];

export default function ResearchPage() {
  const router = useRouter();
  const { newConversation } = useChatStore();

  const handleAction = async (prompt: string) => {
    const id = await newConversation();
    router.push(`/app/chat/${id}?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🔎 Research</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Real-time web search with source citations. Get current information on any topic.</p>
          </div>
          <div style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 32, fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            Tip — type <span style={{ color: 'var(--color-cyan)', fontFamily: 'monospace' }}>/search</span> in any chat to trigger web research mode.
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
