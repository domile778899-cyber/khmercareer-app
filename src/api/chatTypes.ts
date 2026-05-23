// ── Chat Data Models ──
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'jobseeker' | 'employer';
  content: string;
  type: 'text' | 'image' | 'file' | 'system' | 'interview';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewType?: 'online' | 'offline';
    jobId?: string;
    jobTitle?: string;
  };
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    userId: string;
    userName: string;
    userRole: 'jobseeker' | 'employer';
    avatar?: string;
    company?: string;
  }[];
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  jobId?: string;
  jobTitle?: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
  createdAt: string;
  updatedAt: string;
}
