import type { ReactNode } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Briefcase,
  GraduationCap,
  Tag,
  Megaphone,
  Info,
  ChevronRight,
  Clock,
  Circle,
  Trash2,
  Settings,
  ExternalLink,
  Pin,
  AlertTriangle,
} from "lucide-react";

/* ═══════════════════════ TYPES ═══════════════════════ */

type NotificationCategory = "job" | "course" | "promo" | "system" | "alert";

interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  read: boolean;
  pinned: boolean;
  timestamp: string;
  link?: string;
}

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
}

/* ═══════════════════════ CATEGORY CONFIG ═══════════════════════ */

interface CategoryConfig {
  icon: ReactNode;
  bg: string;
  border: string;
  label: string;
}

const categoryConfig: Record<NotificationCategory, CategoryConfig> = {
  job: {
    icon: <Briefcase size={16} />,
    bg: "bg-blue-50 text-blue-600",
    border: "border-blue-200",
    label: "ការងារ / Job",
  },
  course: {
    icon: <GraduationCap size={16} />,
    bg: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-200",
    label: "វគ្គសិក្សា / Course",
  },
  promo: {
    icon: <Tag size={16} />,
    bg: "bg-[#D4AF37]/10 text-[#B8941F]",
    border: "border-[#D4AF37]/30",
    label: "ប្រូម៉ូសិន / Promo",
  },
  system: {
    icon: <Info size={16} />,
    bg: "bg-slate-50 text-slate-600",
    border: "border-slate-200",
    label: "ប្រព័ន្ធ / System",
  },
  alert: {
    icon: <AlertTriangle size={16} />,
    bg: "bg-red-50 text-red-600",
    border: "border-red-200",
    label: "ការព្រមាន / Alert",
  },
};

/* ═══════════════════════ TIME AGO HELPER ═══════════════════════ */

function timeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return "ឥឡូវនេះ / Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ═══════════════════════ EMPTY STATE ═══════════════════════ */

function EmptyState({ filter }: { filter: NotificationCategory | "all" }) {
  const messages: Record<string, { title: string; desc: string }> = {
    all: {
      title: "គ្មានការជូនដំណឹង / No Notifications",
      desc: "You're all caught up! Check back later for updates.",
    },
    job: {
      title: "គ្មានការងារ / No Jobs",
      desc: "No job notifications at the moment.",
    },
    course: {
      title: "គ្មានវគ្គសិក្សា / No Courses",
      desc: "No course updates right now.",
    },
    promo: {
      title: "គ្មានប្រូម៉ូសិន / No Promos",
      desc: "No promotions available currently.",
    },
    system: {
      title: "គ្មានប្រព័ន្ធ / No System",
      desc: "No system notifications to show.",
    },
    alert: {
      title: "គ្មានការព្រមាន / No Alerts",
      desc: "No alerts at this time.",
    },
  };
  const msg = messages[filter] ?? messages.all;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-10 px-4 text-center"
    >
      <div className="p-4 bg-[#2D2926]/5 rounded-full mb-3">
        <Bell size={28} className="text-[#2D2926]/20" />
      </div>
      <p className="text-sm font-medium text-[#2D2926]/50 mb-1">{msg.title}</p>
      <p className="text-xs text-[#2D2926]/35 max-w-[200px]">{msg.desc}</p>
    </motion.div>
  );
}

/* ═══════════════════════ NOTIFICATION ITEM ═══════════════════════ */

function NotificationItem({
  notification,
  onMarkRead,
  index,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  index: number;
}) {
  const config = categoryConfig[notification.category];

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }
    if (notification.link) {
      window.open(notification.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
        ease: "easeOut",
      }}
      layout
      onClick={handleClick}
      className={`group relative flex gap-3 p-3 rounded-xl cursor-pointer transition-all
        ${
          notification.read
            ? "bg-transparent hover:bg-[#2D2926]/3"
            : "bg-[#059669]/5 hover:bg-[#059669]/10"
        }
      `}
    >
      {/* unread indicator */}
      {!notification.read && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#059669]"
        />
      )}

      {/* icon */}
      <div
        className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${config.bg} border ${config.border}`}
      >
        {config.icon}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {notification.pinned && (
              <Pin size={10} className="text-[#D4AF37] shrink-0" />
            )}
            <p
              className={`text-xs font-semibold truncate ${
                notification.read ? "text-[#2D2926]/50" : "text-[#2D2926]"
              }`}
            >
              {notification.title}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-[10px] text-[#2D2926]/35">
            <Clock size={9} />
            <span>{timeAgo(notification.timestamp)}</span>
          </div>
        </div>
        <p
          className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${
            notification.read
              ? "text-[#2D2926]/35"
              : "text-[#2D2926]/65"
          }`}
        >
          {notification.message}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${config.bg} border ${config.border}`}
          >
            {config.label}
          </span>
          {notification.link && (
            <span className="flex items-center gap-0.5 text-[9px] text-[#059669]/70">
              <ExternalLink size={8} />
              Link
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════ FILTER BAR ═══════════════════════ */

const filterOptions: { value: NotificationCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "job", label: "Jobs" },
  { value: "course", label: "Courses" },
  { value: "promo", label: "Promos" },
  { value: "system", label: "System" },
  { value: "alert", label: "Alerts" },
];

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */

export default function NotificationBell({
  notifications,
  unreadCount,
  onMarkRead,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open]);

  const handleMarkAllRead = useCallback(() => {
    unreadNotifications.forEach((n) => onMarkRead(n.id));
  }, [notifications, onMarkRead]);

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.category === filter);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const pinnedNotifications = filteredNotifications.filter((n) => n.pinned);
  const normalNotifications = filteredNotifications.filter((n) => !n.pinned);

  return (
    <div className="relative inline-block">
      {/* ─── Bell Button ─── */}
      <button
        ref={bellRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`relative p-2.5 rounded-xl transition-all
          ${
            open
              ? "bg-[#059669]/10 text-[#059669] ring-2 ring-[#059669]/20"
              : "bg-[#2D2926]/5 text-[#2D2926]/60 hover:bg-[#2D2926]/10 hover:text-[#2D2926]"
          }`}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -top-1 -right-1 flex items-center justify-center
              min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white
              text-[10px] font-bold border-2 border-[#FAF8F3]"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* ─── Dropdown ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)]
              bg-[#FAF8F3] rounded-2xl shadow-2xl border border-[#2D2926]/10
              overflow-hidden z-50"
          >
            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-[#2D2926]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#059669]/10 rounded-lg">
                    <Megaphone size={18} className="text-[#059669]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D2926]">
                      ការជូនដំណឹង / 通知
                    </h3>
                    <p className="text-[10px] text-[#2D2926]/40">
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                        : "Notifications"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                        text-[11px] font-medium text-[#059669]
                        hover:bg-[#059669]/10 transition-colors"
                    >
                      <CheckCheck size={13} />
                      <span>Mark All Read</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-[#2D2926]/30 hover:text-[#2D2926]/60
                      hover:bg-[#2D2926]/5 transition-colors"
                    aria-label="Settings"
                  >
                    <Settings size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {filterOptions.map((opt) => {
                  const isActive = filter === opt.value;
                  const count =
                    opt.value === "all"
                      ? notifications.length
                      : notifications.filter((n) => n.category === opt.value)
                          .length;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFilter(opt.value)}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg
                        text-[11px] font-medium transition-all border
                        ${
                          isActive
                            ? "bg-[#059669] text-white border-[#059669]"
                            : "bg-transparent text-[#2D2926]/50 border-[#2D2926]/10 hover:border-[#2D2926]/20 hover:text-[#2D2926]/70"
                        }`}
                    >
                      {opt.label}
                      <span
                        className={`min-w-[16px] h-4 px-0.5 rounded-full text-[9px] flex items-center justify-center
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#2D2926]/8 text-[#2D2926]/40"
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Notification List ── */}
            <div className="max-h-[360px] overflow-y-auto px-3 pb-2">
              {filteredNotifications.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <div className="space-y-1">
                  {/* Pinned */}
                  {pinnedNotifications.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
                        <Pin size={10} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-semibold text-[#2D2926]/40 uppercase tracking-wider">
                          Pinned
                        </span>
                      </div>
                      <AnimatePresence>
                        {pinnedNotifications.map((n, i) => (
                          <NotificationItem
                            key={n.id}
                            notification={n}
                            onMarkRead={onMarkRead}
                            index={i}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Normal */}
                  {normalNotifications.length > 0 && (
                    <div>
                      {pinnedNotifications.length > 0 && (
                        <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
                          <Circle size={8} className="text-[#2D2926]/20" />
                          <span className="text-[10px] font-semibold text-[#2D2926]/40 uppercase tracking-wider">
                            Recent
                          </span>
                        </div>
                      )}
                      <AnimatePresence>
                        {normalNotifications.map((n, i) => (
                          <NotificationItem
                            key={n.id}
                            notification={n}
                            onMarkRead={onMarkRead}
                            index={i + pinnedNotifications.length}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-3 bg-[#2D2926]/[0.03] border-t border-[#2D2926]/10">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 text-[11px] text-[#059669] font-medium
                    hover:text-[#059669]/70 transition-colors"
                >
                  <span>View All Notifications</span>
                  <ChevronRight size={12} />
                </button>
                <div className="flex items-center gap-1 text-[10px] text-[#2D2926]/30">
                  <Trash2 size={10} />
                  <button
                    type="button"
                    className="hover:text-[#2D2926]/50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { NotificationCategory, Notification };
