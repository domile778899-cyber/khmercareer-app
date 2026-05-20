import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  BookOpen,
  Briefcase,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Building2,
  Wallet,
  Ticket,
  ChevronRight,
  UserCheck,
  FileCheck,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* ── data ── */
const revenueData = [
  { month: "Jan", value: 15200 },
  { month: "Feb", value: 18500 },
  { month: "Mar", value: 16200 },
  { month: "Apr", value: 19800 },
  { month: "May", value: 21400 },
  { month: "Jun", value: 24580 },
];

const userGrowthData = [
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 9800 },
  { month: "Mar", value: 10500 },
  { month: "Apr", value: 11800 },
  { month: "May", value: 13200 },
  { month: "Jun", value: 15420 },
];

const pieData = [
  { name: "English", value: 35, color: "#D4AF37" },
  { name: "IT", value: 25, color: "#059669" },
  { name: "Business", value: 20, color: "#E85D3E" },
  { name: "Factory", value: 12, color: "#8B7355" },
  { name: "Other", value: 8, color: "#A39E99" },
];

const recentSignups = [
  { name: "Sophea Kim", email: "sophea@email.com", date: "2025-06-20", role: "Job Seeker", avatar: "SK" },
  { name: "Meng Li", email: "meng@sinolink.com", date: "2025-06-19", role: "Employer", avatar: "ML" },
  { name: "John Smith", email: "john@english.com", date: "2025-06-18", role: "Teacher", avatar: "JS" },
  { name: "Chantrea Sovann", email: "chantrea@email.com", date: "2025-06-17", role: "Job Seeker", avatar: "CS" },
  { name: "Wei Zhang", email: "wei@factory.com", date: "2025-06-16", role: "Employer", avatar: "WZ" },
];

const quickActions = [
  {
    label: "Approve Pending Courses",
    count: 5,
    subtitle: "pending approval",
    icon: FileCheck,
    color: "#D4AF37",
    bg: "rgba(212,175,55,0.12)",
  },
  {
    label: "Review New Employers",
    count: 8,
    subtitle: "new registrations",
    icon: Building2,
    color: "#059669",
    bg: "rgba(5,150,105,0.12)",
  },
  {
    label: "Process Payout Requests",
    count: 3,
    subtitle: "awaiting processing",
    icon: Wallet,
    color: "#E85D3E",
    bg: "rgba(232,93,62,0.12)",
  },
  {
    label: "View Support Tickets",
    count: 7,
    subtitle: "open tickets",
    icon: Ticket,
    color: "#8B7355",
    bg: "rgba(139,115,85,0.12)",
  },
];

const activityLog = [
  { action: "New user registered", detail: "Sophea Kim joined as Job Seeker", time: "2 min ago", icon: UserCheck, color: "#059669" },
  { action: "Course approved", detail: "Business English Mastery was approved", time: "15 min ago", icon: CheckCircle, color: "#D4AF37" },
  { action: "Job posted", detail: "Garment Factory Worker in Phnom Penh", time: "32 min ago", icon: Briefcase, color: "#E85D3E" },
  { action: "New employer", detail: "Sinolink Tech registered", time: "1 hr ago", icon: Building2, color: "#8B7355" },
  { action: "Course published", detail: "Python Basics by Kimly Chea", time: "2 hr ago", icon: BookOpen, color: "#059669" },
  { action: "User upgraded", detail: "Meng Li upgraded to premium", time: "3 hr ago", icon: TrendingUp, color: "#D4AF37" },
  { action: "Payout processed", detail: "$1,240 sent to John Smith", time: "4 hr ago", icon: Wallet, color: "#E85D3E" },
  { action: "Support resolved", detail: "Ticket #1283 marked as resolved", time: "5 hr ago", icon: CheckCircle, color: "#059669" },
];

/* ── stat card ── */
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "neutral";
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#2D2926]/60">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[#2D2926]">{value}</p>
          <div className="mt-1.5 flex items-center gap-1">
            <TrendingUp
              size={14}
              style={{ color: changeType === "positive" ? "#059669" : "#E85D3E" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: changeType === "positive" ? "#059669" : "#E85D3E" }}
            >
              {change}
            </span>
          </div>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── chart tooltip ── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#1A1714]/10 bg-white px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-[#2D2926]/60">{label}</p>
        <p className="text-sm font-bold" style={{ color: "#D4AF37" }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#1A1714]/10 bg-white px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-[#2D2926]/60">{label}</p>
        <p className="text-sm font-bold" style={{ color: "#059669" }}>
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"6m" | "1y" | "all">("6m");

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value="15,420"
          change="+12%"
          changeType="positive"
          icon={Users}
          iconBg="rgba(212,175,55,0.12)"
          iconColor="#D4AF37"
        />
        <StatCard
          title="Active Courses"
          value="128"
          change="+8 new"
          changeType="positive"
          icon={BookOpen}
          iconBg="rgba(5,150,105,0.12)"
          iconColor="#059669"
        />
        <StatCard
          title="Jobs Posted"
          value="3,450"
          change="+156"
          changeType="positive"
          icon={Briefcase}
          iconBg="rgba(232,93,62,0.12)"
          iconColor="#E85D3E"
        />
        <StatCard
          title="Revenue"
          value="$24,580"
          change="+23%"
          changeType="positive"
          icon={DollarSign}
          iconBg="rgba(139,115,85,0.12)"
          iconColor="#8B7355"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <motion.div
          variants={fadeUp}
          className="col-span-1 rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#2D2926]">Revenue Overview</h3>
              <p className="mt-0.5 text-xs text-[#2D2926]/50">Monthly revenue for the current period</p>
            </div>
            <div className="flex rounded-lg border border-[#1A1714]/10 p-0.5">
              {(["6m", "1y", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: selectedPeriod === p ? "#D4AF37" : "transparent",
                    color: selectedPeriod === p ? "#fff" : "#2D2926",
                  }}
                >
                  {p === "6m" ? "6 Months" : p === "1y" ? "1 Year" : "All"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1714" opacity={0.06} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#2D2926", opacity: 0.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#2D2926", opacity: 0.5 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#D4AF37"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={{ r: 4, fill: "#D4AF37", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Course Categories Pie */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <h3 className="text-base font-semibold text-[#2D2926]">Course Categories</h3>
          <p className="mt-0.5 text-xs text-[#2D2926]/50">Distribution by category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-[#2D2926]/70">
                  {item.name} {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* User Growth Bar */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#2D2926]">User Growth</h3>
            <p className="mt-0.5 text-xs text-[#2D2926]/50">New user registrations over time</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1714" opacity={0.06} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#2D2926", opacity: 0.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#2D2926", opacity: 0.5 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Signups */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#2D2926]">Recent Signups</h3>
              <p className="mt-0.5 text-xs text-[#2D2926]/50">Latest user registrations</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "#D4AF37" }}>
              View All
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentSignups.map((user, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#F5F0E8]"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#D4AF37" }}
                >
                  {user.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#2D2926]">{user.name}</p>
                  <p className="truncate text-xs text-[#2D2926]/50">{user.email}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: user.role === "Employer" ? "rgba(5,150,105,0.12)" : user.role === "Teacher" ? "rgba(232,93,62,0.12)" : "rgba(212,175,55,0.12)",
                    color: user.role === "Employer" ? "#059669" : user.role === "Teacher" ? "#E85D3E" : "#D4AF37",
                  }}
                >
                  {user.role}
                </span>
                <span className="shrink-0 text-xs text-[#2D2926]/40">{user.date}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <h3 className="mb-3 text-base font-semibold text-[#2D2926]">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                whileHover={{ y: -2 }}
                className="flex items-center gap-3.5 rounded-xl border border-[#1A1714]/8 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: action.bg }}
                >
                  <Icon size={20} style={{ color: action.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#2D2926]">{action.label}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold" style={{ color: action.color }}>
                      {action.count}
                    </span>
                    <span className="text-xs text-[#2D2926]/50">{action.subtitle}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="shrink-0 text-[#2D2926]/30" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Activity Log */}
      <motion.div
        variants={fadeUp}
        className="rounded-xl border border-[#1A1714]/8 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#2D2926]">Recent Activity</h3>
            <p className="mt-0.5 text-xs text-[#2D2926]/50">Latest actions across the platform</p>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "#D4AF37" }}>
            View All
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-1">
          {activityLog.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-[#F5F0E8]"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${item.color}18` }}
                >
                  <Icon size={16} style={{ color: item.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#2D2926]">{item.action}</p>
                  <p className="truncate text-xs text-[#2D2926]/50">{item.detail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-[#2D2926]/40">
                  <Clock size={12} />
                  {item.time}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
