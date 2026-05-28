import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Video, Radio, Clock, Play, Heart, Share2, Home, CheckCircle2,
  ChevronRight, MessageCircle, Calendar, Bell, Zap, Globe, DollarSign,
  Smartphone, FileText, UserCheck, Eye, Send, Bookmark, X, Plus,
  Users, Mic, MicOff, VideoOff, Settings, Flag, Info,
} from 'lucide-react';
import {
  getStreams, joinStream, leaveStream, getStreamChat, sendChatMessage,
  getStreamViewers, likeStream, followHost, createStream, setReminder,
  getReplays, getLocalStreams, saveLocalStreams, getLocalChat, saveLocalChat,
  type LiveStream, type ChatMessage, type StreamViewer,
} from '../api/liveApi';
import { useToast } from '../components/Toast';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';

/* ------------------------------------------------------------------ */
/*  Easing constants                                                    */
/* ------------------------------------------------------------------ */
const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const easeOutExpo = [0.19, 1, 0.22, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  AnimatedSection helper                                              */
/* ------------------------------------------------------------------ */
function AnimatedSection({ children, className = '', delay = 0, id }: {
  children: React.ReactNode; className?: string; delay?: number; id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section ref={ref} className={className} id={id}
      initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: easeSmooth }}>
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  LIVE Badge                                                          */
/* ------------------------------------------------------------------ */
function LiveBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'px-2 py-0.5 text-[10px]', md: 'px-3 py-1 text-xs', lg: 'px-4 py-1.5 text-sm' };
  return (
    <span className={`inline-flex items-center gap-1.5 bg-red-600 text-white font-bold rounded-md ${sizeClasses[size]}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>
      LIVE
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Counter                                                        */
/* ------------------------------------------------------------------ */
function StatCounter({ end, suffix = '', label, delay = 0 }: { end: number; suffix?: string; label: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) { setCount(end); clearInterval(counter); }
        else { setCount(Math.floor(start)); }
      }, 16);
      return () => clearInterval(counter);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, end, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-3xl md:text-4xl font-bold text-gold">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm text-warm-gray mt-1">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create Stream Modal                                                 */
/* ------------------------------------------------------------------ */
function CreateStreamModal({ onClose, onCreated }: { onClose: () => void; onCreated: (s: LiveStream) => void }) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [positionsInput, setPositionsInput] = useState('');
  const [industry, setIndustry] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { showError('请输入直播标题'); return; }
    setIsSubmitting(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const positions = positionsInput.split(',').map(p => p.trim()).filter(Boolean);
      const stream = await createStream({
        title: title.trim(),
        description: description.trim(),
        tags,
        positions,
        industry: industry || undefined,
        company: user?.fullName || undefined,
        scheduledAt: scheduledAt || undefined,
        chatEnabled: true,
        allowReplay: true,
      });
      success('直播创建成功！');
      onCreated(stream);
    } catch {
      // Fallback: create local stream
      const localStream: LiveStream = {
        id: crypto.randomUUID(),
        title,
        description,
        hostId: user?.id || 'anonymous',
        hostName: user?.fullName || 'Anonymous',
        status: 'scheduled',
        viewers: 0,
        maxViewers: 0,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        positions: positionsInput.split(',').map(p => p.trim()).filter(Boolean),
        industry: industry || undefined,
        company: user?.fullName || undefined,
        companyVerified: false,
        chatEnabled: true,
        allowReplay: true,
        replayViews: 0,
        scheduledAt: scheduledAt || new Date().toISOString(),
      };
      const existing = getLocalStreams();
      existing.push(localStream);
      saveLocalStreams(existing);
      success('直播已创建（本地模式）');
      onCreated(localStream);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="bg-[#1A1714] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500" /> 创建直播
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-white/60" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">直播标题 <span className="text-red-400">*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="例如：招聘500名制衣工人"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">直播描述</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="介绍直播内容..."
              rows={3} className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">标签（用逗号分隔）</label>
            <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="制衣, 招聘, 金边"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">招聘岗位（用逗号分隔）</label>
            <input type="text" value={positionsInput} onChange={e => setPositionsInput(e.target.value)} placeholder="缝纫工, 质检员, 主管"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">行业</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 text-sm">
              <option value="" className="bg-[#1A1714]">选择行业</option>
              <option value="Manufacturing" className="bg-[#1A1714]">制造业</option>
              <option value="Tourism" className="bg-[#1A1714]">旅游业</option>
              <option value="ICT" className="bg-[#1A1714]">信息技术</option>
              <option value="Logistics" className="bg-[#1A1714]">物流</option>
              <option value="Food Processing" className="bg-[#1A1714]">食品加工</option>
              <option value="Construction" className="bg-[#1A1714]">建筑</option>
              <option value="Finance" className="bg-[#1A1714]">金融</option>
              <option value="Other" className="bg-[#1A1714]">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">计划开始时间</label>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 text-sm" />
          </div>
          <button type="submit" disabled={isSubmitting || !title.trim()}
            className="w-full bg-gold hover:bg-[#B8941F] text-[#1A1714] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-[#1A1714]/30 border-t-[#1A1714] rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> 创建直播</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stream Player (Full Live Room)                                      */
/* ------------------------------------------------------------------ */
function StreamPlayer({ stream, onClose }: { stream: LiveStream; onClose: () => void }) {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [viewers, setViewers] = useState<StreamViewer[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [followed, setFollowed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('chat');
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  /* Fetch chat history */
  useEffect(() => {
    const loadChat = async () => {
      try {
        const msgs = await getStreamChat(stream.id);
        setMessages(msgs);
      } catch {
        // Fallback to local
        const local = getLocalChat(stream.id);
        setMessages(local.length > 0 ? local : [
          { id: '1', streamId: stream.id, userId: 'system', userName: 'System', content: '欢迎来到直播间！请文明发言。', isHR: false, createdAt: new Date().toISOString() },
        ]);
      }
    };
    loadChat();
  }, [stream.id]);

  /* Auto-scroll chat */
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  /* WebRTC + WebSocket setup */
  useEffect(() => {
    let cancelled = false;
    const setup = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
        if (cancelled) { mediaStream.getTracks().forEach(t => t.stop()); return; }
        setLocalStream(mediaStream);

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
        });
        pcRef.current = pc;

        mediaStream.getTracks().forEach(track => pc.addTrack(track, mediaStream));

        pc.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') setStreamStatus('connected');
          else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') setStreamStatus('error');
        };

        // Create offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Send offer to backend
        try {
          await apiClient.post('/webrtc/signal', {
            streamId: stream.id,
            type: 'offer',
            sdp: offer.sdp,
            fromUserId: user?.id || 'anonymous',
          });
        } catch {
          // In local mode, just show local preview
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setStreamStatus('connected');
          }
        }

        // Poll for remote stream HLS as fallback
        if (stream.hlsUrl && videoRef.current) {
          videoRef.current.src = stream.hlsUrl;
          videoRef.current.play().catch(() => {});
          setStreamStatus('connected');
        } else if (!stream.hlsUrl && videoRef.current) {
          // Show local preview as demo
          videoRef.current.srcObject = mediaStream;
          setStreamStatus('connected');
        }
      } catch {
        setStreamStatus('error');
      }
    };

    setup();

    return () => {
      cancelled = true;
      localStream?.getTracks().forEach(t => t.stop());
      pcRef.current?.close();
      wsRef.current?.close();
    };
  }, [stream.id, stream.hlsUrl]);

    /* Fetch viewers */
    useEffect(() => {
      const loadViewers = async () => {
        try {
          const v = await getStreamViewers(stream.id);
          setViewers(v);
        } catch {
          setViewers([
            { id: '1', name: 'Sokunthea P.', joinedAt: new Date().toISOString() },
            { id: '2', name: 'Visal C.', joinedAt: new Date().toISOString() },
            { id: '3', name: 'Dara S.', joinedAt: new Date().toISOString() },
            { id: '4', name: 'Chanthy S.', joinedAt: new Date().toISOString() },
            { id: '5', name: 'Ratanak P.', joinedAt: new Date().toISOString() },
          ]);
        }
      };
      loadViewers();
      const interval = setInterval(loadViewers, 30000);
      return () => clearInterval(interval);
    }, [stream.id]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const content = chatInput.trim();
    setChatInput('');
    try {
      const msg = await sendChatMessage(stream.id, content);
      setMessages(prev => [...prev, msg]);
    } catch {
      const localMsg: ChatMessage = {
        id: crypto.randomUUID(), streamId: stream.id,
        userId: user?.id || 'guest', userName: user?.fullName || '访客',
        content, isHR: false, createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, localMsg]);
      saveLocalChat(stream.id, [...messages, localMsg]);
    }
  };

  const handleLike = async () => {
    try {
      const result = await likeStream(stream.id);
      setLikeCount(result.likes);
    } catch {
      setLikeCount(prev => prev + 1);
    }
  };

  const handleFollow = async () => {
    try {
      const result = await followHost(stream.hostId);
      setFollowed(result.following);
    } catch {
      setFollowed(prev => !prev);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => { t.enabled = isMuted; });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => { t.enabled = isCameraOff; });
      setIsCameraOff(!isCameraOff);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A1714]/90 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <LiveBadge size="sm" />
          <div>
            <h3 className="text-white font-semibold text-sm truncate max-w-[200px] md:max-w-md">{stream.title}</h3>
            <p className="text-white/40 text-xs">{stream.hostName} {stream.companyVerified && <CheckCircle2 className="inline w-3 h-3 text-emerald" />}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-black/50 rounded-full px-3 py-1">
            <Eye className="w-4 h-4 text-white/60" />
            <span className="text-white text-xs font-medium">{stream.viewers + viewers.length}</span>
          </div>
          <button onClick={() => setShowViewers(!showViewers)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Users className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 relative bg-black">
          {streamStatus === 'connecting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
              <p className="text-white/60 text-sm">正在连接直播...</p>
            </div>
          )}
          {streamStatus === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <VideoOff className="w-16 h-16 text-white/30 mb-4" />
              <p className="text-white/60 text-sm">直播连接失败</p>
              <p className="text-white/40 text-xs mt-1">请检查网络或刷新页面</p>
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {/* Stream info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold">{stream.title}</h3>
            <p className="text-white/60 text-xs mt-1">{stream.description}</p>
            {stream.positions && stream.positions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {stream.positions.map(p => (
                  <span key={p} className="text-[11px] font-medium bg-gold/20 text-gold px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            )}
          </div>

          {/* Picture-in-picture local video */}
          {localStream && (
            <motion.div className="absolute top-4 right-4 w-36 h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} drag dragConstraints={{ left: -200, right: 0, top: 0, bottom: 200 }}>
              {isCameraOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-charcoal">
                  <VideoOff className="w-6 h-6 text-white/30" />
                  <span className="text-xs text-white/40 mt-1">摄像头关闭</span>
                </div>
              ) : (
                <video autoPlay playsInline muted ref={(el) => { if (el && localStream) el.srcObject = localStream; }}
                  className="w-full h-full object-cover" />
              )}
              {isMuted && (
                <div className="absolute top-2 left-2 bg-red-500/80 rounded-full p-1"><MicOff className="w-3 h-3 text-white" /></div>
              )}
            </motion.div>
          )}

          {/* Viewer list overlay */}
          <AnimatePresence>
            {showViewers && (
              <motion.div className="absolute top-12 right-4 w-56 bg-[#1A1714]/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-20"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="p-3 border-b border-white/10 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  <span className="text-white text-sm font-medium">观众 ({viewers.length})</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {viewers.map(v => (
                    <div key={v.id} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5">
                      <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">{v.name[0]}</div>
                      <span className="text-white/80 text-xs">{v.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <div className="w-80 bg-[#1A1714] border-l border-white/10 flex flex-col hidden lg:flex">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'chat' ? 'text-gold border-b-2 border-gold' : 'text-white/40 hover:text-white/60'}`}>
              <MessageCircle className="w-4 h-4 inline mr-1" />聊天
            </button>
            <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-white/40 hover:text-white/60'}`}>
              <Info className="w-4 h-4 inline mr-1" />信息
            </button>
          </div>

          {activeTab === 'chat' ? (
            <>
              {/* Chat messages */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
                {messages.map(msg => (
                  <div key={msg.id} className="flex gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${msg.isHR ? 'bg-gold text-[#1A1714]' : 'bg-white/10 text-white/60'}`}>
                      {msg.userName[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[11px] font-semibold ${msg.isHR ? 'text-gold' : 'text-white/50'}`}>@{msg.userName}</span>
                      <p className="text-white/80 text-xs mt-0.5 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="输入消息..." className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none" />
                  <button onClick={handleSendMessage} className="text-gold hover:text-[#B8941F] transition-colors p-1"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h4 className="text-gold text-sm font-semibold mb-2">直播信息</h4>
                <p className="text-white/60 text-xs leading-relaxed">{stream.description || '暂无描述'}</p>
              </div>
              {stream.tags.length > 0 && (
                <div>
                  <h4 className="text-white/80 text-xs font-semibold mb-2">标签</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stream.tags.map(t => <span key={t} className="text-[11px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </div>
              )}
              {stream.positions && stream.positions.length > 0 && (
                <div>
                  <h4 className="text-white/80 text-xs font-semibold mb-2">招聘岗位</h4>
                  {stream.positions.map(p => (
                    <div key={p} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 mb-1">
                      <span className="text-white text-xs">{p}</span>
                      <button className="text-coral text-[11px] font-semibold hover:underline">申请</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom actions */}
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className={`p-2.5 rounded-lg transition-colors ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button onClick={toggleCamera} className={`p-2.5 rounded-lg transition-colors ${isCameraOff ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
              <button onClick={handleLike} className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-white/60 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" /> <span className="text-xs">{likeCount}</span>
              </button>
              <button onClick={handleFollow} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${followed ? 'bg-white/10 text-white/60' : 'bg-gold text-[#1A1714] hover:bg-[#B8941F]'}`}>
                {followed ? '已关注' : '关注'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                        */
/* ------------------------------------------------------------------ */
function HeroSection({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="relative bg-[#1A1714] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      <div className="relative mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeOutExpo }}>
          <motion.div className="flex justify-center mb-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}>
            <LiveBadge size="lg" />
          </motion.div>
          <motion.h1 className="font-display text-[2.5rem] md:text-[4.5rem] font-bold text-[#FAF8F3] leading-[1.05] tracking-[-0.03em] mb-3"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: easeOutExpo }}>
            Live Recruitment
          </motion.h1>
          <motion.p className="text-warm-gray text-lg md:text-xl mb-2" style={{ fontFamily: 'Noto Sans Khmer, sans-serif' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
            ជ្រើសរើសបុគ្គលិកតាមផ្សាយផ្ទាល់
          </motion.p>
          <motion.p className="text-gold text-base md:text-lg mb-6" style={{ fontFamily: 'Noto Sans SC, sans-serif' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}>
            直播招聘
          </motion.p>
          <motion.p className="text-[#FAF8F3]/70 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
            Connect with candidates in real-time. Stream job openings, answer questions, hire on the spot.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}>
            <button onClick={onCreate} className="bg-gold text-[#1A1714] px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] inline-flex items-center justify-center gap-2 hover:bg-[#B8941F] hover:scale-[1.03] transition-all duration-200"
              style={{ boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}>
              <Radio size={20} /> Start Live Session
            </button>
            <Link to="#schedule" className="border-2 border-gold/50 text-gold px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition-all duration-200">
              <Calendar size={20} /> View Schedule
            </Link>
          </motion.div>
          <motion.div className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto pt-8 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}>
            <StatCounter end={50} suffix="+" label="Live Sessions" />
            <StatCounter end={10000} suffix="+" label="Candidates Reached" delay={200} />
            <StatCounter end={3} suffix="x" label="Faster Hiring" delay={400} />
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 27C1200 24 1320 18 1380 15L1440 12V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#FAF8F3" />
        </svg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Streams Section with API integration                                */
/* ------------------------------------------------------------------ */
function StreamsSection({ onJoinStream }: { onJoinStream: (s: LiveStream) => void }) {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'replays'>('live');
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [upcoming, setUpcoming] = useState<LiveStream[]>([]);
  const [replays, setReplays] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [liveResult, upcomingResult, replaysResult] = await Promise.all([
        getStreams({ status: 'live', limit: 20 }),
        getStreams({ status: 'scheduled', limit: 20 }),
        getReplays({ limit: 20 }),
      ]);
      setStreams(liveResult.streams);
      setUpcoming(upcomingResult.streams);
      setReplays(replaysResult.streams);
    } catch {
      // Fallback to localStorage + defaults
      const local = getLocalStreams();
      const defaultLive: LiveStream[] = [
        { id: '1', title: '制衣厂招聘500名工人', description: 'CamKo Textile 大型招聘直播', hostId: 'h1', hostName: 'HR Mary', status: 'live', viewers: 1247, maxViewers: 1500, tags: ['制衣', '招聘'], positions: ['缝纫工', '质检员', '主管'], company: 'CamKo Textile Group', companyVerified: true, industry: 'Manufacturing', chatEnabled: true, allowReplay: true, replayViews: 5820, startedAt: new Date().toISOString() },
        { id: '2', title: '旅游业员工招聘2025', description: '酒店招聘直播', hostId: 'h2', hostName: 'HR John', status: 'live', viewers: 856, maxViewers: 1000, tags: ['旅游', '酒店'], positions: ['前台', '客房', '餐厅'], company: 'Angkor Paradise Hotel', companyVerified: true, industry: 'Tourism', chatEnabled: true, allowReplay: true, replayViews: 3410, startedAt: new Date().toISOString() },
        { id: '3', title: 'IT开发工程师招聘', description: '科技公司招聘直播', hostId: 'h3', hostName: 'Tech HR', status: 'live', viewers: 2103, maxViewers: 3000, tags: ['IT', '开发'], positions: ['React开发', '移动端', 'IT支持'], company: 'SinoLink Technology', companyVerified: true, industry: 'ICT', chatEnabled: true, allowReplay: true, replayViews: 9200, startedAt: new Date().toISOString() },
      ];
      const localLive = local.filter(s => s.status === 'live');
      const localUpcoming = local.filter(s => s.status === 'scheduled');
      setStreams(localLive.length > 0 ? localLive : defaultLive);
      setUpcoming(localUpcoming.length > 0 ? localUpcoming : [
        { id: '4', title: '物流司机和仓库招聘', description: 'Mekong Logistics招聘', hostId: 'h4', hostName: 'Logistics HR', status: 'scheduled', viewers: 0, maxViewers: 0, tags: ['物流'], positions: ['卡车司机', '仓管', '配送'], company: 'Mekong Logistics', companyVerified: true, industry: 'Logistics', chatEnabled: true, allowReplay: true, replayViews: 0, scheduledAt: new Date(Date.now() + 86400000).toISOString() },
        { id: '5', title: '食品加工工人招聘', description: 'Golden Rice招聘', hostId: 'h5', hostName: 'Factory HR', status: 'scheduled', viewers: 0, maxViewers: 0, tags: ['食品'], positions: ['机器操作', '包装工', '质检'], company: 'Golden Rice Cambodia', companyVerified: true, industry: 'Food Processing', chatEnabled: true, allowReplay: true, replayViews: 0, scheduledAt: new Date(Date.now() + 172800000).toISOString() },
      ]);
      setReplays([
        { id: '6', title: '酒店管理层Q1招聘', description: '回放', hostId: 'h2', hostName: 'HR John', status: 'ended', viewers: 0, maxViewers: 2000, tags: ['酒店'], positions: [], company: 'Angkor Paradise Hotel', companyVerified: true, chatEnabled: true, allowReplay: true, replayViews: 5820, duration: 2700, endedAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '7', title: '高级开发技术面试', description: '回放', hostId: 'h3', hostName: 'Tech HR', status: 'ended', viewers: 0, maxViewers: 1500, tags: ['IT'], positions: [], company: 'SinoLink Technology', companyVerified: true, chatEnabled: true, allowReplay: true, replayViews: 3410, duration: 3720, endedAt: new Date(Date.now() - 172800000).toISOString() },
        { id: '8', title: '工厂工人12月招聘活动', description: '回放', hostId: 'h1', hostName: 'HR Mary', status: 'ended', viewers: 0, maxViewers: 3000, tags: ['制衣'], positions: [], company: 'CamKo Textile Group', companyVerified: true, chatEnabled: true, allowReplay: true, replayViews: 9200, duration: 2280, endedAt: new Date(Date.now() - 259200000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReminder = async (streamId: string) => {
    try {
      await setReminder(streamId);
      success('已设置提醒');
    } catch {
      success('已设置提醒（本地）');
    }
  };

  const tabs = [
    { key: 'live' as const, label: 'Live Now', icon: Radio },
    { key: 'upcoming' as const, label: 'Upcoming', icon: Calendar },
    { key: 'replays' as const, label: 'Replays', icon: Play },
  ];

  return (
    <AnimatedSection className="bg-[#FAF8F3] py-12 md:py-20" id="schedule">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#2D2926] leading-[1.15] tracking-[-0.01em]">Live Sessions</h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">Watch, interact, and apply in real-time. Join live recruitment sessions from top employers in Cambodia.</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#F5F0E8] rounded-xl p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === tab.key ? 'bg-gold text-[#1A1714]' : 'text-warm-gray hover:text-charcoal'}`}>
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {activeTab === 'live' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {streams.length === 0 && (
                    <div className="col-span-full text-center py-12 text-warm-gray">暂无正在直播的内容</div>
                  )}
                  {streams.map(stream => (
                    <motion.div key={stream.id} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
                      className="bg-white border border-[#E8E0D0] rounded-2xl overflow-hidden hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300 cursor-pointer"
                      onClick={() => onJoinStream(stream)}>
                      <div className={`relative h-44 flex items-center justify-center ${stream.industry === 'Manufacturing' ? 'bg-amber-800' : stream.industry === 'Tourism' ? 'bg-teal-700' : stream.industry === 'ICT' ? 'bg-indigo-700' : 'bg-[#2D2926]'}`}>
                        <div className="absolute top-3 left-3"><LiveBadge size="sm" /></div>
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
                          <Eye size={12} className="text-white" />
                          <span className="text-white text-xs font-medium">{stream.viewers.toLocaleString()}</span>
                        </div>
                        <Play size={48} className="text-white/80 drop-shadow-lg" fill="white" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-[#2D2926]">{stream.company || stream.hostName}</span>
                          {stream.companyVerified && <CheckCircle2 size={14} className="text-emerald" />}
                        </div>
                        <h3 className="font-semibold text-[#1A1714] mb-3 leading-snug">{stream.title}</h3>
                        {stream.positions && stream.positions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {stream.positions.map(pos => <span key={pos} className="text-[11px] font-medium bg-[#F5F0E8] text-[#2D2926] px-2.5 py-1 rounded-full">{pos}</span>)}
                          </div>
                        )}
                        <button className="w-full bg-coral text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#C44B2F] hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2">
                          <Video size={16} /> Join Stream
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'upcoming' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.length === 0 && (
                    <div className="col-span-full text-center py-12 text-warm-gray">暂无计划中的直播</div>
                  )}
                  {upcoming.map(stream => (
                    <motion.div key={stream.id} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
                      className="bg-white border border-[#E8E0D0] rounded-2xl p-5 hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-[#2D2926]">{stream.company || stream.hostName}</span>
                        {stream.companyVerified && <CheckCircle2 size={14} className="text-emerald" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-coral text-sm font-medium mb-3">
                        <Clock size={14} />
                        {stream.scheduledAt ? new Date(stream.scheduledAt).toLocaleString() : '待定'}
                      </div>
                      <h3 className="font-semibold text-[#1A1714] mb-3 leading-snug">{stream.title}</h3>
                      {stream.positions && stream.positions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {stream.positions.map(pos => <span key={pos} className="text-[11px] font-medium bg-[#F5F0E8] text-[#2D2926] px-2.5 py-1 rounded-full">{pos}</span>)}
                        </div>
                      )}
                      <button onClick={() => handleReminder(stream.id)}
                        className="w-full border-2 border-gold text-gold py-2.5 rounded-xl text-sm font-semibold hover:bg-gold/10 transition-all duration-200 flex items-center justify-center gap-2">
                        <Bell size={16} /> Remind Me
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'replays' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {replays.length === 0 && (
                    <div className="col-span-full text-center py-12 text-warm-gray">暂无回放</div>
                  )}
                  {replays.map(stream => (
                    <motion.div key={stream.id} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}
                      className="bg-white border border-[#E8E0D0] rounded-2xl overflow-hidden hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300 cursor-pointer"
                      onClick={() => onJoinStream(stream)}>
                      <div className="relative h-40 bg-[#2D2926] flex items-center justify-center">
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
                          <Play size={10} className="text-white" />
                          <span className="text-white text-xs">{Math.floor((stream.duration || 0) / 60)} min</span>
                        </div>
                        <Play size={40} className="text-white/70 drop-shadow-lg" fill="white" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-[#2D2926]">{stream.company || stream.hostName}</span>
                          {stream.companyVerified && <CheckCircle2 size={14} className="text-emerald" />}
                        </div>
                        <h3 className="font-semibold text-[#1A1714] mb-3 leading-snug">{stream.title}</h3>
                        <div className="flex items-center justify-between text-warm-gray text-sm mb-4">
                          <span className="flex items-center gap-1"><Eye size={14} /> {stream.replayViews.toLocaleString()} views</span>
                          <span className="flex items-center gap-1 text-emerald"><UserCheck size={14} /> 回放</span>
                        </div>
                        <button className="w-full bg-[#F5F0E8] text-[#2D2926] py-2.5 rounded-xl text-sm font-semibold hover:bg-gold/20 transition-all duration-200 flex items-center justify-center gap-2">
                          <Play size={16} /> Watch Replay
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AnimatedSection>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Live / How to Go Live / Success / CTA (existing)                */
/* ------------------------------------------------------------------ */

const valueProps = [
  { icon: MessageCircle, title: 'Real-time Interaction', description: 'Answer candidate questions instantly during the live stream. No more back-and-forth emails or missed calls.', color: 'text-emerald', bg: 'bg-emerald/10' },
  { icon: Globe, title: 'Wider Reach', description: 'Connect with 1,000+ candidates simultaneously. Reach job seekers across all 25 provinces of Cambodia.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Zap, title: 'Faster Hiring', description: 'Reduce your hiring cycle from weeks to days. Interview, screen, and hire candidates in a single session.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: DollarSign, title: 'Cost Effective', description: 'Save up to 80% compared to traditional job fairs. No booth rental, no travel costs, no printed materials.', color: 'text-coral', bg: 'bg-coral/10' },
];

function WhyLiveSection() {
  return (
    <AnimatedSection className="bg-[#FAF8F3] py-12 md:py-20">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#2D2926] leading-[1.15] tracking-[-0.01em]">Why Live Recruitment?</h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">The future of hiring is here. See why top employers in Cambodia are going live.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, i) => {
            const Icon = prop.icon;
            return (
              <motion.div key={prop.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white border border-[#E8E0D0] rounded-2xl p-6 hover:shadow-[0_12px_32px_rgba(26,23,20,0.12)] hover:border-gold transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${prop.bg} flex items-center justify-center mb-4`}><Icon size={24} className={prop.color} /></div>
                <h3 className="font-semibold text-[#1A1714] text-lg mb-2">{prop.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{prop.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

const goLiveSteps = [
  { step: '01', title: 'Prepare', description: 'Upload your job details, set your stream schedule, and customize your company profile.', icon: FileText },
  { step: '02', title: 'Go Live', description: 'One-click streaming from your phone or computer. No special equipment needed.', icon: Radio },
  { step: '03', title: 'Hire', description: 'Review applications in real-time, schedule follow-up interviews, and make offers.', icon: UserCheck },
];

function HowToGoLiveSection() {
  return (
    <AnimatedSection className="bg-[#1A1714] py-12 md:py-20">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#FAF8F3] leading-[1.15] tracking-[-0.01em]">For Employers — How to Go Live</h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">Three simple steps to start your live recruitment journey on KhmerHR.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-1/4 left-[30%] right-[30%] h-px bg-gold/20" />
          {goLiveSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.15, duration: 0.6 }} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5"><Icon size={28} className="text-gold" /></div>
                <span className="text-gold/40 font-mono text-sm font-bold">{s.step}</span>
                <h3 className="font-semibold text-[#FAF8F3] text-xl mt-2 mb-3">{s.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed max-w-xs mx-auto">{s.description}</p>
                {i < goLiveSteps.length - 1 && <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-gold/20"><ChevronRight size={24} /></div>}
              </motion.div>
            );
          })}
        </div>
        <motion.div className="text-center mt-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
          <Link to="/employers" className="inline-flex items-center gap-2 bg-gold text-[#1A1714] px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] hover:bg-[#B8941F] hover:scale-[1.03] transition-all duration-200"
            style={{ boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}>
            <Smartphone size={20} /> Get Started as an Employer
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

const successStories = [
  { company: 'CamKo Textile Group', industry: 'Manufacturing', hired: 342, days: 14, previous: '45 days', quote: 'Live recruitment changed everything. We filled all positions in 2 weeks instead of 2 months.' },
  { company: 'Angkor Paradise Hotel', industry: 'Tourism & Hospitality', hired: 56, days: 21, previous: '60 days', quote: 'We connected with talented hospitality graduates in real-time. Quality hires, faster.' },
  { company: 'SinoLink Technology', industry: 'ICT', hired: 18, days: 10, previous: '30 days', quote: 'Found senior developers through live technical interviews. Saved 80% on recruitment costs.' },
];

function SuccessStoriesSection() {
  return (
    <AnimatedSection className="bg-[#F5F0E8] py-12 md:py-20">
      <div className="mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-[1.625rem] md:text-[2.25rem] font-semibold text-[#2D2926] leading-[1.15] tracking-[-0.01em]">Success Stories</h2>
          <p className="text-warm-gray mt-2 max-w-lg mx-auto">See how leading Cambodian companies transformed their hiring with live recruitment.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, i) => (
            <motion.div key={story.company} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white border border-[#E8E0D0] rounded-2xl p-6 hover:shadow-[0_16px_40px_rgba(26,23,20,0.1)] hover:border-gold transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">{story.company[0]}</div>
                <div><h3 className="font-semibold text-[#1A1714] text-sm">{story.company}</h3><p className="text-warm-gray text-xs">{story.industry}</p></div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="bg-emerald/10 rounded-lg px-3 py-2 text-center flex-1"><p className="text-emerald font-bold text-lg">{story.hired}</p><p className="text-emerald/70 text-[11px]">Hired</p></div>
                <div className="bg-gold/10 rounded-lg px-3 py-2 text-center flex-1"><p className="text-gold font-bold text-lg">{story.days}</p><p className="text-gold/70 text-[11px]">Days</p></div>
                <div className="bg-coral/10 rounded-lg px-3 py-2 text-center flex-1"><p className="text-coral font-bold text-lg line-through">{story.previous}</p><p className="text-coral/70 text-[11px]">Before</p></div>
              </div>
              <div className="relative">
                <Bookmark size={20} className="absolute -top-1 -left-1 text-gold/20" fill="currentColor" />
                <p className="text-warm-gray text-sm leading-relaxed pl-4 italic">{story.quote}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function CTASection() {
  return (
    <AnimatedSection className="bg-[#1A1714] py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/8 blur-[100px]" />
      <div className="relative mx-auto lg:max-w-[1200px] xl:max-w-[1320px] px-4 md:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="font-display text-[2rem] md:text-[3rem] font-bold text-[#FAF8F3] leading-[1.1] tracking-[-0.02em] mb-4">Ready to Go Live?</h2>
          <p className="text-warm-gray text-base md:text-lg max-w-xl mx-auto mb-8">Join the recruitment revolution. Start streaming your job openings and connect with candidates in real-time.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/employers" className="inline-flex items-center gap-2 bg-gold text-[#1A1714] px-8 py-4 rounded-xl text-button font-semibold min-h-[56px] hover:bg-[#B8941F] hover:scale-[1.03] transition-all duration-200"
              style={{ boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}><Radio size={20} /> Start Your First Live Session — Free</Link>
          </div>
          <p className="text-warm-gray/60 text-sm mt-4">No credit card required. Free for first 3 sessions.</p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                           */
/* ================================================================== */
export default function Live() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStreamCreated = (stream: LiveStream) => {
    setShowCreateModal(false);
    setRefreshKey(k => k + 1);
    setActiveStream(stream);
  };

  return (
    <div className="flex-1" key={refreshKey}>
      <HeroSection onCreate={() => setShowCreateModal(true)} />
      <StreamsSection onJoinStream={setActiveStream} />
      <WhyLiveSection />
      <HowToGoLiveSection />
      <SuccessStoriesSection />
      <CTASection />

      <AnimatePresence>
        {showCreateModal && <CreateStreamModal onClose={() => setShowCreateModal(false)} onCreated={handleStreamCreated} />}
      </AnimatePresence>

      <AnimatePresence>
        {activeStream && <StreamPlayer stream={activeStream} onClose={() => setActiveStream(null)} />}
      </AnimatePresence>
    </div>
  );
}
