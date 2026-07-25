import React, { useState } from "react";
import { useSearchParams, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Code2,
  Layers,
  Send,
  ChevronRight,
} from "lucide-react";
import { coreServicesData, aiDataServicesData, type ServiceDetail } from "../components/services";

const serviceImageMap: Record<string, string> = {
  "web development": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
  "mobile app development": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200",
  "software engineering": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
  "cloud & devops": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
  "ui/ux design": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200",
  "cybersecurity & api hardening": "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200",
  "artificial intelligence solutions": "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200",
  "data engineering & analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
  "data science": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200",
  "machine learning & deep learning": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
};

const defaultImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200";

const ServiceDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get("id") || "web-development";

  const allServices: ServiceDetail[] = [...coreServicesData, ...aiDataServicesData];
  
  // Find service matching title or slug
  const currentService = allServices.find((s) => {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return slug === serviceId.toLowerCase() || s.title.toLowerCase().includes(serviceId.toLowerCase().replace(/-/g, " "));
  }) || allServices[0];

  const serviceImage = serviceImageMap[currentService.title.toLowerCase()] || defaultImage;

  // Contact / Demo Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          subject: `Demo Request: ${currentService.title}`,
          message: message || `Interested in starting a project for ${currentService.title}.`,
        }),
      });
      setSubmitSuccess(true);
      setFullName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error("Demo submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] dark:bg-[#0d111a] pt-28 pb-20 text-[#182033] dark:text-gray-100 transition-colors duration-300">
      <div className="container-shell max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          <NavLink to="/" className="hover:text-[#FF4D37] transition">Home</NavLink>
          <ChevronRight size={14} />
          <NavLink to="/services" className="hover:text-[#FF4D37] transition">Services</NavLink>
          <ChevronRight size={14} />
          <span className="text-[#FF4D37] font-black">{currentService.title}</span>
        </div>

        {/* Back Link */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="ghost-button px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to All Services
          </button>
        </div>

        {/* Service Hero Card with Image */}
        <div className="soft-card rounded-3xl overflow-hidden bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-xl">
          <div className="grid lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <span className="eyebrow">
                <Sparkles size={16} /> ENTERPRISE ENGINEERING SERVICE
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-[#182033] dark:text-white leading-tight">
                {currentService.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentService.note}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentService.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-orange-50 dark:bg-orange-950/60 text-[#FF4D37] px-3.5 py-1 text-xs font-black border border-orange-200 dark:border-orange-900"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#demo-form"
                  className="brand-button px-8 py-4 text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2"
                >
                  Request a Demo for {currentService.title} <ArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* Right Image Feature */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[300px]">
              <img
                src={serviceImage}
                alt={currentService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#182033]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white dark:lg:from-[#161c2a] lg:via-transparent lg:to-transparent"></div>
            </div>

          </div>
        </div>

        {/* Detailed Overview & Value Proposition */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Overview Box */}
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                <Layers className="text-[#FF4D37]" size={24} /> Strategic & Technical Overview
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {currentService.detailedOverview}
              </p>
            </div>

            {/* Specialized Capabilities Grid */}
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                <Code2 className="text-[#FF4D37]" size={24} /> Specialized Capabilities & Features
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {currentService.subServices.map((sub, idx) => (
                  <div
                    key={sub}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-start gap-3"
                  >
                    <div className="h-6 w-6 rounded-lg bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Step Delivery Pipeline Stepper */}
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                <Zap className="text-[#FF4D37]" size={24} /> 4-Step Engineering Process
              </h2>

              <div className="space-y-4">
                {currentService.processSteps.map((step) => (
                  <div
                    key={step}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-[#FF4D37] shrink-0 mt-0.5" size={20} />
                    <span className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-gray-200">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Outcomes, Tech Stack & Request Demo Form */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Key Outcomes Box */}
            <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={20} /> Guaranteed Outcomes
              </h3>
              <ul className="space-y-2.5">
                {currentService.keyOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span className="text-emerald-500 font-black">✓</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Badges */}
            <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                <Cpu className="text-[#FF4D37]" size={20} /> Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentService.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Request Demo Form */}
            <div id="demo-form" className="soft-card rounded-3xl p-6 bg-gradient-to-br from-orange-50/70 to-white dark:from-[#161c2a] dark:to-slate-900 border border-orange-200 dark:border-slate-800 shadow-lg space-y-4">
              <h3 className="text-xl font-black text-[#182033] dark:text-white">
                Request a Demo
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Connect with an engineer to discuss architecture for <strong>{currentService.title}</strong>.
              </p>

              {submitSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Demo request sent! Our team will contact you shortly.
                </div>
              )}

              <form onSubmit={handleDemoSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Project Requirements / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Tell us about your project requirements for ${currentService.title}...`}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="brand-button w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSubmitting ? "Submitting..." : "Submit Demo Request"} <Send size={14} />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};

export default ServiceDetailPage;
