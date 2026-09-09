'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../../../src/components/sidebar/Sidebar';
import { useAuthStore } from '../../../src/store/authStore';
import { useChatStore } from '../../../src/store/chatStore';
import { createClient } from '../../../src/lib/supabase';
import { api } from '../../../src/services/api';
import { User, Palette, Brain, Shield, ChevronRight, Sparkles, BarChart2 } from 'lucide-react';
import Modal from '../../../src/components/shared/Modal';
import { useToast } from '../../../src/components/shared/Toast';

const TABS = [
  { id: 'general', label: 'General', icon: Palette },
  { id: 'personalization', label: 'Personalization', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'ai', label: 'AI & Memory', icon: Brain },
  { id: 'usage', label: 'Usage', icon: BarChart2 },
  { id: 'data', label: 'Data & Privacy', icon: Shield },
];

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ flex: 1, paddingRight: 24 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 500 }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{desc}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? 'var(--color-primary)' : 'var(--color-surface-2)', border: `1px solid ${on ? 'var(--color-primary)' : 'var(--color-border)'}`, cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 21 : 2, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </button>
  );
}

function Select({ value, options, onChange }: { value: string; options: { val: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ padding: '7px 12px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--color-text)', cursor: 'pointer', outline: 'none' }}>
      {options.map(({ val, label }) => <option key={val} value={val}>{label}</option>)}
    </select>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--color-text)', outline: 'none' };

export default function SettingsPage() {
  const { user, setUser, signOut } = useAuthStore();
  const { conversations, deleteConversation, loadConversations } = useChatStore();
  const [tab, setTab] = useState('general');

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [responseStyle, setResponseStyle] = useState('balanced');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [searchEnabled, setSearchEnabled] = useState(true);

  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Personalization
  const [nickname, setNickname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [aboutYou, setAboutYou] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);
  const [personSaved, setPersonSaved] = useState(false);

  const { show } = useToast();
  const [clearMemoryModal, setClearMemoryModal] = useState(false);
  const [clearChatsModal, setClearChatsModal] = useState(false);
  const [clearingMemory, setClearingMemory] = useState(false);
  const [clearingChats, setClearingChats] = useState(false);
  const [usageData, setUsageData] = useState<{ byCapability: any[]; totalThisMonth: number; totalAllTime: number } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (t) setTheme(t);
    const rs = localStorage.getItem('responseStyle');
    if (rs) setResponseStyle(rs);
    const mem = localStorage.getItem('memoryEnabled');
    if (mem !== null) setMemoryEnabled(mem !== 'false');
    const search = localStorage.getItem('searchEnabled');
    if (search !== null) setSearchEnabled(search !== 'false');
    // Load personalization
    const p = localStorage.getItem('personalization');
    if (p) {
      const parsed = JSON.parse(p);
      setNickname(parsed.nickname || '');
      setOccupation(parsed.occupation || '');
      setAboutYou(parsed.aboutYou || '');
      setCustomInstructions(parsed.customInstructions || '');
      setPersonalizationEnabled(parsed.enabled !== false);
    }
    loadConversations();
    api.getUsage().then(setUsageData).catch(() => {});
  }, []);

  const handleTheme = (t: 'dark' | 'light') => {
    setTheme(t);
    localStorage.setItem('theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  const handleMemory = () => {
    const next = !memoryEnabled;
    setMemoryEnabled(next);
    localStorage.setItem('memoryEnabled', String(next));
  };

  const handleSearch = () => {
    const next = !searchEnabled;
    setSearchEnabled(next);
    localStorage.setItem('searchEnabled', String(next));
  };

  const handleSavePersonalization = () => {
    localStorage.setItem('personalization', JSON.stringify({
      nickname, occupation, aboutYou, customInstructions, enabled: personalizationEnabled,
    }));
    setPersonSaved(true);
    setTimeout(() => setPersonSaved(false), 2000);
  };

  const handleSaveProfile = async () => {
    setSaving(true); setProfileError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({ data: { display_name: displayName } });
      if (error) throw error;
      setUser(data.user as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setProfileError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleClearMemory = async () => {
    setClearingMemory(true);
    try {
      const memories = await api.getMemory();
      await Promise.all(memories.map((m: any) => api.deleteMemory(m.id)));
      show('All memories cleared', 'success');
    } finally { setClearingMemory(false); setClearMemoryModal(false); }
  };

  const handleClearChats = async () => {
    setClearingChats(true);
    try {
      await Promise.all(conversations.map((c) => deleteConversation(c.id)));
      show('All conversations deleted', 'success');
    } finally { setClearingChats(false); setClearChatsModal(false); }
  };

  const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, minHeight: 100, lineHeight: 1.6 };

  const content: Record<string, React.ReactNode> = {
    personalization: (
      <div style={{ overflowY: 'auto' }}>
        <Row label="Enable Personalization" desc="Let the AI use your profile and instructions when responding">
          <Toggle on={personalizationEnabled} onToggle={() => setPersonalizationEnabled(!personalizationEnabled)} />
        </Row>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', padding: '12px 0 4px' }}>Set the style and tone of how AZEINO responds to you.</p>
        <div style={{ marginBottom: 14, paddingTop: 8 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>Nickname</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="What should the AI call you?" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>Occupation</label>
          <input value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Web developer, photographer..." style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>More about you</label>
          <textarea value={aboutYou} onChange={(e) => setAboutYou(e.target.value)} placeholder="Interests, values, or preferences to keep in mind..." style={taStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Custom Instructions</label>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>Specific rules for how the AI should behave.</p>
          <textarea value={customInstructions} onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Always use tables for comparisons. Be direct. Oppose my ideas unless I'm stating facts..."
            style={{ ...taStyle, minHeight: 140 }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
        </div>
        <button onClick={handleSavePersonalization}
          style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          {personSaved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    ),
    general: (
      <>
        <Row label="Theme" desc="Choose your preferred color scheme">
          <div style={{ display: 'flex', gap: 6 }}>
            {(['dark', 'light'] as const).map((t) => (
              <button key={t} onClick={() => handleTheme(t)}
                style={{ padding: '6px 14px', background: theme === t ? 'var(--color-primary)' : 'var(--color-surface-2)', color: theme === t ? '#fff' : 'var(--color-text-muted)', border: `1px solid ${theme === t ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', fontSize: 13, cursor: 'pointer' }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Response Style" desc="How detailed AI responses should be">
          <Select value={responseStyle} onChange={(v) => { setResponseStyle(v); localStorage.setItem('responseStyle', v); }}
            options={[{ val: 'concise', label: 'Concise' }, { val: 'balanced', label: 'Balanced' }, { val: 'detailed', label: 'Detailed' }]} />
        </Row>
        <Row label="Web Search" desc="Allow AI to search the web for current information">
          <Toggle on={searchEnabled} onToggle={handleSearch} />
        </Row>
      </>
    ),
    profile: (
      <>
        <Row label="Email" desc="Your account email address">
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{user?.email}</span>
        </Row>
        <Row label="Login Method" desc="How you signed in">
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{(user as any)?.app_metadata?.provider || 'Email'}</span>
        </Row>
        <Row label="Display Name" desc="Name shown in the app">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name"
              style={{ ...inputStyle, width: 180 }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')} />
            <button onClick={handleSaveProfile} disabled={saving}
              style={{ padding: '8px 14px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, cursor: 'pointer', opacity: saving ? 0.7 : 1, whiteSpace: 'nowrap' }}>
              {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Row>
        {profileError && <p style={{ fontSize: 13, color: 'var(--color-error)', paddingTop: 8 }}>{profileError}</p>}
      </>
    ),
    ai: (
      <>
        <Row label="Memory" desc="AI remembers facts about you across conversations">
          <Toggle on={memoryEnabled} onToggle={handleMemory} />
        </Row>
        <Row label="Manage Memory" desc="View and delete what the AI remembers about you">
          <a href="/app/memory" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none' }}>
            View memories <ChevronRight size={14} />
          </a>
        </Row>
        <Row label="Clear Memory" desc="Delete all facts the AI has stored about you">
          <button onClick={() => setClearMemoryModal(true)}
            style={{ padding: '7px 14px', background: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 13, cursor: 'pointer' }}>
            Clear
          </button>
        </Row>
      </>
    ),
    usage: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[{ label: 'This Month', val: usageData?.totalThisMonth ?? '—' }, { label: 'All Time', val: usageData?.totalAllTime ?? '—' }].map(({ label, val }) => (
            <div key={label} style={{ padding: '16px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>{val}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
        {usageData?.byCapability && usageData.byCapability.length > 0 && (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>By Capability (this month)</p>
            {usageData.byCapability.map((u) => (
              <div key={u.capability} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text)', textTransform: 'capitalize' }}>{u.capability}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>{u.count} messages</span>
              </div>
            ))}
          </>
        )}
        {!usageData && <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Loading usage data...</p>}
        {usageData?.byCapability?.length === 0 && <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No usage data yet this month.</p>}
      </>
    ),
    data: (
      <>
        <Row label="Delete All Conversations" desc={`Permanently delete all ${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`}>
          <button onClick={() => setClearChatsModal(true)} disabled={conversations.length === 0}
            style={{ padding: '7px 14px', background: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 13, cursor: conversations.length === 0 ? 'not-allowed' : 'pointer', opacity: conversations.length === 0 ? 0.5 : 1 }}>
            Delete All
          </button>
        </Row>
        <Row label="Sign Out" desc="Sign out of your account on this device">
          <button onClick={signOut}
            style={{ padding: '7px 14px', background: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 13, cursor: 'pointer' }}>
            Sign Out
          </button>
        </Row>
      </>
    ),
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: 680, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'flex', minHeight: 480 }}>
          {/* Left nav */}
          <div style={{ width: 200, borderRight: '1px solid var(--color-border)', padding: '8px 0', flexShrink: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', padding: '12px 16px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settings</p>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: tab === id ? 'var(--color-surface-2)' : 'transparent', color: tab === id ? 'var(--color-text)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', fontSize: 14, textAlign: 'left', borderRadius: 0 }}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '24px 28px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{TABS.find((t) => t.id === tab)?.label}</h2>
            <div style={{ marginTop: 16 }}>{content[tab]}</div>
          </div>
        </div>
      </main>

      <Modal open={clearMemoryModal} onClose={() => setClearMemoryModal(false)} title="Clear All Memory">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>This will permanently delete all facts the AI has remembered about you. This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setClearMemoryModal(false)} style={{ padding: '9px 18px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer', color: 'var(--color-text)' }}>Cancel</button>
          <button onClick={handleClearMemory} style={{ padding: '9px 18px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer' }}>Clear Memory</button>
        </div>
      </Modal>

      <Modal open={clearChatsModal} onClose={() => setClearChatsModal(false)} title="Delete All Conversations">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>This will permanently delete all {conversations.length} conversations. This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setClearChatsModal(false)} style={{ padding: '9px 18px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer', color: 'var(--color-text)' }}>Cancel</button>
          <button onClick={handleClearChats} style={{ padding: '9px 18px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer' }}>Delete All</button>
        </div>
      </Modal>
    </div>
  );
}
