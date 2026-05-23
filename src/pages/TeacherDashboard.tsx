import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  BarChart3,
  Upload,
  Search,
  ChevronRight,
  Award,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/* ── mock data ── */
const teacherProfile = {
  name: "Sopheap Meas",
  title: "English & Hospitality Instructor",
  avatar: "SM",
  joinDate: "2023-03-15",
  bio: "Experienced language teacher specializing in workplace English for hospitality and tourism professionals. Former head of training at Raffles Hotel.",
  revenue: 2840,
  totalStudents: 342,
  totalCourses: 8,
  avgRating: 4.7,
  ratingCount: 156,
};

const revenueData = [
  { month: "Jan", revenue: 320 },
  { month: "Feb", revenue: 450 },
  { month: "Mar", revenue: 380 },
  { month: "Apr", revenue: 520 },
  { month: "May", revenue: 480 },
  { month: "Jun", revenue: 620 },
];

const recentStudents = [
  { name: "Sok Dara", course: "Hotel English", date: "2024-06-12", progress: 65, price: 19.99 },
  { name: "Channary Kim", course: "Factory Safety", date: "2024-06-11", progress: 30, price: 29.99 },
  { name: "Borey Lim", course: "Hotel English", date: "2024-06-10", progress: 80, price: 19.99 },
  { name: "Chenda Mao", course: "Office English", date: "2024-06-09", progress: 15, price: 24.99 },
  { name: "Veasna Pich", course: "Hotel English", date: "2024-06-08", progress: 45, price: 19.99 },
];

const myCourses = [
  { title: "Hotel English Masterclass", students: 124, rating: 4.8, published: "2024-01-20", price: 19.99 },
  { title: "Factory Safety in Khmer", students: 89, rating: 4.6, published: "2024-02-15", price: 29.99 },
  { title: "Office English Basics", students: 67, rating: 4.5, published: "2024-03-10", price: 24.99 },
];

const reviews = [
  { student: "Sok Dara", course: "Hotel English", rating: 5, comment: "Very helpful for my job at the hotel. Teacher is very patient and explains clearly.", date: "2024-06-10" },
  { student: "Channary Kim", course: "Factory Safety", rating: 5, comment: "Excellent course! I learned so much about workplace safety.", date: "2024-06-09" },
  { student: "Borey Lim", course: "Hotel English", rating: 4, comment: "Good course, but I wish there were more practice exercises.", date: "2024-06-08" },
];

const monthlyBreakdown = [
  { month: "Jan", earnings: 320, students: 18 },
  { month: "Feb", earnings: 450, students: 24 },
  { month: "Mar", earnings: 380, students: 20 },
  { month: "Apr", earnings: 520, students: 28 },
  { month: "May", earnings: 480, students: 26 },
  { month: "Jun", earnings: 620, students: 35 },
];

/* ── types ── */
type Tab = "overview" | "students" | "reviews" | "earnings" | "settings";

/* ── component ── */
export default function TeacherDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedMonth, setSelectedMonth] = useState("Jun");
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutRequested, setPayoutRequested] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: t("dashboard.myCourses"), icon: BookOpen },
    { id: "students", label: t("dashboard.students"), icon: Users },
    { id: "reviews", label: t("dashboard.reviews"), icon: Star },
    { id: "earnings", label: t("dashboard.earnings"), icon: DollarSign },
    { id: "settings", label: t("dashboard.settings"), icon: MessageCircle },
  ];

  const statCards = [
    {
      label: t("dashboard.revenueThisMonth"),
      value: `$${teacherProfile.revenue.toLocaleString()}`,
      change: "+18%",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: t("dashboard.totalStudents"),
      value: teacherProfile.totalStudents.toLocaleString(),
      change: "+24 new",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: t("dashboard.courses"),
      value: `${teacherProfile.totalCourses} ${t("dashboard.published")}`,
      change: "",
      icon: BookOpen,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: t("dashboard.avgRating"),
      value: `${teacherProfile.avgRating}/5`,
      change: `${teacherProfile.ratingCount} ${t("dashboard.reviewsCount")}`,
      icon: Star,
      color: "text-[#D4AF37]",
      bg: "bg-[#D4AF37]/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1714] text-[#FAF8F3]">
      {/* Header */}
      <header className="bg-[#2D2926] border-b border-[#D4AF37]/10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-lg">
              {teacherProfile.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#FAF8F3]">
                {teacherProfile.name}
              </h1>
              <p className="text-sm text-[#FAF8F3]/50">{t("dashboard.teacher")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/ai-generate")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C4A030] text-[#1A1714] font-semibold rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4" />
            {t("dashboard.uploadNewCourse")}
          </button>
        </div>

        {/* Tab Nav */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "text-[#FAF8F3]/60 hover:text-[#FAF8F3] hover:bg-[#FAF8F3]/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-4 hover:border-[#D4AF37]/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                        <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                      </div>
                      <span className="text-xs text-[#FAF8F3]/50">{s.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-[#FAF8F3]">{s.value}</p>
                    {s.change && <p className="text-xs text-emerald-400 mt-1">{s.change} {t("dashboard.thisMonth")}</p>}
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                    {t("dashboard.revenueOverview")}
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        contentStyle={{
                          background: "#2D2926",
                          border: "1px solid rgba(212,175,55,0.3)",
                          borderRadius: "8px",
                          color: "#FAF8F3",
                        }}
                        formatter={(value) => [`$${value}`, t("dashboard.revenueThisMonth")]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#D4AF37"
                        strokeWidth={2}
                        dot={{ fill: "#D4AF37", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Enrollments */}
                <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    {t("dashboard.studentGrowth")}
                  </h2>
                  <div className="space-y-4">
                    {recentStudents.slice(0, 4).map((s, i) => (
                      <div key={`${s.name}-${i}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold shrink-0">
                          {s.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#FAF8F3] truncate">{s.name}</p>
                          <p className="text-xs text-[#FAF8F3]/40">{s.course}</p>
                        </div>
                        <span className="text-xs text-emerald-400">${s.price}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("students")}
                    className="mt-4 text-sm text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    {t("dashboard.viewAll")} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* My Courses */}
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                {t("dashboard.myCourses")}
              </h2>
              <div className="space-y-3">
                {myCourses.map((c) => (
                  <div
                    key={c.title}
                    className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-5 hover:border-[#D4AF37]/20 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-[#FAF8F3] mb-1">{c.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-[#FAF8F3]/50">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {c.students} {t("dashboard.students")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#D4AF37]" />
                            {c.rating}
                          </span>
                          <span>${c.price}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-[#D4AF37]/20 rounded-lg text-sm text-[#FAF8F3]/70 hover:border-[#D4AF37]/50 transition-colors">
                          {t("dashboard.edit")}
                        </button>
                        <button className="px-4 py-2 border border-red-500/20 rounded-lg text-sm text-red-400 hover:border-red-500/50 transition-colors">
                          {t("dashboard.delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STUDENTS ── */}
          {activeTab === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  {t("dashboard.totalStudents")}
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F3]/40" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("dashboard.searchStudents")}
                    className="w-full bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FAF8F3] placeholder-[#FAF8F3]/30 focus:border-[#D4AF37]/30 outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#D4AF37]/10 text-left text-xs text-[#FAF8F3]/50 uppercase">
                        <th className="px-4 py-3">{t("dashboard.student")}</th>
                        <th className="px-4 py-3">{t("dashboard.course")}</th>
                        <th className="px-4 py-3">{t("dashboard.progress")}</th>
                        <th className="px-4 py-3">{t("dashboard.status")}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentStudents
                        .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((s, i) => (
                          <tr key={`${s.name}-${i}`} className="border-b border-[#D4AF37]/5 hover:bg-[#FAF8F3]/[0.02]">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold">
                                  {s.name[0]}
                                </div>
                                <span className="text-[#FAF8F3]">{s.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#FAF8F3]/70">{s.course}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-[#1A1714] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#D4AF37] rounded-full"
                                    style={{ width: `${s.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-[#FAF8F3]/50">{s.progress}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                s.progress >= 100
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : s.progress > 0
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-[#FAF8F3]/5 text-[#FAF8F3]/40"
                              }`}>
                                {s.progress >= 100 ? t("dashboard.completed") : t("dashboard.inProgress")}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold">
                  {t("dashboard.overallRating")}: {teacherProfile.avgRating}/5
                </h2>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-[#D4AF37] mb-1">{teacherProfile.avgRating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(teacherProfile.avgRating)
                              ? "text-[#D4AF37] fill-[#D4AF37]"
                              : "text-[#FAF8F3]/20"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[#FAF8F3]/50">
                      {teacherProfile.ratingCount} {t("dashboard.reviewsCount")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = teacherProfile.ratingCount > 0 ? (count / teacherProfile.ratingCount) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-[#FAF8F3]/50 w-3">{star}</span>
                          <Star className="w-3 h-3 text-[#D4AF37]" />
                          <div className="flex-1 h-2 bg-[#1A1714] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#D4AF37] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#FAF8F3]/40 w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {reviews.map((r, i) => (
                    <div
                      key={`${r.student}-${i}`}
                      className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-sm font-bold">
                            {r.student[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#FAF8F3]">{r.student}</p>
                            <p className="text-xs text-[#FAF8F3]/40">{r.course}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star
                              key={si}
                              className={`w-4 h-4 ${
                                si < r.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#FAF8F3]/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#FAF8F3]/70 mb-2">{r.comment}</p>
                      <p className="text-xs text-[#FAF8F3]/30">{r.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── EARNINGS ── */}
          {activeTab === "earnings" && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-5">
                  <p className="text-xs text-[#FAF8F3]/50 mb-1">{t("dashboard.totalRevenue")}</p>
                  <p className="text-2xl font-bold text-emerald-400">$12,840</p>
                </div>
                <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-5">
                  <p className="text-xs text-[#FAF8F3]/50 mb-1">{t("dashboard.thisMonth")}</p>
                  <p className="text-2xl font-bold text-[#D4AF37]">${teacherProfile.revenue}</p>
                </div>
                <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-5">
                  <p className="text-xs text-[#FAF8F3]/50 mb-1">{t("dashboard.pendingPayout")}</p>
                  <p className="text-2xl font-bold text-blue-400">$1,420</p>
                </div>
                <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-5">
                  <p className="text-xs text-[#FAF8F3]/50 mb-1">{t("dashboard.courses")}</p>
                  <p className="text-2xl font-bold text-[#FAF8F3]">{teacherProfile.totalCourses}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                    {t("dashboard.revenueOverview")}
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        contentStyle={{
                          background: "#2D2926",
                          border: "1px solid rgba(212,175,55,0.3)",
                          borderRadius: "8px",
                          color: "#FAF8F3",
                        }}
                        formatter={(value) => [`$${value}`, t("dashboard.revenueThisMonth")]}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: "#D4AF37", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    {t("dashboard.monthlyBreakdown")}
                  </h2>
                  <div className="relative inline-block mb-4">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="appearance-none bg-[#1A1714] border border-[#D4AF37]/20 rounded-lg pl-4 pr-10 py-2 text-sm text-[#FAF8F3] focus:border-[#D4AF37]/30 outline-none"
                    >
                      {monthlyBreakdown.map((m) => (
                        <option key={m.month} value={m.month}>{m.month}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF8F3]/40 pointer-events-none" />
                  </div>
                  <div className="space-y-3">
                    {monthlyBreakdown
                      .filter((m) => m.month === selectedMonth)
                      .map((m) => (
                        <div key={m.month}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#FAF8F3]/60">{t("dashboard.earnings")}</span>
                            <span className="text-emerald-400 font-medium">${m.earnings}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[#FAF8F3]/60">{t("dashboard.students")}</span>
                            <span className="text-blue-400 font-medium">{m.students}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#D4AF37]/10">
                    <p className="text-xs text-[#FAF8F3]/40 mb-3">{t("dashboard.payoutStatus")}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm ${payoutRequested ? "text-yellow-400" : "text-emerald-400"}`}>
                        {payoutRequested ? t("dashboard.pending") : t("dashboard.paid")}
                      </span>
                      <span className="text-sm text-[#FAF8F3]/60">ABA Bank ****8923</span>
                    </div>
                    {!payoutRequested ? (
                      <button
                        onClick={() => setPayoutRequested(true)}
                        className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#C4A030] text-[#1A1714] font-medium rounded-xl transition-colors"
                      >
                        {t("dashboard.requestPayout")}
                      </button>
                    ) : (
                      <div className="text-center py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400">
                        {t("dashboard.payoutRequested")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">{t("dashboard.recentEnrollments")}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#D4AF37]/10 text-left text-xs text-[#FAF8F3]/50 uppercase">
                        <th className="px-4 py-3">{t("dashboard.student")}</th>
                        <th className="px-4 py-3">{t("dashboard.course")}</th>
                        <th className="px-4 py-3">{t("dashboard.date")}</th>
                        <th className="px-4 py-3">{t("dashboard.price")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStudents.map((s, i) => (
                        <tr key={`${s.name}-${i}`} className="border-b border-[#D4AF37]/5">
                          <td className="px-4 py-3">{s.name}</td>
                          <td className="px-4 py-3 text-[#FAF8F3]/70">{s.course}</td>
                          <td className="px-4 py-3 text-[#FAF8F3]/50">{s.date}</td>
                          <td className="px-4 py-3 text-emerald-400">${s.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold mb-6">{t("dashboard.settings")}</h2>

                <div className="space-y-6">
                  <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">{t("nav.profile")}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#FAF8F3]/60 mb-1.5">{t("dashboard.displayName")}</label>
                        <input
                          defaultValue={teacherProfile.name}
                          className="w-full bg-[#1A1714] border border-[#D4AF37]/20 rounded-xl px-4 py-2.5 text-sm text-[#FAF8F3] focus:border-[#D4AF37]/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#FAF8F3]/60 mb-1.5">{t("dashboard.professionalTitle")}</label>
                        <input
                          defaultValue={teacherProfile.title}
                          className="w-full bg-[#1A1714] border border-[#D4AF37]/20 rounded-xl px-4 py-2.5 text-sm text-[#FAF8F3] focus:border-[#D4AF37]/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#FAF8F3]/60 mb-1.5">{t("dashboard.bio")}</label>
                        <textarea
                          defaultValue={teacherProfile.bio}
                          rows={4}
                          className="w-full bg-[#1A1714] border border-[#D4AF37]/20 rounded-xl px-4 py-2.5 text-sm text-[#FAF8F3] focus:border-[#D4AF37]/40 outline-none resize-none"
                        />
                        <p className="text-xs text-[#FAF8F3]/30 mt-1">{teacherProfile.bio.length}/500</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">{t("dashboard.paymentMethod")}</h3>
                    <div>
                      <label className="block text-sm text-[#FAF8F3]/60 mb-1.5">{t("dashboard.paypalAbaEmail")}</label>
                      <input
                        defaultValue="sopheap@aba.com.kh"
                        className="w-full bg-[#1A1714] border border-[#D4AF37]/20 rounded-xl px-4 py-2.5 text-sm text-[#FAF8F3] focus:border-[#D4AF37]/40 outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-[#2D2926] border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">{t("dashboard.emailNotifications")}</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#D4AF37]" />
                        <div>
                          <p className="text-sm text-[#FAF8F3]">{t("dashboard.newStudentAlerts")}</p>
                          <p className="text-xs text-[#FAF8F3]/40">{t("dashboard.newStudentAlertsDesc")}</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#D4AF37]" />
                        <div>
                          <p className="text-sm text-[#FAF8F3]">{t("dashboard.payoutReminders")}</p>
                          <p className="text-xs text-[#FAF8F3]/40">{t("dashboard.payoutRemindersDesc")}</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-[#D4AF37] hover:bg-[#C4A030] text-[#1A1714] font-bold rounded-xl transition-colors">
                    {t("dashboard.saveChanges")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
