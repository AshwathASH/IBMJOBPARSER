import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  description: string;
  skills: string[];
  postedBy: string;
  postedAt: string;
  status: "Active" | "Paused";
}

interface JobStore {
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, "id" | "postedAt" | "status">) => void;
  getEmployerJobs: (email: string) => JobPosting[];
  getAllActiveJobs: () => JobPosting[];
}

const JobContext = createContext<JobStore | null>(null);

const JOBS_KEY = "ashwath_jobs";

const defaultJobs: JobPosting[] = [
  { id: "default-1", title: "Senior Frontend Developer", company: "TechCorp", salary: "$120k-$150k", location: "Remote", type: "Full-time", description: "Build modern web apps with React and TypeScript.", skills: ["React", "TypeScript", "CSS"], postedBy: "demo@employer.com", postedAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: "Active" },
  { id: "default-2", title: "Full Stack Engineer", company: "StartupAI", salary: "$110k-$140k", location: "San Francisco, CA", type: "Full-time", description: "End-to-end development on our AI platform.", skills: ["Node.js", "React", "Docker"], postedBy: "demo@employer.com", postedAt: new Date(Date.now() - 5 * 86400000).toISOString(), status: "Active" },
  { id: "default-3", title: "React Developer", company: "WebFlow Inc", salary: "$100k-$130k", location: "New York, NY", type: "Full-time", description: "Frontend development for our SaaS product.", skills: ["React", "JavaScript", "GraphQL"], postedBy: "demo@employer.com", postedAt: new Date(Date.now() - 7 * 86400000).toISOString(), status: "Active" },
];

function getStoredJobs(): JobPosting[] {
  try {
    const stored = localStorage.getItem(JOBS_KEY);
    if (!stored) return defaultJobs;
    const parsed = JSON.parse(stored);
    return parsed.length > 0 ? parsed : defaultJobs;
  } catch {
    return defaultJobs;
  }
}

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobPosting[]>(getStoredJobs);

  useEffect(() => {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const addJob = useCallback((job: Omit<JobPosting, "id" | "postedAt" | "status">) => {
    const newJob: JobPosting = {
      ...job,
      id: crypto.randomUUID(),
      postedAt: new Date().toISOString(),
      status: "Active",
    };
    setJobs((prev) => [newJob, ...prev]);
  }, []);

  const getEmployerJobs = useCallback((email: string) => {
    return jobs.filter((j) => j.postedBy === email);
  }, [jobs]);

  const getAllActiveJobs = useCallback(() => {
    return jobs.filter((j) => j.status === "Active");
  }, [jobs]);

  return (
    <JobContext.Provider value={{ jobs, addJob, getEmployerJobs, getAllActiveJobs }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobs must be used within JobProvider");
  return ctx;
}
