/**
 * KhmerCareer - Live Streaming API Module
 * Handles live streams, WebRTC signaling, and chat
 */

import { apiClient } from './client';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  status: 'live' | 'scheduled' | 'ended';
  thumbnailUrl?: string;
  viewers: number;
  maxViewers: number;
  startedAt?: string;
  scheduledAt?: string;
  endedAt?: string;
  tags: string[];
  positions?: string[];
  company?: string;
  companyVerified?: boolean;
  industry?: string;
  chatEnabled: boolean;
  allowReplay: boolean;
  replayViews: number;
  duration?: number;
  hlsUrl?: string;
  webrtcUrl?: string;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  isHR: boolean;
  createdAt: string;
}

export interface StreamViewer {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: string;
}

export interface CreateStreamPayload {
  title: string;
  description: string;
  tags: string[];
  scheduledAt?: string;
  positions?: string[];
  company?: string;
  industry?: string;
  chatEnabled?: boolean;
  allowReplay?: boolean;
}

export interface WebRTCSignalPayload {
  streamId: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  sdp?: string;
  candidate?: RTCIceCandidateInit;
  fromUserId: string;
  toUserId?: string;
}

export interface StreamStats {
  totalStreams: number;
  liveNow: number;
  totalViewers: number;
  totalReplays: number;
  avgDuration: number;
}

/* ═══════════════════════════════════════════
   API Functions
   ═══════════════════════════════════════════ */

export async function getStreams(params?: {
  status?: 'live' | 'scheduled' | 'ended';
  industry?: string;
  page?: number;
  limit?: number;
}): Promise<{ streams: LiveStream[]; total: number }> {
  const response = await apiClient.get('/live/streams', { params });
  return response.data as { streams: LiveStream[]; total: number };
}

export async function getStreamById(streamId: string): Promise<LiveStream> {
  const response = await apiClient.get(`/live/streams/${streamId}`);
  return response.data as LiveStream;
}

export async function createStream(payload: CreateStreamPayload): Promise<LiveStream> {
  const response = await apiClient.post('/live/streams', payload);
  return response.data as LiveStream;
}

export async function endStream(streamId: string): Promise<LiveStream> {
  const response = await apiClient.post(`/live/streams/${streamId}/end`);
  return response.data as LiveStream;
}

export async function joinStream(streamId: string): Promise<{ token: string; stream: LiveStream }> {
  const response = await apiClient.post(`/live/streams/${streamId}/join`);
  return response.data as { token: string; stream: LiveStream };
}

export async function leaveStream(streamId: string): Promise<void> {
  await apiClient.post(`/live/streams/${streamId}/leave`);
}

export async function getStreamChat(streamId: string, params?: { before?: string; limit?: number }): Promise<ChatMessage[]> {
  const response = await apiClient.get(`/live/streams/${streamId}/chat`, { params });
  return response.data as ChatMessage[];
}

export async function sendChatMessage(streamId: string, content: string): Promise<ChatMessage> {
  const response = await apiClient.post(`/live/streams/${streamId}/chat`, { content });
  return response.data as ChatMessage;
}

export async function getStreamViewers(streamId: string): Promise<StreamViewer[]> {
  const response = await apiClient.get(`/live/streams/${streamId}/viewers`);
  return response.data as StreamViewer[];
}

export async function sendWebRTCSignal(payload: WebRTCSignalPayload): Promise<void> {
  await apiClient.post('/webrtc/signal', payload);
}

export async function getWebRTCSignals(streamId: string): Promise<WebRTCSignalPayload[]> {
  const response = await apiClient.get(`/webrtc/signals/${streamId}`);
  return response.data as WebRTCSignalPayload[];
}

export async function getStreamStats(): Promise<StreamStats> {
  const response = await apiClient.get('/live/stats');
  return response.data as StreamStats;
}

export async function setReminder(streamId: string): Promise<void> {
  await apiClient.post(`/live/streams/${streamId}/reminder`);
}

export async function getReplays(params?: { page?: number; limit?: number }): Promise<{ streams: LiveStream[]; total: number }> {
  const response = await apiClient.get('/live/replays', { params });
  return response.data as { streams: LiveStream[]; total: number };
}

export async function likeStream(streamId: string): Promise<{ likes: number }> {
  const response = await apiClient.post(`/live/streams/${streamId}/like`);
  return response.data as { likes: number };
}

export async function followHost(hostId: string): Promise<{ following: boolean }> {
  const response = await apiClient.post(`/live/follow/${hostId}`);
  return response.data as { following: boolean };
}

/* ═══════════════════════════════════════════
   LocalStorage Fallback Helpers
   ═══════════════════════════════════════════ */

const LS_STREAMS_KEY = 'khmercareer_live_streams';
const LS_CHAT_PREFIX = 'khmercareer_live_chat_';

export function getLocalStreams(): LiveStream[] {
  try {
    const raw = localStorage.getItem(LS_STREAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalStreams(streams: LiveStream[]): void {
  try {
    localStorage.setItem(LS_STREAMS_KEY, JSON.stringify(streams));
  } catch {
    // silent
  }
}

export function getLocalChat(streamId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(`${LS_CHAT_PREFIX}${streamId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalChat(streamId: string, messages: ChatMessage[]): void {
  try {
    localStorage.setItem(`${LS_CHAT_PREFIX}${streamId}`, JSON.stringify(messages.slice(-200)));
  } catch {
    // silent
  }
}
