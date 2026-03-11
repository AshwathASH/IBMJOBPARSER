import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Users, PlusCircle, BarChart3, Eye, Clock, Star, ChevronRight, TrendingUp, FileText, LogOut, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useJobs } from "@/lib/JobContext";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  })
};

const candidates = [
  { name: "Sarah Chen", role: "Senior React Developer", score: 96, skills: ["React", "TypeScript", "AWS"], status: "New" },
  { name: "Alex Rivera", role: "Full Stack Engineer", score: 91, skills: ["Node.js", "React", "Docker"], status: "Reviewed" },
  { name: "Priya Patel", role: "Frontend Lead", score: 88, skills: ["React", "GraphQL", "CI/CD"], status: "Shortlisted" },
  { name: "Marcus Johnson", role: "Software Engineer", score: 84, skills: ["TypeScript", "Python", "SQL"], status: "New" },
];

const postings_unused = null; // dynamic now

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addJob, getEmployerJobs } = useJobs();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", company: "", salary: "", location: "", type: "Full-time", description: "", skills: "" });
  const [formError, setFormError] = useState("");

  const myJobs = getEmployerJobs(user?.email || "");
  const activeCount = myJobs.filter((j) => j.status === "Active").length;

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formData.title.trim() || !formData.company.trim()) {
      setFormError("Job title and company are required");
      return;
    }
    addJob({
      title: formData.title.trim(),
      company: formData.company.trim(),
      salary: formData.salary.trim() || "Competitive",
      location: formData.location.trim() || "Remote",
      type: formData.type,
      description: formData.description.trim(),
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      postedBy: user?.email || "",
    });
    setFormData({ title: "", company: "", salary: "", location: "", type: "Full-time", description: "", skills: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border glass-strong sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">Ashwath</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/login"); }}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
              {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Employer <span className="text-gradient-accent">Dashboard</span></h1>
              <p className="text-muted-foreground mt-1">Manage your job postings and AI-ranked candidates.</p>
            </div>
            <Button variant="hero" size="lg" onClick={() => setShowModal(true)}>
              <PlusCircle className="w-4 h-4" /> Post New Job
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Postings", value: String(activeCount), icon: Briefcase, color: "text-primary" },
              { label: "Total Postings", value: String(myJobs.length), icon: Users, color: "text-accent" },
              { label: "Profile Views", value: "479", icon: Eye, color: "text-success" },
              { label: "Avg. Match Score", value: "87%", icon: TrendingUp, color: "text-warning" },
            ].map((card, i) => (
              <motion.div key={card.label} variants={fadeUp} custom={i + 1} className="glass rounded-xl p-5 hover:glow transition-all duration-300">
                <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
                <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Candidate Ranking */}
            <motion.div variants={fadeUp} custom={5} className="lg:col-span-3 glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning" /> AI-Ranked Candidates
                </h2>
                <span className="text-xs text-muted-foreground">For: Senior Frontend Developer</span>
              </div>
              <div className="space-y-3">
                {candidates.map((c, i) => (
                  <motion.div
                    key={c.name}
                    variants={fadeUp}
                    custom={i + 6}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="absolute -top-1 -right-1 text-[10px] font-display font-bold bg-background border border-border rounded-full w-5 h-5 flex items-center justify-center text-foreground">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-1.5">
                        {c.skills.map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === "Shortlisted" ? "bg-success/10 text-success" :
                        c.status === "Reviewed" ? "bg-info/10 text-info" :
                        "bg-warning/10 text-warning"
                      }`}>{c.status}</span>
                      <span className="text-lg font-display font-bold text-primary">{c.score}%</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Job Postings */}
            <motion.div variants={fadeUp} custom={10} className="lg:col-span-2 glass rounded-xl p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Your Postings
              </h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {myJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No jobs posted yet. Click "Post New Job" to get started.</p>
                ) : (
                  myJobs.map((p) => (
                    <div key={p.id} className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{p.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{p.company}</span>
                        <span>{p.salary}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(p.postedAt)}</span>
                      </div>
                      {p.skills.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {p.skills.slice(0, 3).map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <Button variant="hero-outline" className="w-full mt-4" size="sm" onClick={() => setShowModal(true)}>
                <PlusCircle className="w-4 h-4" /> Create New Posting
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Post New Job Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl p-6 w-full max-w-lg shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">Post New Job</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePostJob} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">{formError}</div>
                )}
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Job Title *</label>
                  <Input placeholder="e.g. Senior React Developer" className="bg-secondary border-border h-10" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Company *</label>
                    <Input placeholder="Company name" className="bg-secondary border-border h-10" value={formData.company} onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Salary Range</label>
                    <Input placeholder="e.g. $100k-$130k" className="bg-secondary border-border h-10" value={formData.salary} onChange={(e) => setFormData((p) => ({ ...p, salary: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Location</label>
                    <Input placeholder="e.g. Remote, NYC" className="bg-secondary border-border h-10" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Job Type</label>
                    <select className="w-full h-10 rounded-md border border-border bg-secondary px-3 text-sm text-foreground" value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Required Skills</label>
                  <Input placeholder="React, TypeScript, AWS (comma separated)" className="bg-secondary border-border h-10" value={formData.skills} onChange={(e) => setFormData((p) => ({ ...p, skills: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Description</label>
                  <textarea placeholder="Job description..." className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground min-h-[80px] resize-none" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <PlusCircle className="w-4 h-4" /> Publish Job
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
