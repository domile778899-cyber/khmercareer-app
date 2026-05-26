import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { Conversation, ChatMessage } from '@/api/chatTypes'
import { chatApi } from '@/api/chatApi'
import { useAuth } from '@/hooks/useAuth'

const DB_PREFIX = 'khmercareer_';

function getConversations(): Conversation[] {
  try { return JSON.parse(localStorage.getItem(DB_PREFIX + 'conversations') || '[]'); } catch { return []; }
}
function saveConversations(items: Conversation[]) {
  localStorage.setItem(DB_PREFIX + 'conversations', JSON.stringify(items));
}
function getMessages(conversationId: string): ChatMessage[] {
  try {
    const all = JSON.parse(localStorage.getItem(DB_PREFIX + 'messages') || '{}');
    return all[conversationId] || [];
  } catch { return []; }
}
function saveMessages(conversationId: string, messages: ChatMessage[]) {
  const all = JSON.parse(localStorage.getItem(DB_PREFIX + 'messages') || '{}');
  all[conversationId] = messages;
  localStorage.setItem(DB_PREFIX + 'messages', JSON.stringify(all));
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentMessages: ChatMessage[];
  unreadTotal: number;
  loading: boolean;
  sending: boolean;
  setCurrentConversation: (id: string | null) => void;
  sendMessage: (content: string, type?: ChatMessage['type'], metadata?: ChatMessage['metadata']) => void;
  startConversation: (participant: { userId: string; userName: string; userRole: 'jobseeker' | 'employer'; avatar?: string; company?: string }, jobId?: string, jobTitle?: string) => Promise<string>;
  markAsRead: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  /** Reload conversations from API */
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const mounted = useRef(false);

  // ── Load conversations from API on mount ─────────────────────────────────
  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const rooms = await chatApi.getRooms();
      // Map ChatRoom[] to Conversation[] format
      const mappedConvs: Conversation[] = rooms.map((room) => ({
        id: room.id,
        participants: room.participants.map((p) => ({
          userId: p.userId || p.id || '',
          userName: p.name,
          userRole: (p.role === 'employer' ? 'employer' : 'jobseeker') as 'jobseeker' | 'employer',
          avatar: p.avatar,
          company: (p as Record<string, unknown>).company as string | undefined,
        })),
        unreadCount: room.unreadCount || 0,
        status: 'active' as const,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        lastMessage: room.lastMessage
          ? {
              content: room.lastMessage.content,
              createdAt: room.lastMessage.createdAt,
              senderId: room.lastMessage.senderId,
            }
          : undefined,
      }));
      setConversations(mappedConvs);
      saveConversations(mappedConvs);
    } catch {
      // API failed — use cached localStorage data
      setConversations(getConversations());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Start with cached data for instant UI
    setConversations(getConversations());
    setLoading(false);

    // Then sync with API
    loadConversations();
  }, [loadConversations]);

  // ── Load messages when conversation changes ───────────────────────────────
  useEffect(() => {
    if (currentConversationId) {
      // Try API first, fallback to localStorage
      chatApi
        .getMessages(currentConversationId)
        .then((msgs) => {
          const mapped = msgs.map((m) => ({
            id: m.id,
            conversationId: m.roomId || currentConversationId,
            senderId: m.senderId,
            senderName: m.senderName,
            senderRole: 'jobseeker' as 'jobseeker' | 'employer',
            content: m.content,
            type: m.type as ChatMessage['type'],
            metadata: m.metadata,
            read: m.read,
            createdAt: m.createdAt,
          }));
          setCurrentMessages(mapped);
          saveMessages(currentConversationId, mapped);
        })
        .catch(() => {
          // Fallback to localStorage
          setCurrentMessages(getMessages(currentConversationId));
        });
    } else {
      setCurrentMessages([]);
    }
  }, [currentConversationId]);

  // Calculate unread total
  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const setCurrentConversation = useCallback((id: string | null) => {
    setCurrentConversationId(id);
    if (id) {
      // Mark as read via API (best-effort)
      chatApi.markAsRead(id).catch(() => { /* silent */ });
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
      );
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, type: ChatMessage['type'] = 'text', metadata?: ChatMessage['metadata']) => {
      if (!currentConversationId || !user) return;

      const newMsg: ChatMessage = {
        id: crypto.randomUUID(),
        conversationId: currentConversationId,
        senderId: user.id || 'anonymous',
        senderName: user.fullName || 'User',
        senderRole: 'jobseeker',
        content,
        type,
        metadata,
        read: false,
        createdAt: new Date().toISOString(),
      };

      setSending(true);

      // Optimistic update
      setCurrentMessages((prev) => [...prev, newMsg]);

      try {
        const sent = await chatApi.sendMessage(currentConversationId, content, type);
        // Replace with server-confirmed message if available
        const confirmedMsg: ChatMessage = {
          id: sent.id || newMsg.id,
          conversationId: currentConversationId,
          senderId: sent.senderId || newMsg.senderId,
          senderName: sent.senderName || newMsg.senderName,
          senderRole: 'jobseeker',
          content: sent.content || newMsg.content,
          type: (sent.type as ChatMessage['type']) || newMsg.type,
          read: true,
          createdAt: sent.createdAt || newMsg.createdAt,
        };
        setCurrentMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? confirmedMsg : m)),
        );

        // Update conversation last message
        const convs = getConversations();
        const convIdx = convs.findIndex((c) => c.id === currentConversationId);
        if (convIdx !== -1) {
          convs[convIdx].lastMessage = {
            content,
            createdAt: confirmedMsg.createdAt,
            senderId: confirmedMsg.senderId,
          };
          convs[convIdx].updatedAt = confirmedMsg.createdAt;
          saveConversations(convs);
          setConversations((prev) =>
            prev.map((c, idx) =>
              idx === convIdx
                ? {
                    ...c,
                    lastMessage: convs[convIdx].lastMessage,
                    updatedAt: confirmedMsg.createdAt,
                  }
                : c,
            ),
          );
        }
      } catch {
        // Fallback: save locally
        const msgs = getMessages(currentConversationId);
        msgs.push(newMsg);
        saveMessages(currentConversationId, msgs);
        setCurrentMessages([...msgs]);
      } finally {
        setSending(false);
      }
    },
    [currentConversationId, user],
  );

  const startConversation = useCallback(
    async (
      participant: {
        userId: string;
        userName: string;
        userRole: 'jobseeker' | 'employer';
        avatar?: string;
        company?: string;
      },
      jobId?: string,
      jobTitle?: string,
    ): Promise<string> => {
      if (!user) return '';

      // Check if conversation already exists
      const existing = getConversations().find(
        (c) =>
          c.participants.some((p) => p.userId === participant.userId) &&
          c.participants.some((p) => p.userId === user.id),
      );

      if (existing) {
        setCurrentConversationId(existing.id);
        return existing.id;
      }

      try {
        // Try creating via API first
        const room = await chatApi.createRoom(
          `Chat with ${participant.userName}`,
          'direct',
          [participant.userId],
        );
        const newConvId = room.id;

        const newConv: Conversation = {
          id: newConvId,
          participants: [
            {
              userId: user.id || 'me',
              userName: user.fullName || 'Me',
              userRole: 'jobseeker',
            },
            {
              userId: participant.userId,
              userName: participant.userName,
              userRole: participant.userRole,
              avatar: participant.avatar,
              company: participant.company,
            },
          ],
          unreadCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          jobId,
          jobTitle,
        };

        const convs = getConversations();
        convs.unshift(newConv);
        saveConversations(convs);
        setConversations([...convs]);
        setCurrentConversationId(newConvId);

        return newConvId;
      } catch {
        // Fallback: create locally
        const newConv: Conversation = {
          id: crypto.randomUUID(),
          participants: [
            {
              userId: user.id || 'me',
              userName: user.fullName || 'Me',
              userRole: 'jobseeker',
            },
            {
              userId: participant.userId,
              userName: participant.userName,
              userRole: participant.userRole,
              avatar: participant.avatar,
              company: participant.company,
            },
          ],
          unreadCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          jobId,
          jobTitle,
        };

        const convs = getConversations();
        convs.unshift(newConv);
        saveConversations(convs);
        setConversations([...convs]);
        setCurrentConversationId(newConv.id);

        return newConv.id;
      }
    },
    [user],
  );

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    );
    // API call (best-effort)
    chatApi.markAsRead(conversationId).catch(() => { /* silent */ });
    const convs = getConversations();
    const idx = convs.findIndex((c) => c.id === conversationId);
    if (idx !== -1) {
      convs[idx].unreadCount = 0;
      saveConversations(convs);
    }
  }, []);

  const archiveConversation = useCallback((conversationId: string) => {
    const convs = getConversations().filter((c) => c.id !== conversationId);
    saveConversations(convs);
    setConversations(convs);
    if (currentConversationId === conversationId) setCurrentConversationId(null);
  }, [currentConversationId]);

  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        currentMessages,
        unreadTotal,
        loading,
        sending,
        setCurrentConversation,
        sendMessage,
        startConversation,
        markAsRead,
        archiveConversation,
        refreshConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
