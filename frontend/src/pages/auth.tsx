import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Building,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { NavLink, useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        setSuccessMsg("Welcome back! Signed in successfully.");
      } else {
        setSuccessMsg("Account created successfully! Welcome to TechEllixir.");
      }
    }, 1200);
  };

  return (
    <div className="pt-28 pb-20 bg-[#fffaf7] dark:bg-[#0d111a] min-h-screen text-[#182033] dark:text-gray-100 transition-colors duration-300 flex items-center justify-center">
      <div className="container-shell max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Value & Features */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block">
            <span className="eyebrow">
              <Sparkles size={16} /> WELCOME TO TECHELLIXIR
            </span>
            
            <h1 className="text-4xl font-black leading-tight text-[#182033] dark:text-white">
              Start building <span className="text-[#FF4D37]">smarter software</span> today.
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Access custom AI solutions, full-stack engineering tools, project tracking dashboards, and 24/7 technical support.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 p-4 border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="p-2.5 rounded-xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#182033] dark:text-white">Fast-Track Onboarding</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Connect your team with our senior AI & product engineering architects.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 p-4 border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="p-2.5 rounded-xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#182033] dark:text-white">Enterprise Grade Security</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    SOC2 compliant data sandboxing and zero-trust encryption standard.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs font-semibold text-gray-400">
              Need assistance? <NavLink to="/contact" className="text-[#FF4D37] hover:underline">Contact our team</NavLink>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="lg:col-span-7">
            <div className="soft-card rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-2xl">
              
              {/* Tab Switcher */}
              <div className="flex rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-1.5 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 rounded-xl py-3 text-xs sm:text-sm font-black transition duration-200 cursor-pointer ${
                    mode === "login"
                      ? "bg-[#FF4D37] text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 rounded-xl py-3 text-xs sm:text-sm font-black transition duration-200 cursor-pointer ${
                    mode === "register"
                      ? "bg-[#FF4D37] text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title Header */}
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-[#182033] dark:text-white">
                  {mode === "login" ? "Welcome back to TechEllixir" : "Create your TechEllixir account"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {mode === "login"
                    ? "Enter your credentials to access your dashboard and project inquiries."
                    : "Fill in your details below to get started with our engineering team."}
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => alert("Google OAuth login initialized.")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FaGoogle className="text-red-500" size={16} /> Google
                </button>
                <button
                  type="button"
                  onClick={() => alert("GitHub OAuth login initialized.")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FaGithub size={16} /> GitHub
                </button>
              </div>

              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
              </div>

              {/* Success Notification Banner */}
              {successMsg && (
                <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name field (Register only) */}
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Company Name field (Register only) */}
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                      Company / Organization (Optional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Address field */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                      Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => alert("Password reset link sent to your email.")}
                        className="text-xs font-bold text-[#FF4D37] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Checkbox (Register mode) */}
                {mode === "register" && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#FF4D37] focus:ring-[#FF4D37] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer">
                      I agree to the <a href="#" className="text-[#FF4D37] underline">Terms of Service</a> and <a href="#" className="text-[#FF4D37] underline">Privacy Policy</a>.
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="brand-button w-full py-4 cursor-pointer text-xs sm:text-sm font-bold whitespace-nowrap shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : mode === "login" ? (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight size={18} />
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switcher */}
              <div className="mt-6 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                {mode === "login" ? (
                  <span>
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-[#FF4D37] font-bold hover:underline cursor-pointer"
                    >
                      Sign Up Now
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-[#FF4D37] font-bold hover:underline cursor-pointer"
                    >
                      Sign In Here
                    </button>
                  </span>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
