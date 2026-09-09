'use client';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useChatStore } from '../../../src/store/chatStore';

const actions = [
  { icon: '📝', title: 'Generate Quiz', desc: 'Create multiple choice or short answer questions on any topic', prompt: 'Generate a quiz for me on this topic. Include 10 questions with answers:' },
  { icon: '🃏', title: 'Flashcards', desc: 'Turn any topic or notes into study flashcards', prompt: 'Create flashcards for me on this topic. Format as Q: / A: pairs:' },
  { icon: '📖', title: 'Explain a Topic', desc: 'Get a clear, simple explanation of any concept', prompt: 'Explain this topic to me in a clear and simple way:' },
  { icon: '🗂️', title: 'Past Questions', desc: 'Practice with likely exam questions on a subject', prompt: 'Give me likely past exam questions and answers for this subject:' },
  { icon: '📋', title: 'Study Plan', desc: 'Build a structured study schedule for an exam', prompt: 'Create a detailed study plan for this exam or subject:' },
  { icon: '🧠', title: 'Test My Knowledge', desc: 'Interactive quiz — AI asks, you answer', prompt: 'Test my knowledge on this topic. Ask me questions one at a time and give feedback on my answers:' },
  { icon: '📊', title: 'Summarize Notes', desc: 'Paste your notes and get a clean summary', prompt: 'Summarize these notes for me and highlight the key points:' },
  { icon: '🔗', title: 'Connect Concepts', desc: 'Understand how ideas relate to each other', prompt: 'Help me understand how these concepts connect and relate to each other:' },
];

export default function StudyPage() {
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
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>📚 Study</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Your AI-powered academic tutor. Generate quizzes, flashcards, study plans, and get explanations on anything.</p>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 32, fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            Tip — upload your notes or a PDF using the paperclip icon, then pick an action below.
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
