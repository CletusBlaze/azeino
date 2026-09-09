'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useChatStore } from '../../../src/store/chatStore';
import { Sparkles, ImageIcon } from 'lucide-react';

const styles = [
  { label: 'Photorealistic', suffix: ', photorealistic, 8k, detailed' },
  { label: 'Digital Art', suffix: ', digital art, vibrant colors, artstation' },
  { label: 'Oil Painting', suffix: ', oil painting, classical art style' },
  { label: 'Anime', suffix: ', anime style, studio ghibli inspired' },
  { label: 'Minimalist', suffix: ', minimalist, clean, simple' },
  { label: 'Cinematic', suffix: ', cinematic, dramatic lighting, film still' },
];

const examples = [
  'A futuristic city at night with neon lights reflecting on wet streets',
  'A serene mountain lake at sunrise with mist over the water',
  'A cozy coffee shop interior with warm lighting and books',
  'An astronaut floating in space with Earth in the background',
];

export default function ImagesPage() {
  const router = useRouter();
  const { newConversation } = useChatStore();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const fullPrompt = `/image ${prompt.trim()}${selectedStyle}`;
    const id = await newConversation();
    router.push(`/app/chat/${id}?prompt=${encodeURIComponent(fullPrompt)}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="app-main" style={{ flex: 1, overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🎨 Image Generation</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Describe what you want to create and let AI generate it for you.</p>
          </div>

          {/* Prompt input */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Describe your image</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A majestic dragon flying over a medieval castle at sunset..."
              rows={4}
              style={{ width: '100%', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', color: 'var(--color-text)', fontSize: 14, resize: 'none', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' }}
            />

            {/* Style selector */}
            <div style={{ marginTop: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Style (optional)</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {styles.map(({ label, suffix }) => (
                  <button key={label} onClick={() => setSelectedStyle(selectedStyle === suffix ? '' : suffix)}
                    style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: '1px solid', borderColor: selectedStyle === suffix ? 'var(--color-primary)' : 'var(--color-border)', background: selectedStyle === suffix ? 'rgba(99,102,241,0.15)' : 'transparent', color: selectedStyle === suffix ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'all 0.15s' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!prompt.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600, cursor: prompt.trim() ? 'pointer' : 'not-allowed', opacity: prompt.trim() ? 1 : 0.5 }}>
              <Sparkles size={16} /> Generate Image
            </button>
          </div>

          {/* Examples */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Try an example</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {examples.map((ex) => (
                <button key={ex} onClick={() => setPrompt(ex)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left' }}
                  className="card-hover">
                  <ImageIcon size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{ex}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
