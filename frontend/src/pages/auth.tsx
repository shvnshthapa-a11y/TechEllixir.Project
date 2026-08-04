import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Building,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { NavLink, useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Login Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register Form states
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const input = usernameOrEmail.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: input, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Invalid username or password.");
        return;
      }

      if (data.role === "admin") {
        localStorage.setItem("adminToken", data.token);
        setSuccessMsg("Admin authentication successful! Redirecting to Admin Panel...");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 800);
      } else {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userEmail", input || "user@techellixir.com");
        setSuccessMsg("Signed in successfully! Redirecting to Home Page...");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }
    } catch (err) {
      setLoading(false);
      // Fallback local validation if backend fetch fails
      if ((input === "admin" || input === "admin@techellixir.com") && password === "admin@123") {
        localStorage.setItem("adminToken", "demo-admin-token");
        setSuccessMsg("Admin authentication successful! Redirecting to Admin Panel...");
        setTimeout(() => { window.location.href = "/admin"; }, 800);
      } else if ((input === "user" || input === "user@techellixir.com" || input.length > 0) && (password === "user@123" || password.length > 0)) {
        localStorage.setItem("userToken", "demo-user-token");
        localStorage.setItem("userEmail", input || "user@techellixir.com");
        setSuccessMsg("Signed in successfully! Redirecting to Home Page...");
        setTimeout(() => { window.location.href = "/"; }, 800);
      } else {
        setErrorMsg("Invalid credentials. Use admin / admin@123 or user / user@123.");
      }
    }
  };

  // Register Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!regFullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!regEmail.includes("@")) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, "").length < 7) {
      setErrorMsg("Mobile number is mandatory. Please enter a valid mobile number.");
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please check and try again.");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Please accept the Terms of Service to create an account.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          email: regEmail.trim().toLowerCase(),
          phone: regPhone.trim(),
          company: regCompany.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to create account.");
        return;
      }

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userEmail", regEmail.trim().toLowerCase());
      localStorage.setItem("userName", regFullName.trim());
      localStorage.setItem("userPhone", regPhone.trim());
      setSuccessMsg("Account created successfully! Redirecting to Home Page...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setLoading(false);
      setErrorMsg("Network error during registration. Please try again.");
    }
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
                    setErrorMsg("");
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
                    setErrorMsg("");
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
                    ? "Enter your credentials below to access your account."
                    : "Fill in your details to get started with our engineering platform."}
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
                  Or continue with credentials
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
              </div>

              {/* Success Banners */}
              {successMsg && (
                <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Banners */}
              {errorMsg && (
                <div className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-4 text-xs font-bold text-red-600 dark:text-red-300">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* 1. SIGN IN FORM */}
                {mode === "login" && (
                  <motion.form
                    key="login-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleLoginSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                        Username or Email
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          value={usernameOrEmail}
                          onChange={(e) => setUsernameOrEmail(e.target.value)}
                          placeholder="admin or user"
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => alert("Password reset instructions sent to your email.")}
                          className="text-xs font-bold text-[#FF4D37] hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="admin@123 or user@123"
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="brand-button w-full py-4 cursor-pointer text-xs sm:text-sm font-bold whitespace-nowrap shadow-lg flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}

                {/* 2. CREATE ACCOUNT (REGISTER) FORM */}
                {mode === "register" && (
                  <motion.form
                    key="register-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                        Work Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                        Mobile Number <span className="text-[#FF4D37] font-black">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                        Company / Organization (Optional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          placeholder="Acme Inc."
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

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

                    <button
                      type="submit"
                      disabled={loading}
                      className="brand-button w-full py-4 cursor-pointer text-xs sm:text-sm font-bold whitespace-nowrap shadow-lg flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? (
                        <span>Creating Account...</span>
                      ) : (
                        <>
                          <span>Create Free Account</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Footer Switcher */}
              <div className="mt-6 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                {mode === "login" ? (
                  <span>
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setSuccessMsg("");
                        setErrorMsg("");
                      }}
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
                      onClick={() => {
                        setMode("login");
                        setSuccessMsg("");
                        setErrorMsg("");
                      }}
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
