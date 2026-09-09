'use client';

import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useChatStore } from '../../../../src/store/chatStore';
import Sidebar from '../../../../src/components/sidebar/Sidebar';
import MessageBubble from '../../../../src/components/chat/MessageBubble';
import InputBox from '../../../../src/components/chat/InputBox';
import { SkeletonMessage } from '../../../../src/components/shared/Skeleton';
import { Download, Plus } from 'lucide-react';
import Logo from '../../../../src/components/shared/Logo';

function exportMarkdown(messages: any[], title: string) {
  const md = messages.map((m) => `**${m.role === 'user' ? 'You' : 'AI'}:**\n${m.content}`).join('\n\n---\n\n');
  const blob = new Blob([`# ${title}\n\n${md}`], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
  a.click();
}

const EMPTY_PROMPTS = [
  { icon: '💡', text: 'Brainstorm a startup idea' },
  { icon: '🐛', text: 'Debug my code' },
  { icon: '🔎', text: 'Research a topic' },
  { icon: '📚', text: 'Help me study' },
];

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { messages, loading, sending, error, clearError, loadConversation, sendMessage, newConversation, conversations } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef(false);
  const loadedRef = useRef(false);
  const conv = conversations.find((c) => c.id === id);

  useEffect(() => {
    if (id) loadConversation(id).then(() => { loadedRef.current = true; });
  }, [id]);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt && !autoSentRef.current && !loading && loadedRef.current) {
      autoSentRef.current = true;
      sendMessage(prompt);
    }
  }, [id, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keyboard shortcut: Ctrl+K = new chat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        newConversation().then((newId) => router.push(`/app/chat/${newId}`));
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--color-border)', flexShrink: 0, minHeight: 48 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
            {conv?.title && conv.title !== 'New Chat' ? conv.title : ''}
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => newConversation().then((newId) => router.push(`/app/chat/${newId}`))}
              title="New chat (Ctrl+K)"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer' }}>
              <Plus size={13} /> New <kbd style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }}>⌘K</kbd>
            </button>
            {messages.length > 0 && (
              <button onClick={() => exportMarkdown(messages, conv?.title || 'Chat')}
                title="Export as Markdown"
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer' }}>
                <Download size={13} /> Export
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 24 }} className="page-enter">
          {loading && (
            <>
              <SkeletonMessage />
              <SkeletonMessage isUser />
              <SkeletonMessage />
            </>
          )}
          {!loading && messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%', padding: 24 }}>
              <Logo size={48} showText={false} />
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>What can I help you with?</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 32 }}>Ask anything, upload a file, or pick a suggestion below.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 500 }} className="stagger-children">
                {EMPTY_PROMPTS.map(({ icon, text }) => (
                  <button key={text} onClick={() => sendMessage(text)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', fontSize: 13, color: 'var(--color-text)', cursor: 'pointer' }}>
                    {icon} {text}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content}
              sources={msg.metadata?.sources} imageData={msg.metadata?.imageData}
              filePreview={msg.filePreview} fileName={msg.fileName} />
          ))}
          {sending && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ display: 'flex', gap: 4, padding: '12px 16px', background: 'var(--color-surface)', borderRadius: '16px 16px 16px 4px', width: 'fit-content', border: '1px solid var(--color-border)' }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 7, height: 7, background: 'var(--color-primary-light)', borderRadius: '50%', display: 'inline-block', animation: `wave 1.1s ease-in-out ${i * 0.18}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <InputBox onSend={(message, fileId, filePreview, fileName) => sendMessage(message, fileId, undefined, filePreview, fileName)} disabled={sending} />

        {error && (
          <div style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-error)', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontSize: 13, zIndex: 100, display: 'flex', alignItems: 'center', gap: 10 }}>
            {error}
            <button onClick={clearError} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        )}
      </main>
      <style>{`@keyframes wave { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }`}</style>
    </div>
  );
}
