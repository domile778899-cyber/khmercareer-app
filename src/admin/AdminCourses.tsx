import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  BookOpen,
  Globe,
  Cpu,
  Briefcase,
  Factory,
  MoreHorizontal,
  GraduationCap,
  Clock,
  X,
  AlertTriangle,
} from "lucide-react";

/* ── types ── */
interface Course {
  id: number;
  title: string;
  teacher: string;
  category: string;
  students: number;
  price: string;
  status: "Published" | "Pending" | "Rejected" | "Draft";
  thumbnail: string;
  createdDate: string;
  lessons: number;
  rating: number;
}

/* ── mock data ── */
const coursesData: Course[] = [
  { id: 1, title: "Business English Mastery", teacher: "John Smith", category: "English", students: 1245, price: "$19.99", status: "Published", thumbnail: "BE", createdDate: "2025-06-10", lessons: 24, rating: 4.8 },
  { id: 2, title: "Excel for Factory Workers", teacher: "Sopheap Rith", category: "IT", students: 890, price: "$8.99", status: "Published", thumbnail: "EX", createdDate: "2025-06-08", lessons: 18, rating: 4.5 },
  { id: 3, title: "Safety Basics for Garment Workers", teacher: "AI Teacher", category: "Factory", students: 2340, price: "FREE", status: "Published", thumbnail: "SB", createdDate: "2025-06-05", lessons: 12, rating: 4.2 },
  { id: 4, title: "Chinese Business Communication", teacher: "李老师", category: "Language", students: 456, price: "$15.99", status: "Pending", thumbnail: "CB", createdDate: "2025-06-03", lessons: 30, rating: 0 },
  { id: 5, title: "Python Basics", teacher: "Kimly Chea", category: "IT", students: 320, price: "$24.99", status: "Pending", thumbnail: "PY", createdDate: "2025-06-01", lessons: 22, rating: 0 },
  { id: 6, title: "Hotel Management Fundamentals", teacher: "Sreymom Heng", category: "Business", students: 178, price: "$12.99", status: "Draft", thumbnail: "HM", createdDate: "2025-05-28", lessons: 16, rating: 0 },
  { id: 7, title: "Garment Quality Control", teacher: "Bopha Sok", category: "Factory", students: 567, price: "$9.99", status: "Published", thumbnail: "QC", createdDate: "2025-05-25", lessons: 14, rating: 4.6 },
  { id: 8, title: "Digital Marketing 101", teacher: "David Chen", category: "Business", students: 89, price: "$29.99", status: "Rejected", thumbnail: "DM", createdDate: "2025-05-20", lessons: 20, rating: 0 },
];

/* ── status config ── */
const statusConfig: Record<string, { bg: string; color: string; icon: typeof CheckCircle2 }> = {
  Published: { bg: "rgba(5,150,105,0.1)", color: "#059669", icon: CheckCircle2 },
  Pending: { bg: "rgba(212,175,55,0.1)", color: "#D4AF37", icon: Clock },
  Rejected: { bg: "rgba(232,93,62,0.1)", color: "#E85D3E", icon: XCircle },
  Draft: { bg: "rgba(139,115,85,0.1)", color: "#8B7355", icon: Edit3 },
};

const categoryConfig: Record<string, { icon: typeof BookOpen; color: string; bg: string }> = {
  English: { icon: Globe, color: "#D4AF37", bg: "rgba(212,175,55,0.12)" },
  IT: { icon: Cpu, color: "#059669", bg: "rgba(5,150,105,0.12)" },
  Business: { icon: Briefcase, color: "#2563EB", bg: "rgba(59,130,246,0.12)" },
  Factory: { icon: Factory, color: "#8B7355", bg: "rgba(139,115,85,0.12)" },
  Language: { icon: Globe, color: "#E85D3E", bg: "rgba(232,93,62,0.12)" },
};

/* ── fade animation ── */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

export default function AdminCourses() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  const pageSize = 5;

  const filtered = coursesData.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchTeacher = teacherFilter === "" || c.teacher.toLowerCase().includes(teacherFilter.toLowerCase());
    return matchSearch && matchStatus && matchCategory && matchTeacher;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageCourses = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = [
    { label: "Total Courses", value: "128", icon: BookOpen, color: "#D4AF37", bg: "rgba(212,175,55,0.12)" },
    { label: "Published", value: "95", icon: CheckCircle2, color: "#059669", bg: "rgba(5,150,105,0.12)" },
    { label: "Pending", value: "18", icon: Clock, color: "#D4AF37", bg: "rgba(212,175,55,0.12)" },
    { label: "Rejected", value: "15", icon: XCircle, color: "#E85D3E", bg: "rgba(232,93,62,0.12)" },
  ];

  const teachers = Array.from(new Set(coursesData.map((c) => c.teacher)));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#2D2926]/50">{s.label}</p>
                  <p className="mt-1 text-xl font-bold text-[#2D2926]">{s.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pending review banner */}
      {coursesData.filter((c) => c.status === "Pending").length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex items-center gap-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-4 py-3"
        >
          <AlertTriangle size={18} style={{ color: "#D4AF37" }} />
          <p className="text-sm text-[#2D2926]">
            <strong>{coursesData.filter((c) => c.status === "Pending").length}</strong> courses are pending review.
            <button className="ml-2 font-medium" style={{ color: "#D4AF37" }}>
              Review now
            </button>
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2926]/40" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search courses or teachers..."
              className="w-full rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] py-2 pl-9 pr-4 text-sm text-[#2D2926] outline-none transition-colors focus:border-[#D4AF37]"
            />
            {search && (
              <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2926]/30 hover:text-[#2D2926]">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#2D2926]/40" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Pending</option>
              <option>Rejected</option>
              <option>Draft</option>
            </select>
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
          >
            <option>All Categories</option>
            <option>English</option>
            <option>IT</option>
            <option>Business</option>
            <option>Factory</option>
            <option>Language</option>
          </select>

          {/* Teacher */}
          <select
            value={teacherFilter}
            onChange={(e) => { setTeacherFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
          >
            <option value="">All Teachers</option>
            {teachers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Courses Table */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="overflow-hidden rounded-xl border border-[#1A1714]/8 bg-white shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1714]/8 bg-[#FAF8F3]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Students</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1714]/5">
              {pageCourses.map((course) => {
                const st = statusConfig[course.status] || statusConfig["Published"];
                const cat = categoryConfig[course.category] || categoryConfig["Business"];
                const CatIcon = cat.icon;
                const StatusIcon = st.icon;
                const isExpanded = expandedCourse === course.id;
                return (
                  <>
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(250,248,243,0.5)" }}
                      className="cursor-pointer transition-colors"
                      onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: cat.color }}
                          >
                            {course.thumbnail}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#2D2926]">{course.title}</p>
                            <div className="flex items-center gap-2">
                              <GraduationCap size={11} className="text-[#2D2926]/40" />
                              <span className="text-xs text-[#2D2926]/50">{course.lessons} lessons</span>
                              {course.rating > 0 && (
                                <>
                                  <span className="text-xs text-[#2D2926]/30">|</span>
                                  <span className="text-xs" style={{ color: "#D4AF37" }}>{course.rating} / 5</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#2D2926]/70">{course.teacher}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: cat.bg, color: cat.color }}>
                          <CatIcon size={11} />
                          {course.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#2D2926]/70">{course.students.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${course.price === "FREE" ? "" : ""}`} style={{ color: course.price === "FREE" ? "#059669" : "#2D2926" }}>
                          {course.price}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: st.bg, color: st.color }}>
                          <StatusIcon size={11} />
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {course.status === "Pending" && (
                            <>
                              <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-emerald-50 hover:text-emerald-600" title="Approve">
                                <CheckCircle2 size={15} />
                              </button>
                              <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-red-50 hover:text-red-500" title="Reject">
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                            <Edit3 size={15} />
                          </button>
                          <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-red-50 hover:text-red-500" title="Delete">
                            <Trash2 size={15} />
                          </button>
                          <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-[#1A1714]/5" title="More">
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="border-b border-[#1A1714]/5 bg-[#FAF8F3]/50 px-4 py-3">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                          >
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Course ID</p>
                              <p className="text-sm text-[#2D2926]">#{course.id.toString().padStart(4, "0")}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Created</p>
                              <p className="text-sm text-[#2D2926]">{course.createdDate}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Lessons</p>
                              <p className="text-sm text-[#2D2926]">{course.lessons} lessons</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Rating</p>
                              <p className="text-sm" style={{ color: course.rating > 0 ? "#D4AF37" : "#2D2926" }}>
                                {course.rating > 0 ? `${course.rating} / 5.0` : "No ratings yet"}
                              </p>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen size={40} className="text-[#2D2926]/20" />
            <p className="mt-3 text-sm text-[#2D2926]/50">No courses found</p>
            <button
              onClick={() => { setSearch(""); setStatusFilter("All"); setCategoryFilter("All"); setTeacherFilter(""); }}
              className="mt-2 text-xs font-medium"
              style={{ color: "#D4AF37" }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#1A1714]/8 px-4 py-3">
            <p className="text-xs text-[#2D2926]/50">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-[#1A1714]/5 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: page === currentPage ? "#D4AF37" : "transparent",
                    color: page === currentPage ? "#fff" : "#2D2926",
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-[#1A1714]/5 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
