import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Ban,
  MoreHorizontal,
  Users,
  UserCheck,
  Building2,
  ShieldCheck,
  X,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
} from "lucide-react";

/* ── types ── */
type UserRole = "Job Seeker" | "Employer" | "Teacher" | "Admin";
type UserStatus = "Active" | "Pending" | "Blocked";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  lastActive: string;
  avatar: string;
  company?: string;
  phone?: string;
  coursesEnrolled?: number;
  jobsApplied?: number;
}

/* ── mock data ── */
const usersData: User[] = [
  { id: 1, name: "Sophea Kim", email: "sophea@email.com", role: "Job Seeker", status: "Active", joinedDate: "2025-06-01", lastActive: "2025-06-20", avatar: "SK", phone: "+855 12 345 678", coursesEnrolled: 3, jobsApplied: 12 },
  { id: 2, name: "Meng Li", email: "meng@sinolink.com", role: "Employer", status: "Active", joinedDate: "2025-05-28", lastActive: "2025-06-19", avatar: "ML", company: "SinoLink Group", phone: "+855 11 234 567" },
  { id: 3, name: "John Smith", email: "john@english.com", role: "Teacher", status: "Active", joinedDate: "2025-05-20", lastActive: "2025-06-18", avatar: "JS", phone: "+855 10 123 456", coursesEnrolled: 8 },
  { id: 4, name: "Chantrea Sovann", email: "chantrea@email.com", role: "Job Seeker", status: "Pending", joinedDate: "2025-05-18", lastActive: "2025-05-18", avatar: "CS", phone: "+855 15 678 901", coursesEnrolled: 1, jobsApplied: 3 },
  { id: 5, name: "Wei Zhang", email: "wei@factory.com", role: "Employer", status: "Active", joinedDate: "2025-05-15", lastActive: "2025-06-17", avatar: "WZ", company: "CamKo Textile", phone: "+855 13 789 012" },
  { id: 6, name: "Rithy Pich", email: "rithy@admin.com", role: "Admin", status: "Active", joinedDate: "2025-05-10", lastActive: "2025-06-20", avatar: "RP", phone: "+855 16 890 123" },
  { id: 7, name: "Sokha Chhin", email: "sokha@email.com", role: "Job Seeker", status: "Blocked", joinedDate: "2025-05-05", lastActive: "2025-05-10", avatar: "SC", phone: "+855 17 901 234", coursesEnrolled: 0, jobsApplied: 1 },
  { id: 8, name: "Dara Kim", email: "dara@hotel.com", role: "Employer", status: "Pending", joinedDate: "2025-04-28", lastActive: "2025-04-28", avatar: "DK", company: "Angkor Paradise Hotel", phone: "+855 18 012 345" },
];

/* ── role config ── */
const roleConfig: Record<UserRole, { bg: string; color: string; icon: typeof UserCheck }> = {
  "Job Seeker": { bg: "rgba(59,130,246,0.12)", color: "#2563EB", icon: UserCheck },
  Employer: { bg: "rgba(5,150,105,0.12)", color: "#059669", icon: Building2 },
  Teacher: { bg: "rgba(232,93,62,0.12)", color: "#E85D3E", icon: ShieldCheck },
  Admin: { bg: "rgba(212,175,55,0.12)", color: "#D4AF37", icon: Shield },
};

const statusConfig: Record<UserStatus, { bg: string; color: string; dot: string; icon: typeof CheckCircle2 }> = {
  Active: { bg: "rgba(5,150,105,0.1)", color: "#059669", dot: "#059669", icon: CheckCircle2 },
  Pending: { bg: "rgba(212,175,55,0.1)", color: "#D4AF37", dot: "#D4AF37", icon: Clock },
  Blocked: { bg: "rgba(232,93,62,0.1)", color: "#E85D3E", dot: "#E85D3E", icon: XCircle },
};

/* ── fade animation ── */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

/* ── stat card ── */
interface StatCardProps {
  label: string;
  value: string;
  icon: typeof Users;
  color: string;
  bg: string;
  delay: number;
}

function StatCard({ label, value, icon: Icon, color, bg, delay }: StatCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#2D2926]/50">{label}</p>
          <p className="mt-1 text-xl font-bold text-[#2D2926]">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── detail panel ── */
function UserDetailPanel({ user, onClose }: { user: User; onClose: () => void }) {
  const rc = roleConfig[user.role];
  const sc = statusConfig[user.status];
  const RoleIcon = rc.icon;
  const StatusIcon = sc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-[#1A1714]/5 bg-[#FAF8F3]/80 px-4 py-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#2D2926]">User Details</h4>
        <button onClick={onClose} className="rounded p-1 text-[#2D2926]/40 hover:bg-[#1A1714]/5 hover:text-[#2D2926]">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
            <Shield size={11} />
            User ID
          </p>
          <p className="mt-0.5 text-sm text-[#2D2926]">#{user.id.toString().padStart(5, "0")}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
            <RoleIcon size={11} />
            Role
          </p>
          <p className="mt-0.5 text-sm font-medium" style={{ color: rc.color }}>{user.role}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
            <StatusIcon size={11} />
            Status
          </p>
          <p className="mt-0.5 text-sm" style={{ color: sc.color }}>{user.status}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
            <Mail size={11} />
            Email
          </p>
          <p className="mt-0.5 truncate text-sm text-[#2D2926]">{user.email}</p>
        </div>
        {user.phone && (
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
              <Phone size={11} />
              Phone
            </p>
            <p className="mt-0.5 text-sm text-[#2D2926]">{user.phone}</p>
          </div>
        )}
        <div>
          <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
            <Calendar size={11} />
            Joined
          </p>
          <p className="mt-0.5 text-sm text-[#2D2926]">{user.joinedDate}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
            <Clock size={11} />
            Last Active
          </p>
          <p className="mt-0.5 text-sm text-[#2D2926]">{user.lastActive}</p>
        </div>
        {user.company && (
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-[#2D2926]/50">
              <Building2 size={11} />
              Company
            </p>
            <p className="mt-0.5 text-sm text-[#2D2926]">{user.company}</p>
          </div>
        )}
        {user.coursesEnrolled !== undefined && (
          <div>
            <p className="text-xs font-medium text-[#2D2926]/50">Courses Enrolled</p>
            <p className="mt-0.5 text-sm font-medium" style={{ color: "#059669" }}>{user.coursesEnrolled}</p>
          </div>
        )}
        {user.jobsApplied !== undefined && (
          <div>
            <p className="text-xs font-medium text-[#2D2926]/50">Jobs Applied</p>
            <p className="mt-0.5 text-sm font-medium" style={{ color: "#D4AF37" }}>{user.jobsApplied}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── main page ── */
export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const pageSize = 5;

  const filtered = usersData.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageUsers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2D2926]">User Management</h2>
          <p className="text-xs text-[#2D2926]/50">Manage and monitor all platform users</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm"
          style={{ backgroundColor: "#D4AF37" }}
        >
          <Download size={16} />
          Export Users
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Users" value="15,420" icon={Users} color="#D4AF37" bg="rgba(212,175,55,0.12)" delay={0} />
        <StatCard label="Job Seekers" value="12,100" icon={UserCheck} color="#2563EB" bg="rgba(59,130,246,0.12)" delay={0.06} />
        <StatCard label="Employers" value="2,800" icon={Building2} color="#059669" bg="rgba(5,150,105,0.12)" delay={0.12} />
        <StatCard label="Admins" value="12" icon={ShieldCheck} color="#D4AF37" bg="rgba(212,175,55,0.12)" delay={0.18} />
      </div>

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2926]/40" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] py-2 pl-9 pr-4 text-sm text-[#2D2926] outline-none transition-colors focus:border-[#D4AF37]"
            />
            {search && (
              <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2926]/30 hover:text-[#2D2926]">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#2D2926]/40" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
            >
              <option>All Roles</option>
              <option>Job Seeker</option>
              <option>Employer</option>
              <option>Teacher</option>
              <option>Admin</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Blocked</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="date"
              className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
            />
            <span className="text-xs text-[#2D2926]/40">to</span>
            <input
              type="date"
              className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1714]/5">
              {pageUsers.map((user) => {
                const rc = roleConfig[user.role];
                const sc = statusConfig[user.status];
                const isExpanded = expandedUser === user.id;
                return (
                  <>
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(250,248,243,0.7)" }}
                      className="cursor-pointer transition-colors"
                      onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: rc.color }}
                          >
                            {user.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#2D2926]">{user.name}</p>
                            {user.company && (
                              <p className="text-xs text-[#2D2926]/50">{user.company}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#2D2926]/70">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: rc.bg, color: rc.color }}>
                          <rc.icon size={10} />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.color }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#2D2926]/60">{user.joinedDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedUser(user.id); }}
                            className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-red-50 hover:text-red-500"
                            title="Block"
                          >
                            <Ban size={15} />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-[#1A1714]/5"
                            title="More"
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    <tr>
                      <td colSpan={6} className="p-0">
                        <AnimatePresence>
                          {isExpanded && (
                            <UserDetailPanel user={user} onClose={() => setExpandedUser(null)} />
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users size={40} className="text-[#2D2926]/20" />
            <p className="mt-3 text-sm text-[#2D2926]/50">No users found</p>
            <button
              onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All"); }}
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
