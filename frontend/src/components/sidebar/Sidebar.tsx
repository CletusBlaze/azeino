'use client';

import { useEffect, useState, useRef } from 'react';
import Logo from '../../components/shared/Logo';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Plus, Compass, BookOpen, FileText, Image, Search, FolderOpen, Brain, Lightbulb, Code2, Settings, LogOut, MoreHorizontal, Pencil, Trash2, Sun, Moon, Zap, Bot } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) { setTheme(saved); document.documentElement.setAttribute('data-theme', saved); }
  }, []);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };
  return { theme, toggle };
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { conversations, loadConversations, newConversation, renameConversation, deleteConversation } = useChatStore();
  const { signOut } = useAuthStore();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const filteredConvs = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNewChat = async () => {
    const id = await newConversation();
    router.push(`/app/chat/${id}`);
  };

  const handleRename = async (id: string) => {
    if (renameVal.trim()) await renameConversation(id, renameVal.trim());
    setRenaming(null);
    setRenameVal('');
    setMenuOpen(null);
  };

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    setMenuOpen(null);
    if (pathname.includes(id)) router.push('/app/explore');
  };

  const navItems = [
    { icon: Compass, label: 'Explore', href: '/app/explore' },
    { icon: BookOpen, label: 'Study', href: '/app/study' },
    { icon: Code2, label: 'Code', href: '/app/code' },
    { icon: Lightbulb, label: 'Brainstorm', href: '/app/brainstorm' },
    { icon: FileText, label: 'Documents', href: '/app/documents' },
    { icon: Search, label: 'Research', href: '/app/research' },
    { icon: Image, label: 'Images', href: '/app/images' },
    { icon: Brain, label: 'Memory', href: '/app/memory' },
    { icon: FolderOpen, label: 'Files', href: '/app/files' },
    { icon: Zap, label: 'Billing', href: '/app/billing' },
    { icon: Bot, label: 'Agents', href: '/app/agents' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}
      {/* Mobile toggle button */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        style={{ display: 'none', position: 'fixed', top: 12, left: 12, zIndex: 101, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '6px 8px', cursor: 'pointer', color: 'var(--color-text)' }}
        className="mobile-menu-btn">
        ☰
      </button>
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`} style={{ width: 260, background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={26} />
        <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 4 }}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div style={{ padding: '12px 12px 8px' }}>
        <button onClick={handleNewChat} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
          <Plus size={16} /> New Chat
        </button>
      </div>

      <nav style={{ padding: '4px 8px' }}>
        {navItems.map(({ icon: Icon, label, href }) => (
          <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', color: pathname === href ? 'var(--color-primary)' : 'var(--color-text-muted)', background: pathname === href ? 'rgba(99,102,241,0.1)' : 'transparent', fontSize: 14, textDecoration: 'none', marginBottom: 2 }}>
            <Icon size={16} /> {label}
          </a>
        ))}
      </nav>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }} ref={menuRef}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', padding: '4px 10px 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Chats</p>
        <div style={{ padding: '0 4px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }}>
            <Search size={12} color="var(--color-text-muted)" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: 'var(--color-text)' }} />
          </div>
        </div>
        {filteredConvs.map((conv) => (
          <div key={conv.id} style={{ position: 'relative', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', background: pathname.includes(conv.id) ? 'var(--color-surface-2)' : 'transparent', marginBottom: 1 }}
            onMouseEnter={(e) => e.currentTarget.querySelector('.conv-menu-btn')?.setAttribute('style', 'display:flex')}
            onMouseLeave={(e) => { if (menuOpen !== conv.id) e.currentTarget.querySelector('.conv-menu-btn')?.setAttribute('style', 'display:none'); }}>
            {renaming === conv.id ? (
              <input autoFocus value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRename(conv.id); if (e.key === 'Escape') { setRenaming(null); setMenuOpen(null); } }}
                onBlur={() => handleRename(conv.id)}
                style={{ flex: 1, margin: '2px 8px', padding: '4px 8px', background: 'var(--color-surface-2)', border: '1px solid var(--color-primary)', borderRadius: 4, color: 'var(--color-text)', fontSize: 13, outline: 'none' }} />
            ) : (
              <a href={`/app/chat/${conv.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', color: pathname.includes(conv.id) ? 'var(--color-text)' : 'var(--color-text-muted)', fontSize: 13, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <MessageSquare size={13} style={{ flexShrink: 0 }} />{conv.title}
              </a>
            )}
            <button className="conv-menu-btn" onClick={() => setMenuOpen(menuOpen === conv.id ? null : conv.id)}
              style={{ display: 'none', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px 6px', flexShrink: 0 }}>
              <MoreHorizontal size={14} />
            </button>
            {menuOpen === conv.id && (
              <div style={{ position: 'absolute', right: 0, top: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', zIndex: 50, minWidth: 130, boxShadow: '0 4px 16px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                <button onClick={() => { setRenaming(conv.id); setRenameVal(conv.title); setMenuOpen(null); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', fontSize: 13 }}>
                  <Pencil size={13} /> Rename
                </button>
                <button onClick={() => handleDelete(conv.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: 13 }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '8px', borderTop: '1px solid var(--color-border)' }}>
        <a href="/app/settings" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)', fontSize: 14, textDecoration: 'none', marginBottom: 4 }}>
          <Settings size={16} /> Settings
        </a>
        <button onClick={signOut} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
    </>
  );
}
