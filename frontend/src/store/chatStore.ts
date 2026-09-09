import { create } from 'zustand';
import { api } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  content_type: string;
  metadata?: { sources?: { title: string; url: string }[]; imageData?: string };
  filePreview?: string;
  fileName?: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  sendMessage: (message: string, fileId?: string, contextHint?: string, filePreview?: string, fileName?: string) => Promise<void>;
  newConversation: () => Promise<string>;
  renameConversation: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  setActiveConversation: (id: string) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  loading: false,
  sending: false,
  error: null,

  loadConversations: async () => {
    const data = await api.getConversations();
    set({ conversations: data });
  },

  loadConversation: async (id) => {
    set({ loading: true, activeConversationId: id });
    const data = await api.getConversation(id);
    set({ messages: data.messages || [], loading: false });
  },

  newConversation: async () => {
    const data = await api.createConversation();
    set((state) => ({ conversations: [data, ...state.conversations] }));
    return data.id;
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),
  clearError: () => set({ error: null }),

  renameConversation: async (id, title) => {
    await api.updateConversation(id, { title });
    set((state) => ({ conversations: state.conversations.map((c) => c.id === id ? { ...c, title } : c) }));
  },

  deleteConversation: async (id) => {
    await api.deleteConversation(id);
    set((state) => ({ conversations: state.conversations.filter((c) => c.id !== id) }));
  },

  sendMessage: async (message, fileId, contextHint, filePreview?, fileName?) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      content_type: 'text',
      filePreview,
      fileName,
      created_at: new Date().toISOString(),
    };

    set((state) => ({ messages: [...state.messages, userMsg], sending: true }));

    // Build personalization context
    let personalization = '';
    try {
      const p = localStorage.getItem('personalization');
      if (p) {
        const parsed = JSON.parse(p);
        if (parsed.enabled !== false) {
          const parts = [];
          if (parsed.nickname) parts.push(`Call me ${parsed.nickname}.`);
          if (parsed.occupation) parts.push(`I am a ${parsed.occupation}.`);
          if (parsed.aboutYou) parts.push(parsed.aboutYou);
          if (parsed.customInstructions) parts.push(parsed.customInstructions);
          personalization = parts.join(' ');
        }
      }
    } catch {}

    try {
      const data = await api.sendMessage(activeConversationId, { message, fileId, contextHint, personalization });
      set((state) => ({ messages: [...state.messages, data.message], sending: false }));

      // Auto-rename if still on default title
      const { conversations, renameConversation } = get();
      const conv = conversations.find((c) => c.id === activeConversationId);
      if (conv && conv.title === 'New Chat') {
        const title = message.trim().slice(0, 50) + (message.length > 50 ? '...' : '');
        renameConversation(activeConversationId, title);
      }
    } catch (err: any) {
      const msg = err?.message || 'Something went wrong. Please try again.';
      set({ sending: false, error: msg });
      throw err;
    }
  },
}));
