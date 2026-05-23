import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, ArrowLeft, Search, Clock, Trash2, 
  Check, CheckCheck, MoreVertical, Archive,
} from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/hooks/useAuth'

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

function getInitials(name: string): string {
  return name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
}

const COLORS = ['#D4AF37', '#C75B3F', '#059669', '#2563EB', '#7C3AED', '#DB2777', '#0891B2'];

function AvatarFallback({ name, size = 48 }: { name: string; size?: number }) {
  const colorIdx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length;
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${COLORS[colorIdx]}, ${COLORS[(colorIdx + 1) % COLORS.length]})`,
        color: '#fff',
        fontSize: size * 0.36,
      }}
    >
      {getInitials(name)}
    </div>
  )
}

function ConversationItem({
  conv,
  isActive,
  userId,
  onClick,
  onArchive,
}: {
  conv: import('@/api/chatTypes').Conversation;
  isActive: boolean;
  userId: string;
  onClick: () => void;
  onArchive: () => void;
}) {
  const other = conv.participants.find(p => p.userId !== userId) || conv.participants[0];
  const showUnread = conv.unreadCount > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      onClick={onClick}
      className={`
        flex items-center gap-3 p-4 cursor-pointer transition-all duration-200
        ${isActive ? 'bg-gold/10 border-l-2' : 'hover:bg-warm-white/80 border-l-2 border-transparent'}
      `}
      style={{ borderLeftColor: isActive ? '#D4AF37' : 'transparent' }}
    >
      <div className="relative shrink-0">
        {other.avatar ? (
          <img src={other.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <AvatarFallback name={other.userName} />
        )}
        {showUnread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C75B3F] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
            {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm text-charcoal truncate">
            {other.userName}
          </span>
          {conv.lastMessage && (
            <span className="text-[11px] text-warm-gray shrink-0">
              {timeAgo(conv.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {conv.jobTitle && (
            <span className="text-[10px] text-gold bg-gold/10 px-1.5 py-0.5 rounded-full truncate max-w-[120px]">
              {conv.jobTitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {conv.lastMessage && conv.lastMessage.senderId === userId && (
            <CheckCheck size={12} className="text-emerald shrink-0" />
          )}
          <p className={`text-xs truncate ${showUnread ? 'text-charcoal font-medium' : 'text-warm-gray'}`}>
            {conv.lastMessage?.content || 'Start a conversation'}
          </p>
        </div>
        {other.company && (
          <p className="text-[10px] text-warm-gray mt-0.5">
            {other.company}
          </p>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onArchive(); }}
        className="p-1.5 rounded-lg hover:bg-warm-gray/20 text-warm-gray hover:text-[#C75B3F] transition-colors opacity-0 group-hover:opacity-100"
        title="Archive"
      >
        <Archive size={14} />
      </button>
    </motion.div>
  );
}

export default function ChatList() {
  const { conversations, unreadTotal, setCurrentConversation, currentConversationId, archiveConversation } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const userId = user?.id || 'anonymous';

  const filteredConversations = useMemo(() => {
    let list = [...conversations];
    if (filter === 'unread') list = list.filter(c => c.unreadCount > 0);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.participants.some(p => p.userName.toLowerCase().includes(q)) ||
        c.jobTitle?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [conversations, filter, searchQuery]);

  const handleConversationClick = (id: string) => {
    setCurrentConversation(id);
    navigate(`/chat/${id}`);
  };

  return (
    <div className="min-h-screen bg-warm-white pt-24 pb-8">
      <div className="mx-auto px-4 md:px-8 lg:max-w-[800px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-xl hover:bg-gold/10 transition-colors">
              <ArrowLeft size={20} className="text-charcoal" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
                <MessageCircle size={24} className="text-gold" />
                Messages
              </h1>
              {unreadTotal > 0 && (
                <p className="text-sm text-warm-gray">
                  {unreadTotal} unread conversation{unreadTotal !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'all' ? 'bg-gold text-charcoal shadow-sm' : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                filter === 'unread' ? 'bg-gold text-charcoal shadow-sm' : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              Unread
              {unreadTotal > 0 && (
                <span className="bg-[#C75B3F] text-white text-[9px] px-1.5 py-0.5 rounded-full">{unreadTotal}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            placeholder="Search conversations or companies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border shadow-sm text-sm text-charcoal placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          />
        </div>

        {/* Conversation List */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {filteredConversations.length === 0 ? (
            <div className="py-16 text-center">
              <MessageCircle size={48} className="mx-auto mb-4 text-warm-gray/40" />
              <h3 className="text-lg font-semibold text-charcoal mb-1">No conversations yet</h3>
              <p className="text-sm text-warm-gray mb-6">
                {searchQuery ? 'No results found. Try a different search.' : 'Start chatting with employers or job seekers!'}
              </p>
              {!searchQuery && (
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-xl font-semibold hover:bg-gold/90 transition-colors"
                >
                  Browse Jobs
                </Link>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredConversations.map((conv, idx) => (
                <div key={conv.id} className="group">
                  <ConversationItem
                    conv={conv}
                    isActive={conv.id === currentConversationId}
                    userId={userId}
                    onClick={() => handleConversationClick(conv.id)}
                    onArchive={() => archiveConversation(conv.id)}
                  />
                  {idx < filteredConversations.length - 1 && (
                    <div className="mx-4 border-t border-warm-gray/10" />
                  )}
                </div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Tips */}
        {conversations.length > 0 && (
          <div className="mt-6 p-4 bg-gold/5 rounded-xl border border-gold/10">
            <p className="text-xs text-warm-gray flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" />
              Messages are end-to-end encrypted. 
              Your conversations help employers get to know you better.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
