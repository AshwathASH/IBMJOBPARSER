import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, TrendingUp, BookOpen, Briefcase, Target, Award, ChevronRight, ArrowRight, FileText, Lightbulb, CheckCircle2, Loader2, XCircle, LogOut, X, MapPin, Clock, DollarSign, Download, Plus, Trash2, PenTool } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useJobs, type JobPosting } from "@/lib/JobContext";

interface AnalysisResult {
  fileName: string;
  skills: { name: string; level: number; matched: boolean }[];
  score: number;
  strengths: string[];
  gaps: string[];
}

interface ResumeExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface ResumeEducation {
  degree: string;
  institution: string;
  year: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  })
};

const skills = [
  { name: "React", level: 92, matched: true },
  { name: "TypeScript", level: 85, matched: true },
  { name: "Node.js", level: 78, matched: true },
  { name: "GraphQL", level: 45, matched: false },
  { name: "AWS", level: 30, matched: false },
  { name: "Docker", level: 55, matched: false },
];

const courses = [
  { title: "AWS Solutions Architect", provider: "AWS Training", duration: "40 hrs", priority: "High" },
  { title: "GraphQL Mastery", provider: "Udemy", duration: "12 hrs", priority: "High" },
  { title: "Docker & Kubernetes", provider: "Coursera", duration: "25 hrs", priority: "Medium" },
];

export default function SeekerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getAllActiveJobs } = useJobs();
  const activeJobs = getAllActiveJobs();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Job detail & apply state
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applyMode, setApplyMode] = useState(false);
  const [applyFile, setApplyFile] = useState<File | null>(null);
  const [applyAnalyzing, setApplyAnalyzing] = useState(false);
  const [applyResult, setApplyResult] = useState<{ matched: string[]; notMatched: string[] } | null>(null);
  const applyFileRef = useRef<HTMLInputElement>(null);

  // Resume builder state
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    summary: "",
    experiences: [{ title: "", company: "", duration: "", description: "" }],
    education: [{ degree: "", institution: "", year: "" }],
    skills: "",
  });

  const skillKeywords = [
    { name: "React", keywords: ["react", "react.js", "reactjs"] },
    { name: "TypeScript", keywords: ["typescript", "ts"] },
    { name: "JavaScript", keywords: ["javascript", "js", "es6"] },
    { name: "Node.js", keywords: ["node.js", "nodejs", "node"] },
    { name: "Python", keywords: ["python", "django", "flask"] },
    { name: "Java", keywords: ["java", "spring", "springboot"] },
    { name: "AWS", keywords: ["aws", "amazon web services", "ec2", "s3", "lambda"] },
    { name: "Docker", keywords: ["docker", "container", "dockerfile"] },
    { name: "Kubernetes", keywords: ["kubernetes", "k8s"] },
    { name: "SQL", keywords: ["sql", "mysql", "postgresql", "postgres", "database"] },
    { name: "GraphQL", keywords: ["graphql", "apollo"] },
    { name: "Git", keywords: ["git", "github", "gitlab"] },
    { name: "CSS", keywords: ["css", "tailwind", "sass", "scss", "styled-components"] },
    { name: "HTML", keywords: ["html", "html5"] },
    { name: "MongoDB", keywords: ["mongodb", "mongo", "nosql"] },
    { name: "CI/CD", keywords: ["ci/cd", "jenkins", "github actions", "pipeline"] },
    { name: "REST API", keywords: ["rest", "api", "restful"] },
    { name: "Agile", keywords: ["agile", "scrum", "sprint", "kanban"] },
  ];

  const handleFileSelect = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx" && ext !== "doc" && ext !== "txt") {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setSelectedFile(file);
    setAnalysisResult(null);
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const analyzeResume = useCallback(async () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://localhost:5000/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setAnalysisResult({
        fileName: selectedFile.name,
        skills: data.skills,
        score: data.score,
        strengths: data.strengths,
        gaps: data.gaps,
      });
    } catch {
      alert("Could not connect to the resume analysis server. Make sure the Python backend is running (python backend/server.py).");
    }

    setAnalyzing(false);
  }, [selectedFile]);

  // Apply flow handlers
  const handleApplyFileSelect = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx" && ext !== "doc" && ext !== "txt") {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setApplyFile(file);
    setApplyResult(null);
  }, []);

  const analyzeForJob = useCallback(async () => {
    if (!applyFile || !selectedJob) return;

    setApplyAnalyzing(true);
    setApplyResult(null);

    try {
      const formData = new FormData();
      formData.append("file", applyFile);
      formData.append("skills", selectedJob.skills.join(","));

      const res = await fetch("http://localhost:5000/api/analyze-for-job", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setApplyResult({ matched: data.matched, notMatched: data.notMatched });
    } catch {
      alert("Could not connect to the resume analysis server. Make sure the Python backend is running (python backend/server.py).");
    }

    setApplyAnalyzing(false);
  }, [applyFile, selectedJob]);

  const closeJobDetail = useCallback(() => {
    setSelectedJob(null);
    setApplyMode(false);
    setApplyFile(null);
    setApplyResult(null);
    setApplyAnalyzing(false);
  }, []);

  // Resume builder helpers
  const updateResumeField = (field: keyof ResumeData, value: string) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { title: "", company: "", duration: "", description: "" }],
    }));
  };

  const removeExperience = (idx: number) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== idx),
    }));
  };

  const updateExperience = (idx: number, field: keyof ResumeExperience, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => (i === idx ? { ...exp, [field]: value } : exp)),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  const removeEducation = (idx: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  const updateEducation = (idx: number, field: keyof ResumeEducation, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === idx ? { ...edu, [field]: value } : edu)),
    }));
  };

  const downloadResume = () => {
    const d = resumeData;
    if (!d.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    const skillsList = d.skills.split(",").map((s) => s.trim()).filter(Boolean);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${d.fullName} - Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 50px; line-height: 1.5; }
  h1 { font-size: 28px; color: #0f766e; margin-bottom: 4px; }
  .contact { color: #555; font-size: 13px; margin-bottom: 20px; }
  .contact span { margin-right: 16px; }
  .section { margin-bottom: 22px; }
  .section-title { font-size: 15px; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #0f766e; padding-bottom: 4px; margin-bottom: 12px; }
  .entry { margin-bottom: 14px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-weight: 600; font-size: 14px; }
  .entry-sub { color: #555; font-size: 13px; }
  .entry-duration { color: #777; font-size: 12px; }
  .entry-desc { font-size: 13px; color: #444; margin-top: 4px; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: #e0f2f1; color: #0f766e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .summary { font-size: 13px; color: #444; }
  @media print { body { padding: 20px 30px; } }
  @page { size: A4; margin: 15mm; }
</style>
</head>
<body>
  <h1>${d.fullName}</h1>
  <div class="contact">
    ${d.email ? `<span>${d.email}</span>` : ""}
    ${d.phone ? `<span>${d.phone}</span>` : ""}
  </div>

  ${d.summary.trim() ? `<div class="section"><div class="section-title">Summary</div><p class="summary">${d.summary}</p></div>` : ""}

  ${d.experiences.some((e) => e.title.trim()) ? `<div class="section"><div class="section-title">Experience</div>${d.experiences.filter((e) => e.title.trim()).map((e) => `<div class="entry"><div class="entry-header"><span class="entry-title">${e.title}</span><span class="entry-duration">${e.duration}</span></div><div class="entry-sub">${e.company}</div>${e.description.trim() ? `<div class="entry-desc">${e.description}</div>` : ""}</div>`).join("")}</div>` : ""}

  ${d.education.some((e) => e.degree.trim()) ? `<div class="section"><div class="section-title">Education</div>${d.education.filter((e) => e.degree.trim()).map((e) => `<div class="entry"><div class="entry-header"><span class="entry-title">${e.degree}</span><span class="entry-duration">${e.year}</span></div><div class="entry-sub">${e.institution}</div></div>`).join("")}</div>` : ""}

  ${skillsList.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills-list">${skillsList.map((s) => `<span class="skill-tag">${s}</span>`).join("")}</div></div>` : ""}
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download your resume as PDF.");
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
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
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          {/* Header */}
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0] || "User"}</span></h1>
            <p className="text-muted-foreground mt-1">Your career dashboard — updated in real-time.</p>
          </motion.div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Hireability Score", value: "87%", change: "+12%", icon: Award, color: "text-primary" },
              { label: "Skills Matched", value: "24/28", change: "4 gaps", icon: Target, color: "text-accent" },
              { label: "Profile Views", value: "342", change: "+28 this week", icon: TrendingUp, color: "text-success" },
              { label: "Applications", value: "12", change: "3 interviews", icon: FileText, color: "text-warning" },
            ].map((card, i) => (
              <motion.div key={card.label} variants={fadeUp} custom={i + 1} className="glass rounded-xl p-5 group hover:glow transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                  <span className="text-xs text-muted-foreground">{card.change}</span>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Skill Gap Analysis */}
            <motion.div variants={fadeUp} custom={5} className="lg:col-span-2 glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg text-foreground">Skill Gap Analysis</h2>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">Target: Senior Full Stack</span>
              </div>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-4">
                    <span className="text-sm text-foreground w-24 font-medium">{skill.name}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${skill.matched ? "gradient-primary" : "gradient-accent"}`}
                      />
                    </div>
                    <span className={`text-xs font-medium w-10 text-right ${skill.matched ? "text-primary" : "text-accent"}`}>{skill.level}%</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full gradient-primary inline-block" /> Matched</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full gradient-accent inline-block" /> Gap</span>
              </div>
            </motion.div>

            {/* Resume Upload */}
            <motion.div variants={fadeUp} custom={6} className="glass rounded-xl p-6 flex flex-col">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">Resume Analysis</h2>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={onFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer group ${
                  dragOver ? "border-primary bg-primary/5" : selectedFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                {selectedFile ? (
                  <>
                    <FileText className="w-10 h-10 text-primary mb-3" />
                    <p className="text-sm text-foreground font-medium text-center truncate max-w-full">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024).toFixed(1)} KB — Click to change</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                    <p className="text-sm text-muted-foreground text-center">Drop your resume here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT supported</p>
                  </>
                )}
              </div>

              <Button
                variant="hero"
                className="mt-4 w-full"
                onClick={analyzeResume}
                disabled={analyzing}
              >
                {analyzing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Upload className="w-4 h-4" /> {selectedFile ? "Analyze Resume" : "Upload & Analyze"}</>
                )}
              </Button>

              {/* Analysis Result */}
              <AnimatePresence>
                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4 overflow-hidden"
                  >
                    {/* Score */}
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hireability Score</p>
                      <p className="text-4xl font-display font-bold text-gradient">{analysisResult.score}%</p>
                    </div>

                    {/* Extracted Skills */}
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Detected Skills</p>
                      <div className="space-y-2">
                        {analysisResult.skills.map((s) => (
                          <div key={s.name} className="flex items-center gap-2">
                            <span className="text-xs text-foreground w-20 truncate">{s.name}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.level}%` }}
                                transition={{ duration: 0.8 }}
                                className={`h-full rounded-full ${s.matched ? "gradient-primary" : "gradient-accent"}`}
                              />
                            </div>
                            <span className={`text-[10px] w-8 text-right font-medium ${s.matched ? "text-primary" : "text-accent"}`}>{s.level}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Gaps */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1.5">Strengths</p>
                        {analysisResult.strengths.map((s) => (
                          <p key={s} className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                            <CheckCircle2 className="w-3 h-3 text-success" /> {s}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1.5">Skill Gaps</p>
                        {analysisResult.gaps.map((g) => (
                          <p key={g} className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                            <XCircle className="w-3 h-3 text-destructive" /> {g}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Resume Builder Card */}
          <motion.div variants={fadeUp} custom={9} className="mt-6">
            <div
              onClick={() => setShowResumeBuilder(true)}
              className="glass rounded-xl p-6 flex items-center justify-between cursor-pointer group hover:glow transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-lg text-foreground">Resume Builder</h2>
                  <p className="text-sm text-muted-foreground">Build a professional resume and download it instantly</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Learning Paths */}
            <motion.div variants={fadeUp} custom={7} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning" /> Recommended Learning
                </h2>
              </div>
              <div className="space-y-3">
                {courses.map((c) => (
                  <div key={c.title} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.provider} · {c.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.priority === "High" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{c.priority}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Job Matches */}
            <motion.div variants={fadeUp} custom={8} className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg text-foreground">Available Jobs</h2>
                <span className="text-xs text-muted-foreground">{activeJobs.length} openings</span>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {activeJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No jobs available yet.</p>
                ) : (
                  activeJobs.map((j) => (
                    <div key={j.id} onClick={() => { setSelectedJob(j); setApplyMode(false); setApplyFile(null); setApplyResult(null); }} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer">
                      <div>
                        <p className="text-sm font-medium text-foreground">{j.title}</p>
                        <p className="text-xs text-muted-foreground">{j.company} · {j.salary}</p>
                        {j.skills.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5">
                            {j.skills.slice(0, 3).map((s) => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">{j.type}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Resume Builder Modal */}
      <AnimatePresence>
        {showResumeBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowResumeBuilder(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">Resume Builder</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fill in your details to generate a downloadable resume</p>
                </div>
                <button onClick={() => setShowResumeBuilder(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Personal Info */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={resumeData.fullName}
                      onChange={(e) => updateResumeField("fullName", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={resumeData.email}
                      onChange={(e) => updateResumeField("email", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={resumeData.phone}
                      onChange={(e) => updateResumeField("phone", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Professional Summary</h3>
                  <textarea
                    placeholder="Brief summary about yourself and career objectives..."
                    value={resumeData.summary}
                    onChange={(e) => updateResumeField("summary", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                {/* Experience */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Experience</h3>
                    <button onClick={addExperience} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.experiences.map((exp, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-medium">Experience {idx + 1}</span>
                          {resumeData.experiences.length > 1 && (
                            <button onClick={() => removeExperience(idx)} className="text-destructive hover:text-destructive/80">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) => updateExperience(idx, "title", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateExperience(idx, "company", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 2022-2024)"
                            value={exp.duration}
                            onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <textarea
                          placeholder="Description of responsibilities..."
                          value={exp.description}
                          onChange={(e) => updateExperience(idx, "description", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Education</h3>
                    <button onClick={addEducation} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-medium">Education {idx + 1}</span>
                          {resumeData.education.length > 1 && (
                            <button onClick={() => removeEducation(idx)} className="text-destructive hover:text-destructive/80">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            type="text"
                            placeholder="Year (e.g. 2024)"
                            value={edu.year}
                            onChange={(e) => updateEducation(idx, "year", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Skills</h3>
                  <input
                    type="text"
                    placeholder="e.g. React, TypeScript, Node.js, Python (comma-separated)"
                    value={resumeData.skills}
                    onChange={(e) => updateResumeField("skills", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {resumeData.skills && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {resumeData.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <Button variant="hero" className="w-full" onClick={downloadResume}>
                  <Download className="w-4 h-4" /> Download Resume
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeJobDetail}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">{selectedJob.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedJob.company}</p>
                </div>
                <button onClick={closeJobDetail} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Job Info */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-success/10 text-success font-medium">
                  <Clock className="w-3.5 h-3.5" /> {selectedJob.type}
                </span>
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                  <DollarSign className="w-3.5 h-3.5" /> {selectedJob.salary}
                </span>
                {selectedJob.location && (
                  <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium">
                    <MapPin className="w-3.5 h-3.5" /> {selectedJob.location}
                  </span>
                )}
              </div>

              {/* Description */}
              {selectedJob.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.description}</p>
                </div>
              )}

              {/* Required Skills */}
              {selectedJob.skills.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              {!applyMode && !applyResult && (
                <Button variant="hero" className="w-full" onClick={() => setApplyMode(true)}>
                  <ArrowRight className="w-4 h-4" /> Apply Job
                </Button>
              )}

              {/* Resume Upload for Apply */}
              {applyMode && !applyResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border pt-4 mt-2">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Upload Resume to Apply</h3>
                    <input
                      ref={applyFileRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleApplyFileSelect(f); }}
                      className="hidden"
                    />
                    <div
                      onClick={() => applyFileRef.current?.click()}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 transition-colors cursor-pointer group ${
                        applyFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      {applyFile ? (
                        <>
                          <FileText className="w-8 h-8 text-primary mb-2" />
                          <p className="text-sm text-foreground font-medium text-center truncate max-w-full">{applyFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{(applyFile.size / 1024).toFixed(1)} KB — Click to change</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                          <p className="text-sm text-muted-foreground text-center">Click to upload your resume</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT supported</p>
                        </>
                      )}
                    </div>
                    <Button
                      variant="hero"
                      className="w-full mt-3"
                      onClick={analyzeForJob}
                      disabled={!applyFile || applyAnalyzing}
                    >
                      {applyAnalyzing ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Skills...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> Upload & Check Skills</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Skill Match Results */}
              <AnimatePresence>
                {applyResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t border-border pt-4 mt-4 space-y-4"
                  >
                    {applyResult.notMatched.length === 0 ? (
                      <div className="text-center p-4 rounded-xl bg-success/10">
                        <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                        <p className="text-sm font-semibold text-success">All Skills Matched!</p>
                        <p className="text-xs text-muted-foreground mt-1">Your resume matches all required skills for this position.</p>
                      </div>
                    ) : applyResult.matched.length === 0 ? (
                      <div className="text-center p-4 rounded-xl bg-destructive/10">
                        <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <p className="text-sm font-semibold text-destructive">Skills Not Matching</p>
                        <p className="text-xs text-muted-foreground mt-1">Your resume doesn't match the required skills for this position.</p>
                      </div>
                    ) : (
                      <div className="text-center p-4 rounded-xl bg-warning/10">
                        <Target className="w-8 h-8 text-warning mx-auto mb-2" />
                        <p className="text-sm font-semibold text-warning">Partial Match</p>
                        <p className="text-xs text-muted-foreground mt-1">{applyResult.matched.length} of {applyResult.matched.length + applyResult.notMatched.length} required skills found.</p>
                      </div>
                    )}

                    {applyResult.matched.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">Matched Skills</p>
                        <div className="space-y-1.5">
                          {applyResult.matched.map((s) => (
                            <p key={s} className="text-sm flex items-center gap-2 text-success">
                              <CheckCircle2 className="w-4 h-4" /> {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {applyResult.notMatched.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">Not Matching</p>
                        <div className="space-y-1.5">
                          {applyResult.notMatched.map((s) => (
                            <p key={s} className="text-sm flex items-center gap-2 text-destructive">
                              <XCircle className="w-4 h-4" /> {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button variant="ghost" className="w-full mt-2" onClick={closeJobDetail}>
                      Close
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
