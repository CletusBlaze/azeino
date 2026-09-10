import Link from 'next/link';
import Logo from '../src/components/shared/Logo';
import LandingRedirect from '../src/components/shared/LandingRedirect';

const capabilities = [
  { icon: '🔎', title: 'Web Research', desc: 'Current information with source citations' },
  { icon: '📄', title: 'Documents', desc: 'Analyze PDFs, Word files, and text documents' },
  { icon: '🖼️', title: 'Vision', desc: 'Understand and analyze images and screenshots' },
  { icon: '💻', title: 'Coding', desc: 'Explain, debug, and generate code' },
  { icon: '📚', title: 'Study', desc: 'Past questions, quizzes, and exam preparation' },
  { icon: '💡', title: 'Brainstorming', desc: 'Idea analysis, planning, and business thinking' },
  { icon: '🧠', title: 'Memory', desc: 'Remembers facts about you across conversations' },
  { icon: '💬', title: 'AI Chat', desc: 'General conversation and reasoning' },
];

const stats = [
  { value: '9+', label: 'AI Capabilities' },
  { value: '1', label: 'Platform' },
  { value: '∞', label: 'Possibilities' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--color-text)' }}>
      <LandingRedirect />
      {/* Nav */}
      <nav className="landing-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'rgba(7,11,20,0.7)', backdropFilter: 'blur(16px)', zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: 'none' }}><Logo size={30} /></Link>
        <div className="landing-nav-links" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ padding: '8px 18px', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 14 }}>Sign In</Link>
          <Link href="/auth/signup" style={{ padding: '8px 18px', background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" style={{ textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', padding: '5px 16px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, fontSize: 12, color: 'var(--color-primary)', marginBottom: 28, fontWeight: 500, letterSpacing: '0.05em' }}>
          MULTIMODAL AI PLATFORM
        </div>
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em' }}>
          One AI for<br />
          <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            almost everything
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.7 }}>
          Chat, research, analyze documents and images, write code, study, and brainstorm — all in one place. No mode switching. Just ask.
        </p>
        <div className="hero-buttons" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
          <Link href="/auth/signup" style={{ padding: '15px 32px', background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: 15, fontWeight: 600, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
            Start for Free
          </Link>
          <Link href="/auth/login" style={{ padding: '15px 32px', background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: 15 }}>
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-row" style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo chat preview */}
      <section className="demo-preview" style={{ padding: '0 48px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>AZEINO Chat</span>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { role: 'user', text: 'Explain how neural networks work and give me a Python example' },
              { role: 'ai', text: 'Neural networks are computational models inspired by the human brain. They consist of layers of interconnected nodes (neurons) that process information...\n\n```python\nimport numpy as np\n\ndef sigmoid(x):\n    return 1 / (1 + np.exp(-x))\n\n# Simple 2-layer neural network\nX = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])\nweights = np.random.randn(2, 1)\noutput = sigmoid(np.dot(X, weights))\n```' },
            ].map(({ role, text }, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', background: role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-2)', borderRadius: role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 13, lineHeight: 1.6, color: role === 'user' ? '#fff' : 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="landing-section" style={{ padding: '60px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Everything in one place</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 48, fontSize: 15 }}>No mode switching. AZEINO detects what you need and routes automatically.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {capabilities.map(({ icon, title, desc }) => (
            <div key={title} style={{ padding: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', transition: 'border-color 0.15s' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta" style={{ textAlign: 'center', padding: '80px 24px', margin: '0 48px 48px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(34,211,238,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Ready to build smarter?</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 36, fontSize: 16 }}>Free to get started. No credit card required.</p>
        <Link href="/auth/signup" style={{ padding: '15px 36px', background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: 16, fontWeight: 600, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 13 }}>
        <Logo size={18} textSize={13} />
      </footer>
    </div>
  );
}
