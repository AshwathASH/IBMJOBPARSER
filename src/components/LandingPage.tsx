import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Upload, BarChart3, GraduationCap, Users, Zap, ArrowRight, CheckCircle2, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const features = [
  { icon: Upload, title: "Smart Resume Parsing", desc: "AI extracts skills, experience, and qualifications from any resume format with high precision." },
  { icon: BarChart3, title: "Skill Gap Analysis", desc: "Compare your profile against target roles and discover exactly what skills you need to develop." },
  { icon: GraduationCap, title: "Learning Paths", desc: "Get personalized course and certification recommendations to bridge your skill gaps." },
  { icon: Users, title: "AI Candidate Ranking", desc: "Employers receive intelligently ranked candidate lists based on deep profile matching." },
  { icon: Zap, title: "Hireability Score", desc: "See your real-time compatibility score for any job role with actionable improvement tips." },
  { icon: Briefcase, title: "Smart Job Matching", desc: "Go beyond keywords — our AI understands context, potential, and career trajectory." },
];

const steps = [
  { num: "01", title: "Upload Your Resume", desc: "Our AI parses and analyzes your resume in seconds, extracting every detail." },
  { num: "02", title: "Get Your Score", desc: "Receive your Hireability Score and a detailed skill gap analysis for target roles." },
  { num: "03", title: "Follow Your Path", desc: "Access personalized learning recommendations to boost your profile." },
  { num: "04", title: "Land Your Dream Job", desc: "Get matched with ideal positions and stand out to employers." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">Ashwath</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered Job Matching</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Find Your Perfect
              <span className="text-gradient block">Career Match</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
              AI-driven resume analysis, skill gap detection, and personalized learning paths to land your dream role.
            </motion.p>
            
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Start Free Analysis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/employer-dashboard">
                <Button variant="hero-outline" size="xl">
                  I'm an Employer
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
              {["Free skill analysis", "No credit card required", "AI-powered matching"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="glass rounded-2xl p-6 shadow-elevated">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="gradient-card rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Hireability Score</p>
                  <p className="text-3xl font-display font-bold text-gradient">87%</p>
                  <p className="text-xs text-success mt-1">↑ 12% this month</p>
                </div>
                <div className="gradient-card rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Skills Matched</p>
                  <p className="text-3xl font-display font-bold text-foreground">24/28</p>
                  <p className="text-xs text-primary mt-1">4 gaps identified</p>
                </div>
                <div className="gradient-card rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Job Matches</p>
                  <p className="text-3xl font-display font-bold text-foreground">156</p>
                  <p className="text-xs text-accent mt-1">12 new today</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-display font-bold mb-4">
              Powered by <span className="text-gradient">Intelligence</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-lg mx-auto">
              Everything you need to bridge the gap between your current skills and your dream career.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent/8 rounded-full blur-[100px]" />
        
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-display font-bold mb-4">
              How It <span className="text-gradient-accent">Works</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-lg mx-auto">
              Four simple steps to transform your career trajectory.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((s, i) => (
              <motion.div key={s.num} variants={fadeUp} custom={i} className="relative">
                <span className="text-6xl font-display font-bold text-primary/10 absolute -top-4 -left-2">{s.num}</span>
                <div className="pt-10">
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto"
        >
          <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
                Ready to Find Your <span className="text-gradient">Perfect Match</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                Join thousands of professionals who found their dream roles through AI-powered matching.
              </p>
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <Briefcase className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm text-foreground">Ashwath</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Ashwath. AI-Powered Job Portal.</p>
        </div>
      </footer>
    </div>
  );
}
