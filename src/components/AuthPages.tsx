import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  })
};

export function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Navigate only after user state is committed
  useEffect(() => {
    if (user) {
      navigate(user.role === "employer" ? "/employer-dashboard" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const err = login(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center gradient-hero overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-accent/10 rounded-full blur-[80px]" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">Welcome to <span className="text-gradient">Ashwath</span></h2>
          <p className="text-muted-foreground">AI-powered career matching that understands your potential.</p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="w-full max-w-sm">
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">Ashwath</span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-foreground">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
          </motion.div>

          <form onSubmit={handleLogin}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </motion.div>
            )}

            <motion.div variants={fadeUp} custom={1} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Email address" type="email" className="pl-10 bg-secondary border-border h-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Password" type={showPass ? "text" : "password"} className="pl-10 pr-10 bg-secondary border-border h-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="flex items-center justify-between mt-4 mb-6">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border" /> Remember me
              </label>
            </motion.div>

            <motion.div variants={fadeUp} custom={3}>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </motion.div>
          </form>

          <motion.p variants={fadeUp} custom={4} className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign up free</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<"seeker" | "employer">("seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signup } = useAuth();
  const navigate = useNavigate();

  // Navigate only after user state is committed
  useEffect(() => {
    if (user) {
      navigate(user.role === "employer" ? "/employer-dashboard" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const err = signup(name, email, password, role);
    setLoading(false);
    if (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 relative items-center justify-center gradient-hero overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-primary/10 rounded-full blur-[80px]" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">Join <span className="text-gradient-accent">Ashwath</span></h2>
          <p className="text-muted-foreground">Start your AI-powered career transformation today.</p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="w-full max-w-sm">
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">Ashwath</span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Choose how you want to use Ashwath</p>
          </motion.div>

          <form onSubmit={handleSignup}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </motion.div>
            )}

            {/* Role selector */}
            <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 gap-3 mb-6">
              {(["seeker", "employer"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                    role === r ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <p className="text-sm font-display font-semibold">{r === "seeker" ? "Job Seeker" : "Employer"}</p>
                  <p className="text-[10px] mt-0.5">{r === "seeker" ? "Find your dream job" : "Hire top talent"}</p>
                </button>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="space-y-4">
              <Input placeholder="Full name" className="bg-secondary border-border h-11" value={name} onChange={(e) => setName(e.target.value)} required />
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Email address" type="email" className="pl-10 bg-secondary border-border h-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Password (min 6 characters)" type={showPass ? "text" : "password"} className="pl-10 pr-10 bg-secondary border-border h-11" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={3} className="mt-6">
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </motion.div>
          </form>

          <motion.p variants={fadeUp} custom={4} className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
