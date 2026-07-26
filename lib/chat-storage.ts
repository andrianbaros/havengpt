import { Chat } from '../types';

const STORAGE_KEY = 'kasepgpt_chats_v1';
const ACTIVE_CHAT_KEY = 'kasepgpt_active_chat_id_v1';
const CURRENT_VERSION = 1;

interface VersionedStorage {
  version: number;
  updatedAt: string;
  conversations: Chat[];
}

export const chatStorage = {
  saveChats(chats: Chat[]): void {
    if (typeof window === 'undefined') return;
    try {
      const data: VersionedStorage = {
        version: CURRENT_VERSION,
        updatedAt: new Date().toISOString(),
        conversations: chats,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('[KasepGPT] Gagal menyimpan chat ke localStorage:', err);
    }
  },

  loadChats(): Chat[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw) as VersionedStorage;
      
      // Simple migration check for future-proofing
      if (parsed && parsed.version === CURRENT_VERSION) {
        return parsed.conversations || [];
      }
      
      // Fallback/Legacy load (if there's a legacy unversioned structure)
      const legacyRaw = window.localStorage.getItem('kasepgpt_chats');
      if (legacyRaw) {
        try {
          const legacyChats = JSON.parse(legacyRaw) as Chat[];
          if (Array.isArray(legacyChats)) {
            // Auto migrate
            this.saveChats(legacyChats);
            window.localStorage.removeItem('kasepgpt_chats');
            return legacyChats;
          }
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('[KasepGPT] Gagal memuat chat dari localStorage:', err);
    }
    return [];
  },

  clearChats(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(ACTIVE_CHAT_KEY);
      // Clean up legacy keys if they exist
      window.localStorage.removeItem('kasepgpt_chats');
      window.localStorage.removeItem('kasepgpt_active_chat_id');
    } catch (err) {
      console.error('[KasepGPT] Gagal menghapus localStorage:', err);
    }
  },

  saveActiveChatId(id: string | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (id) {
        window.localStorage.setItem(ACTIVE_CHAT_KEY, id);
      } else {
        window.localStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    } catch (err) {
      console.error('[KasepGPT] Gagal menyimpan activeChatId ke localStorage:', err);
    }
  },

  loadActiveChatId(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const activeId = window.localStorage.getItem(ACTIVE_CHAT_KEY);
      if (activeId) return activeId;

      // Fallback/Legacy
      const legacyActiveId = window.localStorage.getItem('kasepgpt_active_chat_id');
      if (legacyActiveId) {
        this.saveActiveChatId(legacyActiveId);
        window.localStorage.removeItem('kasepgpt_active_chat_id');
        return legacyActiveId;
      }
    } catch (err) {
      console.error('[KasepGPT] Gagal memuat activeChatId dari localStorage:', err);
    }
    return null;
  }
};
