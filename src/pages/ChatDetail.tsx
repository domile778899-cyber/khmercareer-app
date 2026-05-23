import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Send, Paperclip, MoreVertical, Phone, Video,
  Calendar, Info, CheckCheck, Check, Trash2, AlertTriangle,
  Building2, Briefcase, Clock,
} from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/hooks/useAuth'
import type { ChatMessage } from '@/api/chatTypes'

/* ─── Helpers ─── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return time;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`;
}

function getInitials(name: string): string {
  return name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
}

const COLORS = ['#D4AF37', '#C75B3F', '#059669', '#2563EB', '#7C3AED', '#DB2777', '#0891B2'];

function Avatar({ name, avatar, size = 40 }: { name: string; avatar?: string; size?: number }) {
  if (avatar) {
    return <img src={avatar} alt="" className={`w-[${size}px] h-[${size}px] rounded-full object-cover`} />;
  }
  const colorIdx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length;
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${COLORS[colorIdx]}, ${COLORS[(colorIdx + 1) % COLORS.length]})`,
        color: '#fff',
        fontSize: size * 0.38,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

/* ─── Message Bubble ─── */
function MessageBubble({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
  const isSystem = msg.type === 'system';
  const isInterview = msg.type === 'interview';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="px-4 py-2 bg-warm-gray/10 rounded-full text-xs text-warm-gray">
          {msg.content}
        </div>
      </div>
    );
  }

  if (isInterview) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} my-2`}>
        <div className={`max-w-[75%] p-3 rounded-2xl border ${
          isOwn ? 'bg-gold/10 border-gold/20' : 'bg-white border-warm-gray/20'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            <Calendar size={14} className="text-gold" />
            <span className="text-xs font-semibold text-charcoal">Interview Invitation</span>
          </div>
          <p className="text-sm text-charcoal">{msg.content}</p>
          {msg.metadata?.interviewDate && (
            <div className="mt-2 p-2 bg-gold/10 rounded-lg">
              <p className="text-xs text-charcoal font-medium">
                {msg.metadata.interviewDate} at {msg.metadata.interviewTime}
              </p>
              <p className="text-[10px] text-warm-gray mt-0.5">
                {msg.metadata.interviewType === 'online' ? 'Video Call' : 'In-person Interview'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} my-1.5`}>
      <div className="flex items-end gap-2 max-w-[75%]">
        {!isOwn && (
          <Avatar name={msg.senderName} size={28} />
        )}
        <div>
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed ${
              isOwn
                ? 'bg-gold text-charcoal rounded-2xl rounded-br-md'
                : 'bg-white border text-charcoal rounded-2xl rounded-bl-md shadow-sm'
            }`}
          >
            {msg.content}
          </div>
          <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? 'justify-end' : 'justify-start'} px-1`}>
            <span className="text-[10px] text-warm-gray">{formatTime(msg.createdAt)}</span>
            {isOwn && (
              msg.read ? <CheckCheck size={11} className="text-emerald" /> : <Check size={11} className="text-warm-gray" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Date Separator ─── */
function DateSeparator({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  let label: string;
  if (isToday) label = 'Today';
  else if (isYesterday) label = 'Yesterday';
  else label = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-warm-gray/20" />
      <span className="text-[11px] text-warm-gray font-medium px-2">{label}</span>
      <div className="flex-1 h-px bg-warm-gray/20" />
    </div>
  );
}

/* ─── Suggestion Chips ─── */
function SuggestionChips({
  onSelect,
  otherName,
}: {
  onSelect: (text: string) => void;
  otherName: string;
}) {
  const suggestions = [
    `Hi! I'm interested in this position.`,
    `Could you share more details about the role?`,
    `I have 3 years of experience in this field.`,
    `What's the salary range for this position?`,
    `When would be a good time for an interview?`,
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-3 px-1 -mx-1 scrollbar-hide">
      {suggestions.map((text, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(text)}
          className="shrink-0 px-3.5 py-2 bg-white border border-warm-gray/20 rounded-xl text-xs text-charcoal hover:border-gold/40 hover:bg-gold/5 transition-all whitespace-nowrap shadow-sm hover:shadow"
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/* ─── Quick Actions Panel ─── */
function QuickActions({
  otherName,
  onSendMessage,
}: {
  otherName: string;
  onSendMessage: (text: string) => void;
}) {
  const actions = [
    { icon: Calendar, label: 'Request Interview', msg: `Hi ${otherName}, I'd like to schedule an interview. When are you available?` },
    { icon: Phone, label: 'Call', msg: `Hi ${otherName}, can I call you to discuss the position?` },
    { icon: Building2, label: 'Company Info', msg: `Could you tell me more about your company?` },
    { icon: Briefcase, label: 'Job Details', msg: `Can you share more details about the job responsibilities?` },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 scrollbar-hide">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onSendMessage(action.msg)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gold/5 border border-gold/20 rounded-lg text-xs font-medium text-charcoal hover:bg-gold/10 transition-colors"
        >
          <action.icon size={13} className="text-gold" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default function ChatDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    conversations, currentMessages, sendMessage, markAsRead, startConversation,
  } = useChat();

  const [text, setText] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversation = conversations.find(c => c.id === id);
  const other = conversation?.participants.find(p => p.userId !== (user?.id || 'anonymous')) || conversation?.participants[0];
  const isOwn = (senderId: string) => senderId === (user?.id || 'anonymous');

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Mark as read when entering
  useEffect(() => {
    if (id) markAsRead(id);
  }, [id, markAsRead]);

  const handleSend = useCallback(() => {
    const content = text.trim();
    if (!content || !id) return;
    sendMessage(content);
    setText('');
    setShowSuggestion(false);
    inputRef.current?.focus();
  }, [text, id, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
    setShowSuggestion(false);
  };

  const handleQuickAction = (msg: string) => {
    sendMessage(msg);
    setShowSuggestion(false);
  };

  // Group messages by date
  const messageGroups: { date: string; messages: ChatMessage[] }[] = [];
  currentMessages.forEach(msg => {
    const dateKey = new Date(msg.createdAt).toDateString();
    const lastGroup = messageGroups[messageGroups.length - 1];
    if (lastGroup && lastGroup.date === dateKey) {
      lastGroup.messages.push(msg);
    } else {
      messageGroups.push({ date: dateKey, messages: [msg] });
    }
  });

  if (!conversation || !other) {
    return (
      <div className="min-h-screen bg-warm-white pt-24 pb-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-warm-gray/40" />
          <h2 className="text-xl font-bold text-charcoal mb-2">Conversation not found</h2>
          <p className="text-sm text-warm-gray mb-6">This chat might have been archived or removed.</p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-xl font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white pt-[72px] flex flex-col">
      {/* ─── Header ─── */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 -ml-2 rounded-xl hover:bg-warm-gray/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-charcoal" />
          </button>

          <Avatar name={other.userName} avatar={other.avatar} size={44} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-charcoal truncate">
                {other.userName}
              </h2>
              {other.userRole === 'employer' && (
                <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-full font-medium">
                  Employer
                </span>
              )}
            </div>
            <p className="text-xs text-warm-gray truncate">
              {other.company || conversation.jobTitle || 'Active now'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {other.userRole === 'employer' && (
              <button className="p-2 rounded-xl hover:bg-warm-gray/10 transition-colors text-warm-gray hover:text-charcoal">
                <Phone size={18} />
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-warm-gray/10 transition-colors text-warm-gray hover:text-charcoal"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Job Context Bar */}
        {conversation.jobTitle && (
          <div className="px-4 pb-2.5 flex items-center gap-2">
            <Link
              to={`/jobs/${conversation.jobId || '#'}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/5 border border-gold/10 rounded-lg text-xs text-charcoal hover:bg-gold/10 transition-colors"
            >
              <Briefcase size={12} className="text-gold" />
              View Job: {conversation.jobTitle}
            </Link>
          </div>
        )}

        {/* Quick Actions (only show when no messages yet) */}
        {currentMessages.length === 0 && (
          <div className="px-4 pb-3">
            <QuickActions otherName={other.userName} onSendMessage={handleQuickAction} />
          </div>
        )}
      </div>

      {/* ─── Messages Area ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Welcome Message */}
        {currentMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <Avatar name={other.userName} avatar={other.avatar} size={64} />
            <h3 className="text-lg font-bold text-charcoal mt-3">
              Chat with {other.userName}
            </h3>
            {other.company && (
              <p className="text-sm text-warm-gray">{other.company}</p>
            )}
            <p className="text-xs text-warm-gray mt-1 max-w-xs mx-auto">
              Start the conversation! Introduce yourself and mention the position you're interested in.
            </p>
          </motion.div>
        )}

        {/* Messages by date groups */}
        {messageGroups.map((group) => (
          <div key={group.date}>
            <DateSeparator dateStr={group.messages[0].createdAt} />
            <AnimatePresence>
              {group.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MessageBubble msg={msg} isOwn={isOwn(msg.senderId)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}

        {/* Suggestion Chips */}
        {showSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <SuggestionChips otherName={other.userName} onSelect={handleSuggestion} />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Area ─── */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-end gap-2">
          <button className="p-2 rounded-xl hover:bg-warm-gray/10 transition-colors text-warm-gray shrink-0">
            <Paperclip size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-warm-white rounded-xl border text-sm text-charcoal placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`p-3 rounded-xl transition-all shrink-0 ${
              text.trim()
                ? 'bg-gold text-charcoal shadow-md hover:shadow-lg hover:bg-gold/90'
                : 'bg-warm-gray/10 text-warm-gray cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
