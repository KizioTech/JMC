import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2, BookOpen } from "lucide-react";

type AuthMode = "signin" | "signup";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        navigate("/");
      } else {
        await signUp(email, password, fullName);
        setSuccess(
          "Account created! Check your email inbox for a confirmation link before signing in."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Sign In — JMC Academics</title>
        <meta name="description" content="Sign in to JMC Academics to access your courses, track progress, and unlock premium content." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">JMC Academics</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "signin" ? "Welcome back! Sign in to continue." : "Create a free account to get started."}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-muted p-1 mb-6 relative">
            <button
              id="auth-signin-tab"
              onClick={() => switchMode("signin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all relative z-10 ${
                mode === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              id="auth-signup-tab"
              onClick={() => switchMode("signup")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all relative z-10 ${
                mode === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 mb-5 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 mb-5 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name — sign up only */}
              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div
                    key="fullname"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="auth-fullname" className="block text-sm font-medium mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <label htmlFor="auth-email" className="block text-sm font-medium mb-1.5">
                  Email address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete={mode === "signin" ? "email" : "email"}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className="w-full px-4 py-2.5 pr-11 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                  />
                  <button
                    type="button"
                    id="auth-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="auth-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-2.5 rounded-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === "signin" ? (
                  <LogIn className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {loading
                  ? mode === "signin"
                    ? "Signing in…"
                    : "Creating account…"
                  : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => switchMode("signin")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Auth;