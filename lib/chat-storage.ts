import { Chat } from '../types';

const STORAGE_KEY = 'haven_chats_v1';
const ACTIVE_CHAT_KEY = 'haven_active_chat_id_v1';
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
      console.error('[Haven] Gagal menyimpan chat ke localStorage:', err);
    }
  },

  loadChats(): Chat[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Migration check from Haven
        const kasepRaw = window.localStorage.getItem('kasepgpt_chats_v1');
        if (kasepRaw) {
          try {
            const kasepData = JSON.parse(kasepRaw) as VersionedStorage;
            if (kasepData && kasepData.conversations) {
              this.saveChats(kasepData.conversations);
              window.localStorage.removeItem('kasepgpt_chats_v1');
              return kasepData.conversations;
            }
          } catch {
            // ignore
          }
        }
        return [];
      }

      const parsed = JSON.parse(raw) as VersionedStorage;
      
      // Simple migration check for future-proofing
      if (parsed && parsed.version === CURRENT_VERSION) {
        return parsed.conversations || [];
      }
    } catch (err) {
      console.error('[Haven] Gagal memuat chat dari localStorage:', err);
    }
    return [];
  },

  clearChats(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(ACTIVE_CHAT_KEY);
      // Clean up legacy keys
      window.localStorage.removeItem('kasepgpt_chats_v1');
      window.localStorage.removeItem('kasepgpt_active_chat_id_v1');
      window.localStorage.removeItem('kasepgpt_chats');
      window.localStorage.removeItem('kasepgpt_active_chat_id');
      window.localStorage.removeItem('haven_chats');
      window.localStorage.removeItem('haven_active_chat_id');
    } catch (err) {
      console.error('[Haven] Gagal menghapus localStorage:', err);
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
      console.error('[Haven] Gagal menyimpan activeChatId ke localStorage:', err);
    }
  },

  loadActiveChatId(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const activeId = window.localStorage.getItem(ACTIVE_CHAT_KEY);
      if (activeId) return activeId;

      // Fallback from Haven
      const kasepActiveId = window.localStorage.getItem('kasepgpt_active_chat_id_v1') || window.localStorage.getItem('kasepgpt_active_chat_id');
      if (kasepActiveId) {
        this.saveActiveChatId(kasepActiveId);
        window.localStorage.removeItem('kasepgpt_active_chat_id_v1');
        window.localStorage.removeItem('kasepgpt_active_chat_id');
        return kasepActiveId;
      }
    } catch (err) {
      console.error('[Haven] Gagal memuat activeChatId dari localStorage:', err);
    }
    return null;
  }
};
