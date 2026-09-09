'use client';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useChatStore } from '../../../src/store/chatStore';

const actions = [
  { icon: '🐛', title: 'Debug Code', desc: 'Paste your code and get the bug fixed', prompt: 'Help me debug my code.' },
  { icon: '✨', title: 'Generate Code', desc: 'Describe what you need and get working code', prompt: 'Generate code for me.' },
  { icon: '📖', title: 'Explain Code', desc: 'Understand what any piece of code does', prompt: 'Explain this code to me.' },
  { icon: '♻️', title: 'Refactor', desc: 'Improve code quality and readability', prompt: 'Help me refactor my code.' },
  { icon: '🔄', title: 'Convert Code', desc: 'Translate code between languages or frameworks', prompt: 'Help me convert my code to another language.' },
  { icon: '⚡', title: 'Optimize', desc: 'Make your code faster and more efficient', prompt: 'Help me optimize my code for better performance.' },
];

export default function CodePage() {
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
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>💻 Code</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Your AI-powered software engineering assistant. Debug, generate, explain, and optimize code.</p>
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
