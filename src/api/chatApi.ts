/**
 * KhmerCareer Express — Chat API
 * Room and message management with localStorage fallback.
 */

import { get, post } from './client';
import type { ChatRoom, ChatMessage, SendMessageRequest } from './types';

// =============================================================================
// localStorage fallback helpers
// =============================================================================

const CHAT_ROOMS_KEY = 'khmercareer_chat_rooms';
const CHAT_MESSAGES_KEY = 'khmercareer_chat_messages';
const CHAT_FALLBACK_KEY = 'khmer_chat_fallback';

function isFallbackEnabled(): boolean {
  try { return localStorage.getItem(CHAT_FALLBACK_KEY) === 'true'; } catch { return false; }
}

function setFallbackEnabled(v: boolean): void {
  try { localStorage.setItem(CHAT_FALLBACK_KEY, v ? 'true' : 'false'); } catch { /* */ }
}

interface LocalChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: Array<{
    id: string;
    userId: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface LocalChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

function getLocalRooms(): LocalChatRoom[] {
  try { return JSON.parse(localStorage.getItem(CHAT_ROOMS_KEY) || '[]'); } catch { return []; }
}

function saveLocalRooms(rooms: LocalChatRoom[]): void {
  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));
}

function getLocalMessages(roomId: string): LocalChatMessage[] {
  try {
    const all = JSON.parse(localStorage.getItem(CHAT_MESSAGES_KEY) || '{}') as Record<string, LocalChatMessage[]>;
    return all[roomId] || [];
  } catch { return []; }
}

function saveLocalMessage(roomId: string, message: LocalChatMessage): void {
  try {
    const all = JSON.parse(localStorage.getItem(CHAT_MESSAGES_KEY) || '{}') as Record<string, LocalChatMessage[]>;
    if (!all[roomId]) all[roomId] = [];
    all[roomId].push(message);
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(all));
  } catch { /* */ }
}

function getCurrentUserId(): string {
  try {
    const user = localStorage.getItem('khmer_auth_user');
    if (user) return JSON.parse(user).id as string;
  } catch { /* */ }
  return 'anonymous_user';
}

function getCurrentUserName(): string {
  try {
    const user = localStorage.getItem('khmer_auth_user');
    if (user) return JSON.parse(user).fullName as string || 'Me';
  } catch { /* */ }
  return 'Me';
}

// Seed default rooms for fallback
function seedDefaultRooms(): void {
  const rooms = getLocalRooms();
  if (rooms.length === 0) {
    const defaultRooms: LocalChatRoom[] = [
      {
        id: 'room_support',
        name: 'Customer Support',
        type: 'direct',
        participants: [
          { id: 'p1', userId: getCurrentUserId(), name: getCurrentUserName(), role: 'jobseeker' },
          { id: 'p2', userId: 'support_agent_1', name: 'Support Team', role: 'admin' },
        ],
        lastMessage: {
          id: 'msg_welcome',
          content: 'Welcome to KhmerCareer! How can we help you today?',
          senderId: 'support_agent_1',
          senderName: 'Support Team',
          createdAt: new Date().toISOString(),
        },
        unreadCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveLocalRooms(defaultRooms);

    // Seed welcome message
    saveLocalMessage('room_support', {
      id: 'msg_welcome',
      roomId: 'room_support',
      senderId: 'support_agent_1',
      senderName: 'Support Team',
      content: 'Welcome to KhmerCareer! How can we help you today?',
      type: 'text',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
}

// =============================================================================
// Chat API
// =============================================================================

export type { ChatRoom, ChatMessage, SendMessageRequest };

export const chatApi = {
  // ── Get Rooms ───────────────────────────────────────────────────────────────
  async getRooms(): Promise<ChatRoom[]> {
    try {
      const response = await get<{ rooms: ChatRoom[] }>('/chat/rooms');
      setFallbackEnabled(false);
      return response.rooms || [];
    } catch {
      setFallbackEnabled(true);
      seedDefaultRooms();
      const rooms = getLocalRooms();
      return rooms.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        participants: r.participants,
        lastMessage: r.lastMessage,
        unreadCount: r.unreadCount,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })) as ChatRoom[];
    }
  },

  // ── Get Messages ────────────────────────────────────────────────────────────
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const response = await get<{ messages: ChatMessage[] }>(`/chat/rooms/${roomId}/messages`);
      return response.messages || [];
    } catch {
      const msgs = getLocalMessages(roomId);
      return msgs.map(m => ({
        id: m.id,
        roomId: m.roomId,
        senderId: m.senderId,
        senderName: m.senderName,
        senderAvatar: m.senderAvatar,
        content: m.content,
        type: m.type,
        metadata: m.metadata,
        read: m.read,
        createdAt: m.createdAt,
      })) as ChatMessage[];
    }
  },

  // ── Send Message ────────────────────────────────────────────────────────────
  async sendMessage(roomId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<ChatMessage> {
    const body: SendMessageRequest = { content, type };

    try {
      const response = await post<{ message: ChatMessage }>(`/chat/rooms/${roomId}/messages`, body);
      return response.message;
    } catch {
      // Fallback: store locally
      const newMessage: LocalChatMessage = {
        id: crypto.randomUUID(),
        roomId,
        senderId: getCurrentUserId(),
        senderName: getCurrentUserName(),
        content,
        type,
        read: true,
        createdAt: new Date().toISOString(),
      };
      saveLocalMessage(roomId, newMessage);

      // Update room's last message
      const rooms = getLocalRooms();
      const roomIdx = rooms.findIndex(r => r.id === roomId);
      if (roomIdx !== -1) {
        rooms[roomIdx].lastMessage = {
          id: newMessage.id,
          content: newMessage.content,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName,
          createdAt: newMessage.createdAt,
        };
        rooms[roomIdx].updatedAt = newMessage.createdAt;
        saveLocalRooms(rooms);
      }

      return newMessage as unknown as ChatMessage;
    }
  },

  // ── Mark Messages as Read ───────────────────────────────────────────────────
  async markAsRead(roomId: string): Promise<void> {
    try {
      await post(`/chat/rooms/${roomId}/read`, {});
    } catch {
      // Fallback: mark all local messages as read
      try {
        const all = JSON.parse(localStorage.getItem(CHAT_MESSAGES_KEY) || '{}') as Record<string, LocalChatMessage[]>;
        if (all[roomId]) {
          all[roomId] = all[roomId].map(m => ({ ...m, read: true }));
          localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(all));
        }
        // Update room unread count
        const rooms = getLocalRooms();
        const roomIdx = rooms.findIndex(r => r.id === roomId);
        if (roomIdx !== -1) {
          rooms[roomIdx].unreadCount = 0;
          saveLocalRooms(rooms);
        }
      } catch { /* */ }
    }
  },

  // ── Create Room ─────────────────────────────────────────────────────────────
  async createRoom(
    name: string,
    type: 'direct' | 'group',
    participantIds: string[],
  ): Promise<ChatRoom> {
    try {
      const response = await post<{ room: ChatRoom }>('/chat/rooms', {
        name,
        type,
        participantIds,
      });
      return response.room;
    } catch {
      // Fallback: create local room
      const newRoom: LocalChatRoom = {
        id: crypto.randomUUID(),
        name,
        type,
        participants: [
          { id: 'p1', userId: getCurrentUserId(), name: getCurrentUserName(), role: 'jobseeker' },
          ...participantIds.map((pid, i) => ({
            id: `p${i + 2}`,
            userId: pid,
            name: `User ${pid.substring(0, 6)}`,
            role: 'jobseeker' as string,
          })),
        ],
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const rooms = getLocalRooms();
      rooms.push(newRoom);
      saveLocalRooms(rooms);
      return newRoom as unknown as ChatRoom;
    }
  },

  // ── Get Total Unread Count ──────────────────────────────────────────────────
  async getUnreadCount(): Promise<number> {
    try {
      const response = await get<{ unreadCount: number }>('/chat/unread');
      return response.unreadCount || 0;
    } catch {
      return getLocalRooms().reduce((sum, r) => sum + (r.unreadCount || 0), 0);
    }
  },
};

export default chatApi;
