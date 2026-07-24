import React, { useState } from "react";
import {
  User,
  Mail,
  Shield,
  CheckCircle2,
  Bookmark,
  LogOut,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Profile = () => {
  const isAdmin = Boolean(localStorage.getItem("adminToken"));
  const userEmail = localStorage.getItem("userEmail") || (isAdmin ? "admin@techellixir.com" : "user@techellixir.com");
  const storedName = localStorage.getItem("userName") || (isAdmin ? "Administrator" : userEmail.split("@")[0]);

  const [displayName, setDisplayName] = useState(storedName);
  const [activeName, setActiveName] = useState(storedName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.location.href = "/auth";
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedName = displayName.trim() || storedName;
    localStorage.setItem("userName", updatedName);
    setActiveName(updatedName);
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] dark:bg-[#0d111a] pt-28 pb-20 text-[#182033] dark:text-gray-100 transition-colors duration-300">
      <div className="container-shell max-w-5xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="soft-card rounded-3xl p-8 bg-gradient-to-r from-white via-orange-50/50 to-white dark:from-[#161c2a] dark:via-slate-900 dark:to-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-20 w-20 rounded-3xl bg-[#FF4D37] text-white flex items-center justify-center text-3xl font-black shadow-lg shrink-0 uppercase">
              {activeName.charAt(0)}
            </div>
            <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl font-black text-[#182033] dark:text-white capitalize">
                  {activeName}
                </h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  isAdmin
                    ? "bg-orange-100 dark:bg-orange-950/60 text-[#FF4D37] border border-orange-200 dark:border-orange-800"
                    : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                }`}>
                  {isAdmin ? "Administrator" : "Verified Account"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
                {userEmail}
              </p>
              <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1 pt-1">
                <Sparkles size={14} className="text-[#FF4D37]" /> TechEllixir Member since 2026
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="brand-button px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Shield size={15} /> Admin Portal
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-2xl border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/40 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Account Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                  <User size={18} className="text-[#FF4D37]" /> Personal Information
                </h3>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={16} /> Display name updated to "{activeName}" successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      readOnly
                      defaultValue={userEmail}
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-900/60 pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="brand-button px-6 py-3 text-xs font-bold cursor-pointer shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Quick Links & Assets */}
          <div className="lg:col-span-5 space-y-6">
            <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                <Bookmark size={18} className="text-[#FF4D37]" /> Saved Blueprints & Resources
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Access your bookmarked whitepapers, technical guides, and architectural blueprints.
              </p>

              <NavLink
                to="/resources"
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-[#FF4D37] transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37]">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#182033] dark:text-white">Knowledge Hub Assets</h4>
                    <p className="text-[11px] text-gray-400">View 15+ engineering guides</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#FF4D37] transition transform group-hover:translate-x-1" />
              </NavLink>

              <NavLink
                to="/services"
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-[#FF4D37] transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37]">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#182033] dark:text-white">Explore Engineering Services</h4>
                    <p className="text-[11px] text-gray-400">Core AI & Cloud Architecture</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#FF4D37] transition transform group-hover:translate-x-1" />
              </NavLink>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Profile;
