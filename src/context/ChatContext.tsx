import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { Conversation, ChatMessage } from '@/api/chatTypes'
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
  setCurrentConversation: (id: string | null) => void;
  sendMessage: (content: string, type?: ChatMessage['type'], metadata?: ChatMessage['metadata']) => void;
  startConversation: (participant: { userId: string; userName: string; userRole: 'jobseeker' | 'employer'; avatar?: string; company?: string }, jobId?: string, jobTitle?: string) => string;
  markAsRead: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const typingTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // Load conversations
  useEffect(() => {
    setConversations(getConversations());
    setLoading(false);
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      setCurrentMessages(getMessages(currentConversationId));
    } else {
      setCurrentMessages([]);
    }
  }, [currentConversationId]);

  // Calculate unread total
  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const setCurrentConversation = useCallback((id: string | null) => {
    setCurrentConversationId(id);
    if (id) {
      setConversations(prev =>
        prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c)
      );
    }
  }, []);

  const sendMessage = useCallback((
    content: string,
    type: ChatMessage['type'] = 'text',
    metadata?: ChatMessage['metadata']
  ) => {
    if (!currentConversationId || !user) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: currentConversationId,
      senderId: user.id || 'anonymous',
      senderName: user.fullName || 'User',
      senderRole: 'jobseeker', // Default, can be toggled
      content,
      type,
      metadata,
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Save message
    const msgs = getMessages(currentConversationId);
    msgs.push(newMsg);
    saveMessages(currentConversationId, msgs);
    setCurrentMessages([...msgs]);

    // Update conversation last message
    const convs = getConversations();
    const convIdx = convs.findIndex(c => c.id === currentConversationId);
    if (convIdx !== -1) {
      convs[convIdx].lastMessage = { content, createdAt: newMsg.createdAt, senderId: newMsg.senderId };
      convs[convIdx].updatedAt = newMsg.createdAt;
      saveConversations(convs);
      setConversations([...convs]);
    }

    // Simulate auto-reply for demo (employer responds after 2-4 seconds)
    const otherParticipant = convs[convIdx]?.participants.find(p => p.userId !== user.id);
    if (otherParticipant && type === 'text') {
      const delay = 2000 + Math.random() * 3000;
      const autoReplies = [
        'Thanks for your interest! Can you share your resume?',
        'We are looking for candidates with your background. Let\'s schedule an interview!',
        'Great, I received your message. Let me check with the hiring manager.',
        'Your qualifications look promising! When are you available for a chat?',
        'Thank you for reaching out. Would you like to know more about the position?',
      ];
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

      if (typingTimers.current[currentConversationId]) {
        clearTimeout(typingTimers.current[currentConversationId]);
      }
      typingTimers.current[currentConversationId] = setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: crypto.randomUUID(),
          conversationId: currentConversationId!,
          senderId: otherParticipant.userId,
          senderName: otherParticipant.userName,
          senderRole: otherParticipant.userRole,
          content: reply,
          type: 'text',
          read: true,
          createdAt: new Date().toISOString(),
        };
        const updatedMsgs = getMessages(currentConversationId!);
        updatedMsgs.push(replyMsg);
        saveMessages(currentConversationId!, updatedMsgs);
        if (currentConversationId === currentConversationId) {
          setCurrentMessages([...updatedMsgs]);
        }
        const updatedConvs = getConversations();
        const cIdx = updatedConvs.findIndex(c => c.id === currentConversationId);
        if (cIdx !== -1) {
          updatedConvs[cIdx].lastMessage = { content: reply, createdAt: replyMsg.createdAt, senderId: replyMsg.senderId };
          updatedConvs[cIdx].updatedAt = replyMsg.createdAt;
          saveConversations(updatedConvs);
          setConversations([...updatedConvs]);
        }
      }, delay);
    }
  }, [currentConversationId, user]);

  const startConversation = useCallback((
    participant: { userId: string; userName: string; userRole: 'jobseeker' | 'employer'; avatar?: string; company?: string },
    jobId?: string,
    jobTitle?: string
  ): string => {
    if (!user) return '';

    // Check if conversation already exists
    const existing = getConversations().find(c =>
      c.participants.some(p => p.userId === participant.userId) &&
      c.participants.some(p => p.userId === user.id)
    );

    if (existing) {
      setCurrentConversationId(existing.id);
      return existing.id;
    }

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
  }, [user, setCurrentConversationId]);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c)
    );
    const convs = getConversations();
    const idx = convs.findIndex(c => c.id === conversationId);
    if (idx !== -1) {
      convs[idx].unreadCount = 0;
      saveConversations(convs);
    }
  }, []);

  const archiveConversation = useCallback((conversationId: string) => {
    const convs = getConversations().filter(c => c.id !== conversationId);
    saveConversations(convs);
    setConversations(convs);
    if (currentConversationId === conversationId) setCurrentConversationId(null);
  }, [currentConversationId, setCurrentConversationId]);

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversationId,
      currentMessages,
      unreadTotal,
      loading,
      setCurrentConversation,
      sendMessage,
      startConversation,
      markAsRead,
      archiveConversation,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
