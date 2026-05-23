import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Shield,
  CircleDot,
} from "lucide-react";

/* ── types ── */
interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

/* ── navigation data ── */
const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Jobs", icon: Briefcase, path: "/admin/jobs" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "User Management",
  "/admin/courses": "Course Management",
  "/admin/jobs": "Job Management",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── sidebar component ── */
function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const activeCount = {
    courses: 5,
    employers: 8,
    payouts: 3,
    tickets: 7,
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 z-50 h-screen w-[240px] flex-col bg-[#1A1714] lg:flex ${
          isOpen ? "flex" : "hidden"
        }`}
        initial={false}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo area */}
        <div className="flex flex-col items-center border-b border-white/10 px-4 py-6">
          <div
            className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(212,175,55,0.2)" }}
          >
            <Shield size={22} style={{ color: "#D4AF37" }} />
          </div>
          <h1
            className="text-lg font-bold tracking-wide"
            style={{ color: "#D4AF37" }}
          >
            高棉职通车
          </h1>
          <span
            className="mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "#D4AF3720", color: "#D4AF37" }}
          >
            Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              Main Menu
            </span>
          </div>
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: active ? "rgba(212,175,55,0.15)" : "transparent",
                  color: active ? "#D4AF37" : "rgba(255,255,255,0.65)",
                  borderLeft: active ? "2px solid #D4AF37" : "2px solid transparent",
                }}
              >
                <Icon
                  size={18}
                  className={active ? "text-[#D4AF37]" : "text-white/40 group-hover:text-white/70"}
                />
                <span>{item.label}</span>
                {item.label === "Courses" && activeCount.courses > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37]/20 px-1.5 text-[10px] font-bold text-[#D4AF37]">
                    {activeCount.courses}
                  </span>
                )}
                {item.label === "Users" && activeCount.employers > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#059669]/20 px-1.5 text-[10px] font-bold text-[#059669]">
                    {activeCount.employers}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-6 mb-2 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              Quick Stats
            </span>
          </div>
          <div className="space-y-1 px-3">
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CircleDot size={10} className="text-[#059669]" />
                Online Users
              </span>
              <span className="text-white/60">342</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CircleDot size={10} className="text-[#D4AF37]" />
                Pending Tasks
              </span>
              <span className="text-white/60">{activeCount.courses + activeCount.payouts + activeCount.tickets}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CircleDot size={10} className="text-[#E85D3E]" />
                Alerts
              </span>
              <span className="text-white/60">2</span>
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 px-3 py-3">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: "#D4AF37" }}
              >
                A
              </div>
              <div className="flex flex-1 flex-col items-start overflow-hidden">
                <span className="truncate text-sm font-medium text-white">Admin User</span>
                <span className="truncate text-xs text-white/50">admin@kmjob.com</span>
              </div>
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-white/50" />
              </motion.div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-white/10 bg-[#2D2926] shadow-xl"
                >
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/admin/settings");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Settings size={14} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-white/10"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back to site */}
          <motion.button
            whileHover={{ x: -2 }}
            onClick={() => navigate("/")}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-[#D4AF37]"
          >
            <ArrowLeft size={14} />
            Back to Site
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}

/* ── header component ── */
interface HeaderProps {
  onMenuToggle: () => void;
}

function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const title = pageTitles[location.pathname] || "Dashboard";

  const notifications = [
    { id: 1, text: "New course pending approval", time: "2 min ago", type: "course" },
    { id: 2, text: "New employer registration", time: "15 min ago", type: "user" },
    { id: 3, text: "Support ticket #1284 received", time: "1 hr ago", type: "ticket" },
  ];

  return (
    <header
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#1A1714]/10 px-4 lg:px-6"
      style={{ left: "0px", backgroundColor: "#FAF8F3" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-[#2D2926] hover:bg-[#1A1714]/5 lg:hidden"
        >
          <Menu size={20} />
        </motion.button>
        <motion.h2
          key={title}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-semibold text-[#2D2926]"
        >
          {title}
        </motion.h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="absolute right-8 top-1/2 -translate-y-1/2 rounded-lg border border-[#1A1714]/10 bg-white py-1.5 pl-3 pr-3 text-sm text-[#2D2926] shadow-sm outline-none focus:border-[#D4AF37]"
              />
            )}
          </AnimatePresence>
          <button
            onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}
            className="relative rounded-lg p-2 text-[#2D2926]/60 hover:bg-[#1A1714]/5 hover:text-[#2D2926]"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserDropdownOpen(false);
            }}
            className="relative rounded-lg p-2 text-[#2D2926]/60 hover:bg-[#1A1714]/5 hover:text-[#2D2926]"
          >
            <Bell size={18} />
            <span
              className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: "#E85D3E" }}
            >
              3
            </span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[#1A1714]/10 bg-white shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-[#1A1714]/10 px-4 py-3">
                    <span className="text-sm font-semibold text-[#2D2926]">Notifications</span>
                    <span className="rounded-full bg-[#E85D3E]/10 px-2 py-0.5 text-[10px] font-bold text-[#E85D3E]">
                      3 new
                    </span>
                  </div>
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: n.id * 0.05 }}
                      className="flex items-start gap-3 border-b border-[#1A1714]/5 px-4 py-3 last:border-0 hover:bg-[#F5F0E8]"
                    >
                      <div
                        className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: n.type === "course" ? "#D4AF37" : n.type === "user" ? "#059669" : "#E85D3E",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[#2D2926]">{n.text}</p>
                        <p className="mt-0.5 text-xs text-[#2D2926]/50">{n.time}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div className="border-t border-[#1A1714]/10 px-4 py-2.5">
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ color: "#D4AF37" }}
                    >
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="relative ml-1">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-[#1A1714]/5"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: "#D4AF37" }}
            >
              A
            </div>
            <span className="hidden text-sm font-medium text-[#2D2926] sm:inline">
              Admin
            </span>
            <motion.div
              animate={{ rotate: userDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} className="text-[#2D2926]/50" />
            </motion.div>
          </button>

          <AnimatePresence>
            {userDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[#1A1714]/10 bg-white shadow-lg"
                >
                  <div className="border-b border-[#1A1714]/10 px-4 py-3">
                    <p className="text-sm font-medium text-[#2D2926]">Admin User</p>
                    <p className="text-xs text-[#2D2926]/50">admin@kmjob.com</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#2D2926]/70 hover:bg-[#F5F0E8]"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      window.location.href = "/";
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

/* ── main layout ── */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login', { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, user, navigate]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-4 border-[#D4AF37] border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      <main className="pt-16 transition-all duration-300 lg:ml-[240px]" style={{ minHeight: "100vh" }}>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
