import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Briefcase,
  MapPin,
  Building2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MoreHorizontal,
  X,
} from "lucide-react";

/* ── types ── */
interface Job {
  id: number;
  title: string;
  company: string;
  industry: string;
  location: string;
  applications: number;
  status: "Active" | "Expired" | "Draft";
  postedDate: string;
  expiryDate: string;
  salary: string;
  type: string;
  employer: string;
}

/* ── mock data ── */
const jobsData: Job[] = [
  { id: 1, title: "Garment Factory Worker", company: "CamKo Textile", industry: "Manufacturing", location: "Phnom Penh", applications: 234, status: "Active", postedDate: "2025-06-15", expiryDate: "2025-07-15", salary: "$200-300/mo", type: "Full-time", employer: "Meng Li" },
  { id: 2, title: "Hotel Receptionist", company: "Angkor Paradise", industry: "Tourism", location: "Siem Reap", applications: 89, status: "Active", postedDate: "2025-06-14", expiryDate: "2025-07-14", salary: "$250-400/mo", type: "Full-time", employer: "Dara Kim" },
  { id: 3, title: "IT Developer", company: "SinoLink Tech", industry: "Technology", location: "Phnom Penh", applications: 45, status: "Active", postedDate: "2025-06-13", expiryDate: "2025-07-13", salary: "$800-1200/mo", type: "Full-time", employer: "Meng Li" },
  { id: 4, title: "English Teacher", company: "Bridge Academy", industry: "Education", location: "Battambang", applications: 67, status: "Active", postedDate: "2025-06-12", expiryDate: "2025-07-12", salary: "$400-600/mo", type: "Part-time", employer: "John Smith" },
  { id: 5, title: "Construction Supervisor", company: "City Build Co.", industry: "Construction", location: "Phnom Penh", applications: 12, status: "Expired", postedDate: "2025-05-10", expiryDate: "2025-06-10", salary: "$600-900/mo", type: "Full-time", employer: "Wei Zhang" },
  { id: 6, title: "Restaurant Manager", company: "Taste of Khmer", industry: "Hospitality", location: "Sihanoukville", applications: 34, status: "Draft", postedDate: "2025-06-11", expiryDate: "2025-07-11", salary: "$500-700/mo", type: "Full-time", employer: "Sokha Chhin" },
  { id: 7, title: "Quality Inspector", company: "Garment Plus", industry: "Manufacturing", location: "Kampong Speu", applications: 156, status: "Active", postedDate: "2025-06-10", expiryDate: "2025-07-10", salary: "$220-320/mo", type: "Full-time", employer: "Wei Zhang" },
  { id: 8, title: "Marketing Coordinator", company: "Pixel Digital", industry: "Technology", location: "Phnom Penh", applications: 23, status: "Expired", postedDate: "2025-04-20", expiryDate: "2025-05-20", salary: "$350-500/mo", type: "Full-time", employer: "Rithy Pich" },
];

/* ── status config ── */
const statusConfig: Record<string, { bg: string; color: string; icon: typeof CheckCircle2 }> = {
  Active: { bg: "rgba(5,150,105,0.1)", color: "#059669", icon: CheckCircle2 },
  Expired: { bg: "rgba(232,93,62,0.1)", color: "#E85D3E", icon: XCircle },
  Draft: { bg: "rgba(139,115,85,0.1)", color: "#8B7355", icon: FileText },
};

const industryConfig: Record<string, { icon: typeof Building2; color: string; bg: string }> = {
  Manufacturing: { icon: Building2, color: "#8B7355", bg: "rgba(139,115,85,0.12)" },
  Tourism: { icon: MapPin, color: "#059669", bg: "rgba(5,150,105,0.12)" },
  Technology: { icon: Briefcase, color: "#2563EB", bg: "rgba(59,130,246,0.12)" },
  Education: { icon: Users, color: "#D4AF37", bg: "rgba(212,175,55,0.12)" },
  Construction: { icon: Building2, color: "#E85D3E", bg: "rgba(232,93,62,0.12)" },
  Hospitality: { icon: Clock, color: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
};

/* ── fade animation ── */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

export default function AdminJobs() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [employerFilter, setEmployerFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const pageSize = 5;

  const filtered = jobsData.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || j.status === statusFilter;
    const matchIndustry = industryFilter === "All" || j.industry === industryFilter;
    const matchLocation = locationFilter === "All" || j.location === locationFilter;
    const matchEmployer = employerFilter === "" || j.employer.toLowerCase().includes(employerFilter.toLowerCase());
    return matchSearch && matchStatus && matchIndustry && matchLocation && matchEmployer;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageJobs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = [
    { label: "Total Jobs", value: "3,450", icon: Briefcase, color: "#D4AF37", bg: "rgba(212,175,55,0.12)" },
    { label: "Active", value: "2,100", icon: CheckCircle, color: "#059669", bg: "rgba(5,150,105,0.12)" },
    { label: "Expired", value: "980", icon: AlertCircle, color: "#E85D3E", bg: "rgba(232,93,62,0.12)" },
    { label: "Draft", value: "370", icon: FileText, color: "#8B7355", bg: "rgba(139,115,85,0.12)" },
  ];

  const locations = Array.from(new Set(jobsData.map((j) => j.location)));
  const employers = Array.from(new Set(jobsData.map((j) => j.employer)));

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

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="rounded-xl border border-[#1A1714]/8 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2926]/40" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search job title or company..."
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
              <option>Active</option>
              <option>Expired</option>
              <option>Draft</option>
            </select>
          </div>

          {/* Industry */}
          <select
            value={industryFilter}
            onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
          >
            <option>All Industries</option>
            <option>Manufacturing</option>
            <option>Tourism</option>
            <option>Technology</option>
            <option>Education</option>
            <option>Construction</option>
            <option>Hospitality</option>
          </select>

          {/* Location */}
          <select
            value={locationFilter}
            onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
          >
            <option>All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Employer */}
          <select
            value={employerFilter}
            onChange={(e) => { setEmployerFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-[#1A1714]/10 bg-[#FAF8F3] px-3 py-2 text-sm text-[#2D2926] outline-none focus:border-[#D4AF37]"
          >
            <option value="">All Employers</option>
            {employers.map((emp) => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Jobs Table */}
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Job</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Industry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Applications</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Posted</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#2D2926]/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1714]/5">
              {pageJobs.map((job) => {
                const st = statusConfig[job.status] || statusConfig["Active"];
                const ind = industryConfig[job.industry] || industryConfig["Technology"];
                const IndIcon = ind.icon;
                const StatusIcon = st.icon;
                const isExpanded = expandedJob === job.id;
                return (
                  <>
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(250,248,243,0.5)" }}
                      className="cursor-pointer transition-colors"
                      onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#2D2926]">{job.title}</p>
                          <div className="flex items-center gap-1.5">
                            <Building2 size={11} className="text-[#2D2926]/40" />
                            <span className="truncate text-xs text-[#2D2926]/50">{job.company}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: ind.bg, color: ind.color }}>
                          <IndIcon size={11} />
                          {job.industry}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={13} className="text-[#2D2926]/40" />
                          <span className="text-sm text-[#2D2926]/70">{job.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Users size={13} className="text-[#2D2926]/40" />
                          <span className="text-sm font-medium text-[#2D2926]">{job.applications}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: st.bg, color: st.color }}>
                          <StatusIcon size={11} />
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#2D2926]/60">{job.postedDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]" title="View">
                            <Eye size={15} />
                          </button>
                          <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                            <Edit3 size={15} />
                          </button>
                          <button className="rounded-lg p-1.5 text-[#2D2926]/50 hover:bg-emerald-50 hover:text-emerald-600" title="Activate">
                            <CheckCircle2 size={15} />
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
                              <p className="text-xs font-medium text-[#2D2926]/50">Job ID</p>
                              <p className="text-sm text-[#2D2926]">#{job.id.toString().padStart(4, "0")}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Salary</p>
                              <p className="text-sm font-semibold text-[#2D2926]">{job.salary}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Job Type</p>
                              <p className="text-sm text-[#2D2926]">{job.type}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Employer</p>
                              <p className="text-sm text-[#2D2926]">{job.employer}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Posted</p>
                              <p className="text-sm text-[#2D2926]">{job.postedDate}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Expires</p>
                              <p className="text-sm" style={{ color: job.status === "Expired" ? "#E85D3E" : "#2D2926" }}>{job.expiryDate}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Applications</p>
                              <p className="text-sm" style={{ color: "#D4AF37" }}>{job.applications} applicants</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#2D2926]/50">Status</p>
                              <p className="text-sm" style={{ color: st.color }}>{job.status}</p>
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
            <Briefcase size={40} className="text-[#2D2926]/20" />
            <p className="mt-3 text-sm text-[#2D2926]/50">No jobs found</p>
            <button
              onClick={() => { setSearch(""); setStatusFilter("All"); setIndustryFilter("All"); setLocationFilter("All"); setEmployerFilter(""); }}
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
