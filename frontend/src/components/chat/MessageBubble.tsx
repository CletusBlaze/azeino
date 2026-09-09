'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ExternalLink, Copy, Check } from 'lucide-react';

interface Source { title: string; url: string; }
interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  imageData?: string;
  filePreview?: string;
  fileName?: string;
}

export default function MessageBubble({ role, content, sources, imageData, filePreview, fileName }: MessageBubbleProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={isUser ? 'msg-user' : 'msg-ai'} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16, padding: '0 16px' }}>
      <div style={{ maxWidth: '75%', minWidth: 60 }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, textAlign: isUser ? 'right' : 'left', fontWeight: 500 }}>
          {isUser ? 'You' : 'AI'}
        </p>
        <div style={{
          background: isUser ? 'var(--color-primary)' : 'var(--color-surface)',
          color: isUser ? '#fff' : 'var(--color-text)',
          padding: '12px 16px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          border: isUser ? 'none' : '1px solid var(--color-border)',
          fontSize: 14, lineHeight: 1.6,
        }}>
          {filePreview && <img src={filePreview} alt={fileName || 'uploaded'} style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginBottom: content ? 8 : 0, display: 'block' }} />}
          {!filePreview && fileName && <div style={{ fontSize: 12, marginBottom: content ? 6 : 0, opacity: 0.8 }}>📎 {fileName}</div>}
          {imageData && <img src={`data:image/png;base64,${imageData}`} alt="Generated" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 8 }} />}
          {isUser ? (
            <p style={{ margin: 0 }}>{content}</p>
          ) : (
            <div className="markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const inline = !match;
                    return inline ? (
                      <code style={{ background: 'var(--color-surface-2)', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: 'var(--color-cyan)', fontFamily: 'monospace' }} {...props}>{children}</code>
                    ) : (
                      <div style={{ position: 'relative', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a2e', padding: '6px 12px', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #333' }}>
                          <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>{match[1]}</span>
                          <CopyCode code={String(children)} />
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, borderRadius: '0 0 8px 8px', fontSize: 13 }}
                          {...props}
                        >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                      </div>
                    );
                  },
                }}
              >{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && (
          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 11, padding: '2px 4px' }}>
            {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
          </button>
        )}

        {sources && sources.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Sources</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-cyan)', background: 'rgba(34,211,238,0.08)', padding: '3px 8px', borderRadius: 20, textDecoration: 'none' }}>
                  <ExternalLink size={10} /> {s.title || s.url}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
      {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
    </button>
  );
}
