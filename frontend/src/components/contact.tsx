import { type FormEvent, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe2,
} from "lucide-react";
import { submitQuery } from "../lib/api";

const Contact = () => {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const handleSetSubject = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setForm((prev) => ({ ...prev, subject: customEvent.detail }));

      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("set-contact-subject", handleSetSubject);
    return () => window.removeEventListener("set-contact-subject", handleSetSubject);
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      setStatus("error");
      setFeedback("Please enter your full name.");
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      setStatus("error");
      setFeedback("Please write a message with at least 5 characters.");
      return;
    }

    try {
      await submitQuery({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        subject: `[${form.subject}] ${form.fullName}`,
        message: `${form.message.trim()}\n\nContact Phone: ${form.phone || 'N/A'}`,
      });
      setStatus("success");
      setFeedback("Thank you! Your message has been sent successfully. We will get back to you shortly.");
      setForm({ fullName: "", email: "", phone: "", subject: "Enterprise Software Engineering", message: "" });
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    }
  };

  const contactItems = [
    {
      icon: <MapPin size={24} />,
      title: "Headquarters Office",
      value: "15th Floor, The Iconic Corenthum, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201301",
      action: "Get Directions ↗",
      link: "https://maps.google.com/?q=Sector+62+Noida",
    },
    {
      icon: <Phone size={24} />,
      title: "Direct Phone & WhatsApp",
      value: "+91 99175 29504",
      sub: "Mon - Sat: 9:00 AM - 7:00 PM IST",
      action: "Call Now ↗",
      link: "tel:+919917529504",
    },
    {
      icon: <Mail size={24} />,
      title: "Official Email Support",
      value: "info@techellixir.com",
      sub: "Average response time: under 2 hours",
      action: "Send Email ↗",
      link: "mailto:info@techellixir.com",
    },
  ];

  return (
    <section id="contact" className="bg-[#fffaf7] dark:bg-[#0d111a] text-[#182033] dark:text-gray-100 transition-colors duration-300 py-16 sm:py-24">
      <div className="container-shell max-w-6xl">
        
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center space-y-3"
        >
          <span className="eyebrow justify-center">GET IN TOUCH</span>
          <h1 className="section-title text-3xl sm:text-4xl md:text-5xl text-[#182033] dark:text-white font-black leading-tight">
            Let's Build Something <span className="gradient-text">Exceptional Together</span>
          </h1>
          <p className="section-copy text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
            Have a project requirement, partnership inquiry, or technical question? Fill in your details and our senior engineering team will respond within 2 hours.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-7 soft-card rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                <MessageSquare size={22} className="text-[#FF4D37]" />
                <span>Send Us a Message</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fill out the form below and we'll connect you directly with a solution architect.
              </p>
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
                  status === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                ) : (
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-500" />
                )}
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-[#182033] dark:text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 px-5 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 outline-none focus:border-[#FF4D37] dark:focus:border-[#FF4D37] focus:bg-white dark:focus:bg-slate-900 transition"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-bold text-[#182033] dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 px-5 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 outline-none focus:border-[#FF4D37] dark:focus:border-[#FF4D37] focus:bg-white dark:focus:bg-slate-900 transition"
                />
              </div>

              {/* Service You Need */}
              <div>
                <label className="block text-sm font-bold text-[#182033] dark:text-gray-200 mb-2">
                  Service You Need
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI-Powered Marketing Strategy, Web Application, Mobile App..."
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 px-5 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 outline-none focus:border-[#FF4D37] dark:focus:border-[#FF4D37] focus:bg-white dark:focus:bg-slate-900 transition"
                />
              </div>

              {/* Tell Us About Your Goals */}
              <div>
                <label className="block text-sm font-bold text-[#182033] dark:text-gray-200 mb-2">
                  Tell Us About Your Goals
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="A line or two about what you're trying to achieve"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 px-5 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 outline-none focus:border-[#FF4D37] dark:focus:border-[#FF4D37] focus:bg-white dark:focus:bg-slate-900 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center space-y-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 px-8 rounded-full bg-[#FF4D37] hover:bg-[#e03d27] dark:bg-[#FF4D37] dark:hover:bg-[#e03d27] text-white text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Sending Your Request...</span>
                    </>
                  ) : (
                    <span>Get My Free Strategy Call</span>
                  )}
                </button>

                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  We reply within 1 business day. No spam, ever.
                </p>
              </div>

            </form>
          </motion.div>

          {/* Right Column: Contact Cards + Map (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Contact Items List */}
            <div className="soft-card rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                <Sparkles size={20} className="text-[#FF4D37]" /> Contact Information
              </h3>

              <div className="space-y-5">
                {contactItems.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-900/70 border border-gray-100 dark:border-slate-800 space-y-2 hover:border-[#ffd5ca] transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                          {item.icon}
                        </div>
                        <h4 className="text-sm font-extrabold text-[#182033] dark:text-white">
                          {item.title}
                        </h4>
                      </div>

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-extrabold text-[#FF4D37] hover:underline shrink-0"
                      >
                        {item.action}
                      </a>
                    </div>

                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 pl-11 leading-relaxed">
                      {item.value}
                    </p>

                    {item.sub && (
                      <p className="text-[11px] font-medium text-gray-400 pl-11">
                        {item.sub}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SLA / Quick Support Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-white dark:from-[#161c2a] dark:to-slate-900 border border-orange-200 dark:border-slate-800 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF4D37]">
                <Clock size={16} /> Fast-Response Guarantee
              </div>
              <h4 className="text-base font-black text-[#182033] dark:text-white">
                Under 2-Hour SLA Response
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                Our technical support and architecture leads review all incoming messages promptly. You will receive a direct email and WhatsApp response with project availability.
              </p>
            </div>

            {/* Embedded Google Map Reference Box */}
            <div className="soft-card rounded-3xl p-4 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-[#182033] dark:text-white flex items-center gap-1.5">
                  <Globe2 size={16} className="text-[#FF4D37]" /> Office Location
                </span>
                <span className="text-[11px] font-bold text-gray-400">Sector 62, Noida</span>
              </div>
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
                <iframe
                  title="Office Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562306774676!2d77.3619083!3d28.6128821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5456ef36d9f%3A0x6b71b12b5b3c5825!2sThe%20Corenthum%2C%20Sector%2062%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                />
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
