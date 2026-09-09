'use client';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useChatStore } from '../../../src/store/chatStore';

const actions = [
  { icon: '📄', title: 'Summarize Document', desc: 'Get a concise summary of any PDF or Word file', prompt: 'Please summarize this document for me.' },
  { icon: '🔍', title: 'Extract Key Points', desc: 'Pull out the most important information', prompt: 'Extract the key points from this document.' },
  { icon: '❓', title: 'Q&A on Document', desc: 'Ask questions about the content of a file', prompt: 'I have a document I want to ask questions about.' },
  { icon: '📊', title: 'Analyze Data', desc: 'Understand tables, charts, and structured data', prompt: 'Analyze the data in this document.' },
  { icon: '✍️', title: 'Rewrite & Improve', desc: 'Improve clarity, tone, and structure', prompt: 'Help me rewrite and improve this document.' },
  { icon: '🌐', title: 'Translate Document', desc: 'Translate document content to another language', prompt: 'Translate this document for me.' },
];

export default function DocumentsPage() {
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
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>📄 Documents</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Upload PDFs, Word files, or text documents and let AI analyze, summarize, and answer questions about them.</p>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 32, fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            Tip — upload a file using the paperclip icon in any chat, then ask questions about it.
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
