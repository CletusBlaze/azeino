'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Paperclip, Send, X, Mic, MicOff } from 'lucide-react';
import { api } from '../../services/api';

interface InputBoxProps {
  onSend: (message: string, fileId?: string, filePreview?: string, fileName?: string) => void;
  disabled?: boolean;
}

const SLASH_COMMANDS = [
  { cmd: '/search', desc: 'Search the web', hint: 'search' },
  { cmd: '/image', desc: 'Generate an image', hint: 'imageGen' },
  { cmd: '/code', desc: 'Code assistant', hint: 'code' },
  { cmd: '/study', desc: 'Study tutor', hint: 'study' },
  { cmd: '/brainstorm', desc: 'Brainstorm ideas', hint: 'brainstorm' },
  { cmd: '/document', desc: 'Analyze a document', hint: 'document' },
];

export default function InputBox({ onSend, disabled }: InputBoxProps) {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ id: string; name: string; preview?: string; isImage?: boolean } | null>(null);
  const [slashMenu, setSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [slashIndex, setSlashIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const filteredCmds = SLASH_COMMANDS.filter((c) => c.cmd.includes(slashFilter));

  useEffect(() => {
    if (slashIndex >= filteredCmds.length) setSlashIndex(0);
  }, [filteredCmds.length]);

  const handleChange = (val: string) => {
    setMessage(val);
    if (val.startsWith('/') && !val.includes(' ')) {
      setSlashMenu(true);
      setSlashFilter(val);
    } else {
      setSlashMenu(false);
    }
  };

  const applyCommand = (cmd: typeof SLASH_COMMANDS[0]) => {
    setMessage('');
    setSlashMenu(false);
    // Store hint in a data attr on the textarea for the send handler
    if (textareaRef.current) textareaRef.current.dataset.hint = cmd.hint;
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!message.trim() && !uploadedFile) return;
    const hint = textareaRef.current?.dataset.hint;
    if (textareaRef.current) delete textareaRef.current.dataset.hint;
    onSend(message.trim(), uploadedFile?.id, uploadedFile?.preview, uploadedFile?.name);
    setMessage('');
    setUploadedFile(null);
    setSlashMenu(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashMenu) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIndex((i) => (i + 1) % filteredCmds.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIndex((i) => (i - 1 + filteredCmds.length) % filteredCmds.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); if (filteredCmds[slashIndex]) applyCommand(filteredCmds[slashIndex]); return; }
      if (e.key === 'Escape') { setSlashMenu(false); return; }
    }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const isImage = file.type.startsWith('image/');
      let preview: string | undefined;
      if (isImage) {
        preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      const data = await api.uploadFile(file);
      setUploadedFile({ id: data.id, name: file.name, preview, isImage });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input is not supported in this browser. Try Chrome.'); return; }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    let finalTranscript = message;
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) { finalTranscript += (finalTranscript ? ' ' : '') + t; }
        else { interim = t; }
      }
      setMessage(finalTranscript + (interim ? ' ' + interim : ''));
    };
    rec.onerror = (e: any) => {
      console.error('Speech error:', e.error);
      setListening(false);
    };
    rec.onend = () => {
      setMessage(finalTranscript);
      setListening(false);
    };
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <div style={{ padding: '12px 16px 20px', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', position: 'relative' }}>
      {/* Slash command menu */}
      {slashMenu && filteredCmds.length > 0 && (
        <div style={{ position: 'absolute', bottom: '100%', left: 16, right: 16, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 -4px 20px rgba(0,0,0,0.3)', marginBottom: 4 }}>
          {filteredCmds.map((c, i) => (
            <button key={c.cmd} onClick={() => applyCommand(c)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: i === slashIndex ? 'var(--color-surface-2)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{c.cmd}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* File preview */}
      {uploadedFile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '6px 10px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
          {uploadedFile.isImage && uploadedFile.preview ? (
            <img src={uploadedFile.preview} alt="preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
          ) : (
            <Paperclip size={13} color="var(--color-primary)" />
          )}
          <span style={{ fontSize: 12, color: 'var(--color-text)' }}>{uploadedFile.name}</span>
          <button onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Input area */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '8px 12px' }}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... or type / for commands"
          disabled={disabled}
          rows={1}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text)', fontSize: 14, resize: 'none', maxHeight: 160, lineHeight: 1.5, padding: '4px 0' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx,.txt" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} title="Upload file"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 4 }}>
            <Paperclip size={18} />
          </button>
          <button onClick={toggleVoice} title={listening ? 'Stop listening' : 'Voice input'}
            style={{ background: listening ? 'rgba(239,68,68,0.12)' : 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: listening ? 'var(--color-error)' : 'var(--color-text-muted)', display: 'flex', padding: 4, animation: listening ? 'pulse 1.2s ease-in-out infinite' : 'none' }}>
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button onClick={handleSend} disabled={disabled || (!message.trim() && !uploadedFile)}
            style={{ background: 'var(--color-primary)', border: 'none', borderRadius: 8, padding: '7px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: disabled || (!message.trim() && !uploadedFile) ? 0.5 : 1 }}>
            <Send size={16} color="#fff" />
          </button>
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, textAlign: 'center' }}>
        Type <span style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>/</span> for commands · Shift+Enter for new line
      </p>
    </div>
  );
}
