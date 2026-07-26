'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import SettingsModal from '../components/SettingsModal';
import Toast, { ToastMessage } from '../components/Toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { chatStorage } from '../lib/chat-storage';
import { Chat, Message, Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  model: 'gpt-oss-120b',
  temperature: 0.7,
  maxTokens: 4000,
};

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [settings, setSettings] = useLocalStorage<Settings>('kasepgpt_settings', DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 15);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    setToast({
      id: generateId(),
      type,
      title,
      description,
    });
  }, []);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedChats = chatStorage.loadChats();
    const savedActiveId = chatStorage.loadActiveChatId();

    if (savedChats.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChats(savedChats);
      if (savedActiveId && savedChats.some(c => c.id === savedActiveId)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveChatId(savedActiveId);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveChatId(savedChats[0].id);
      }
    } else {
      const newChatId = generateId();
      const initialChat: Chat = {
        id: newChatId,
        title: 'Percakapan Baru',
        messages: [],
        createdAt: Date.now(),
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChats([initialChat]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveChatId(newChatId);
      chatStorage.saveChats([initialChat]);
      chatStorage.saveActiveChatId(newChatId);
    }
    setIsLoaded(true);
  }, []);

  // Save chats on state change
  useEffect(() => {
    if (isLoaded) {
      chatStorage.saveChats(chats);
    }
  }, [chats, isLoaded]);

  // Save active id on change
  useEffect(() => {
    if (isLoaded) {
      chatStorage.saveActiveChatId(activeChatId);
    }
  }, [activeChatId, isLoaded]);

  const handleNewChat = useCallback(() => {
    if (isGenerating) {
      showToast('info', 'Harap tunggu', 'Selesaikan atau stop chat yang sedang berjalan terlebih dahulu.');
      return;
    }
    const newChatId = generateId();
    const newChat: Chat = {
      id: newChatId,
      title: 'Percakapan Baru',
      messages: [],
      createdAt: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
  }, [isGenerating, setChats, setActiveChatId, showToast]);

  const handleSelectChat = useCallback((id: string) => {
    if (isGenerating) {
      showToast('info', 'Harap tunggu', 'Selesaikan atau stop chat yang sedang berjalan terlebih dahulu.');
      return;
    }
    setActiveChatId(id);
  }, [isGenerating, setActiveChatId, showToast]);

  const handleDeleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      // Pick first remaining chat or reset
      const remaining = chats.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        // Pick a brand new clean chat if none left
        const newChatId = generateId();
        const initialChat: Chat = {
          id: newChatId,
          title: 'Percakapan Baru',
          messages: [],
          createdAt: Date.now(),
        };
        setChats([initialChat]);
        setActiveChatId(newChatId);
      }
    }
    showToast('success', 'Chat dihapus', 'Percakapan berhasil dihapus dari riwayat.');
  }, [activeChatId, chats, setChats, setActiveChatId, showToast]);

  const handleDeleteAllChats = useCallback(() => {
    chatStorage.clearChats();
    const newChatId = generateId();
    const initialChat: Chat = {
      id: newChatId,
      title: 'Percakapan Baru',
      messages: [],
      createdAt: Date.now(),
    };
    setChats([initialChat]);
    setActiveChatId(newChatId);
    showToast('success', 'Semua riwayat dihapus', 'Semua riwayat percakapan telah dibersihkan.');
  }, [showToast]);

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      showToast('info', 'Dihentikan', 'Respon AI telah dihentikan oleh pengguna.');
    }
  }, [showToast]);

  const getActiveChat = (): Chat | null => {
    return chats.find((c) => c.id === activeChatId) || null;
  };

  const handleSendMessage = async (content: string) => {
    let currentChat = getActiveChat();
    
    // Create new chat if active chat doesn't exist
    if (!currentChat) {
      const newChatId = generateId();
      currentChat = {
        id: newChatId,
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
      };
      setChats((prev) => [currentChat!, ...prev]);
      setActiveChatId(newChatId);
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Update active chat title if it's the first message
    const updatedMessages = [...currentChat.messages, userMessage];
    const isFirstMessage = currentChat.messages.length === 0;
    const newTitle = isFirstMessage 
      ? content.substring(0, 30) + (content.length > 30 ? '...' : '') 
      : currentChat.title;

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChat!.id
          ? { ...c, title: newTitle, messages: updatedMessages }
          : c
      )
    );

    // Prepare assistant response holder
    const assistantMessageId = generateId();
    const assistantMessagePlaceholder: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChat!.id
          ? { ...c, messages: [...updatedMessages, assistantMessagePlaceholder] }
          : c
      )
    );

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      // Send api request (exclude system role client-side if we already process it backend)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamContent = '';

      if (!reader) {
        throw new Error('Response stream reader not available.');
      }

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;
          if (cleanLine === 'data: [DONE]') continue;

          if (cleanLine.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(cleanLine.slice(6));
              const deltaContent = parsed.choices?.[0]?.delta?.content || '';
              if (deltaContent) {
                streamContent += deltaContent;
                setChats((prev) =>
                  prev.map((c) =>
                    c.id === currentChat!.id
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMessageId
                              ? { ...m, content: streamContent }
                              : m
                          ),
                        }
                      : c
                  )
                );
              }
            } catch {
              // Ignore parse errors on partial streams
            }
          }
        }
      }
    } catch (error: unknown) {
      const isAbort = error instanceof Error && error.name === 'AbortError';
      if (isAbort) return;

      console.error('Streaming error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Koneksi ke server terputus.';
      showToast('error', 'Gagal mengirim pesan', errorMessage);
      
      // Update assistant message with error state
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChat!.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: m.content || 'Terjadi kesalahan saat memproses permintaan Anda.', error: true }
                    : m
                ),
              }
            : c
        )
      );
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerateMessage = async () => {
    const currentChat = getActiveChat();
    if (!currentChat || currentChat.messages.length < 2) return;

    // Find the last user message
    const lastUserMessageIndex = [...currentChat.messages]
      .reverse()
      .findIndex((m) => m.role === 'user');

    if (lastUserMessageIndex === -1) return;

    const actualIndex = currentChat.messages.length - 1 - lastUserMessageIndex;
    const lastUserMessage = currentChat.messages[actualIndex];

    // Truncate messages list up to the last user message
    const trimmedMessages = currentChat.messages.slice(0, actualIndex);
    
    // Set chats to trimmed messages
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChat.id
          ? { ...c, messages: trimmedMessages }
          : c
      )
    );

    // Call sendMessage again
    await handleSendMessage(lastUserMessage.content);
  };

  const activeChat = getActiveChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFF7FB]">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onDeleteAllChats={handleDeleteAllChats}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main chat window */}
      <ChatArea
        chat={activeChat}
        onSendMessage={handleSendMessage}
        onRegenerateMessage={handleRegenerateMessage}
        onStopGeneration={handleStopGeneration}
        isGenerating={isGenerating}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        modelName={settings.model}
        onChangeModel={(model) => setSettings((prev) => ({ ...prev, model }))}
      />

      {/* Settings Modal popup */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* Notifications toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
