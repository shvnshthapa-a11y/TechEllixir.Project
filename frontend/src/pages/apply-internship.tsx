import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Briefcase,
  Code2,
} from "lucide-react";

const allDomains = [
  "Artificial Intelligence",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Mobile App Development",
  "Cloud Computing & DevOps",
  "Machine Learning",
  "Cyber Security",
  "UI / UX Design",
  "Graphic Design",
  "Video Editing",
  "Web Development",
  "React Development",
  "Python Development",
  "Python Full Stack Development",
  "Java Full Stack Development",
  ".NET Development",
  "MEAN Stack Development",
  "MERN Stack Development",
  "Flutter Development",
  "Game Development",
  "Software Testing",
  "Data Science",
  "Data Engineering",
  "Data Analytics",
  "Power BI / Data Visualization",
  "MS SQL",
  "Business Analyst",
  "WordPress Development",
  "SEO",
  "Digital Marketing",
  "Advanced Excel",
  "Project Management",
  "Sales Executive",
  "Social Media Handling",
  "Social Media Management",
  "Social Media Marketing",
  "Accounting",
  "Content Creation",
  "Content Writing",
  "HR",
  "Email Marketing",
  "Tele Calling",
  "Support Calling",
  "Meta & Google Ads",
  "Business Development Executive (BDE)",
  "Business Development Associate (BDA)",
];

export default function ApplyInternship() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const domainQuery = searchParams.get("domain") || "Frontend Development";

  const [selectedDomain, setSelectedDomain] = useState(domainQuery);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("3rd Year");
  const [resumeUrl, setResumeUrl] = useState("");
  const [reason, setReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("domain")) {
      setSelectedDomain(searchParams.get("domain")!);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError("Please enter a valid mobile / WhatsApp number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/internship-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          domain: selectedDomain,
          college: college.trim() || "Not specified",
          year,
          resumeUrl: resumeUrl.trim(),
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#fffaf7] dark:bg-[#0d111a] text-[#182033] dark:text-gray-100 transition-colors duration-300 min-h-screen pt-32 pb-24">
      <div className="container-shell max-w-6xl">
        
        {/* Back Link */}
        <Link
          to="/career"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FF4D37] transition mb-6 group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Career & Internship Domains</span>
        </Link>

        {isSuccess ? (
          /* SUCCESS PAGE SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="soft-card rounded-3xl p-8 sm:p-14 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-xl text-center max-w-3xl mx-auto space-y-6"
          >
            <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <span className="eyebrow justify-center">REGISTRATION CONFIRMED</span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#182033] dark:text-white">
                Application Submitted Successfully! 🎉
              </h1>
            </div>

            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto font-medium">
              Thank you <span className="font-bold text-[#FF4D37]">{fullName}</span> for applying for the <span className="font-bold text-[#182033] dark:text-white">{selectedDomain}</span> Internship. We have dispatched a confirmation email to <span className="font-bold text-[#FF4D37]">{email}</span>.
            </p>

            {/* Application Summary Box */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-left max-w-md mx-auto space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
                <span className="text-gray-400 font-bold">Applied Domain:</span>
                <span className="font-extrabold text-[#FF4D37]">{selectedDomain}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
                <span className="text-gray-400 font-bold">Mobile / WhatsApp:</span>
                <span className="font-bold text-gray-700 dark:text-gray-200">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">College / Org:</span>
                <span className="font-bold text-gray-700 dark:text-gray-200">{college || "N/A"} ({year})</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Our engineering talent team will review your application and contact you via email/WhatsApp regarding the onboarding schedule.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate("/career")}
                className="brand-button px-8 py-3.5 text-xs font-bold cursor-pointer"
              >
                Explore More Domains
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3.5 rounded-2xl text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </motion.div>
        ) : (
          /* FORM PAGE SCREEN */
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Form Card (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 soft-card rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-6"
            >
              <div>
                <span className="eyebrow">Internship Application Form</span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#182033] dark:text-white mt-2">
                  Register for <span className="text-[#FF4D37]">{selectedDomain}</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Fill in your details below to submit your official application for the internship program.
                </p>
              </div>

              {formError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Domain Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Select Internship Domain <span className="text-[#FF4D37]">*</span>
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                  >
                    {allDomains.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Full Name <span className="text-[#FF4D37]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rudra Pratap Singh"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Email Address <span className="text-[#FF4D37]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rudra@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Mobile / WhatsApp */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Mobile / WhatsApp Number <span className="text-[#FF4D37]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                    />
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                      Year of Study / Qualification <span className="text-[#FF4D37]">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                    >
                      <option value="1st Year">1st Year Student</option>
                      <option value="2nd Year">2nd Year Student</option>
                      <option value="3rd Year">3rd Year Student</option>
                      <option value="Final Year">Final Year Student</option>
                      <option value="Graduated / Working">Graduated / Working Professional</option>
                    </select>
                  </div>
                </div>

                {/* College / Organization */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    College / University / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Graphic Era University / DIT Dehradun"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                  />
                </div>

                {/* LinkedIn / Resume Link */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    LinkedIn / Portfolio / Resume URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.in/in/yourprofile or Google Drive link"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                  />
                </div>

                {/* Why Join */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Why do you want to join this internship?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your learning goals and project interests..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="brand-button w-full py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Official Application</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </motion.div>

            {/* Right Column: Highlights Sidebar (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-5 space-y-6"
            >
              
              {/* Program Overview Box */}
              <div className="soft-card rounded-3xl p-7 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-5">
                <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-[#FF4D37]" /> Program Highlights
                </h3>

                <ul className="space-y-4 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center shrink-0 mt-0.5">
                      <Code2 size={14} />
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-white block font-bold">Real Enterprise Codebases</strong>
                      <span>Gain hands-on experience building production React 19, Node, and AI applications.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center shrink-0 mt-0.5">
                      <Users size={14} />
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-white block font-bold">1-on-1 Senior Mentorship</strong>
                      <span>Get pull request reviews, architecture guidance, and career direction from senior engineers.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={14} />
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-white block font-bold">Verified Certification</strong>
                      <span>Receive an industry-recognized experience certificate and performance recommendation.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center shrink-0 mt-0.5">
                      <Briefcase size={14} />
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-white block font-bold">98.2% Placement Record</strong>
                      <span>Our alumni work at top technology companies, startups, and enterprise product firms.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Verified Trust Badge */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-white dark:from-[#161c2a] dark:to-slate-900 border border-orange-200 dark:border-slate-800 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF4D37]">
                  <ShieldCheck size={16} /> Direct Hiring Partner
                </div>
                <h4 className="text-base font-black text-[#182033] dark:text-white">
                  Fast-Track Onboarding Process
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Applications are processed within 24–48 hours. Eligible candidates will receive onboarding instructions and repository access directly via email.
                </p>
              </div>

            </motion.div>

          </div>
        )}

      </div>
    </main>
  );
}
