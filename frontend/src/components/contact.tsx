import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { type FormEvent, useState, useEffect } from "react";
import { submitQuery } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const handleSetSubject = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setForm((prev) => ({ ...prev, subject: customEvent.detail }));
      
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          const subjectInput = document.getElementById("contact-subject-input") as HTMLInputElement;
          if (subjectInput) {
            subjectInput.focus();
          }
        }, 800);
      }
    };

    window.addEventListener("set-contact-subject", handleSetSubject);
    return () => window.removeEventListener("set-contact-subject", handleSetSubject);
  }, []);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      await submitQuery(form);
      setStatus("success");
      setFeedback(t("contact.success"));
      setForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : t("contact.error"));
    }
  };

  const contactItems = [
    {
      icon: <MapPin size={28} />,
      title: t("contact.office"),
      value: "15th Floor, The Iconic Corenthum, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201301",
    },
    {
      icon: <Phone size={28} />,
      title: t("contact.call"),
      value: "+91 99175 29504",
    },
    {
      icon: <Mail size={28} />,
      title: t("contact.email"),
      value: "info@techellixir.com",
    },
  ];

  return (
    <section id="contact" className="section-shell bg-[#fffaf7] dark:bg-[#131924] transition-colors duration-300">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">{t("contact.eyebrow")}</p>
          <h2 className="section-title mt-4 text-3xl md:text-4xl">
            {t("contact.title")}
          </h2>
          <p className="section-copy mt-5">
            {t("contact.copy")}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            viewport={{ once: true, margin: "-100px" }}
            className="soft-card rounded-3xl p-8"
          >
            <div className="space-y-8">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`flex gap-5 cursor-default group ${
                    index !== contactItems.length - 1
                      ? "border-b border-gray-200 dark:border-slate-800 pb-8"
                      : ""
                  }`}
                >
                  <div className="icon-tile shrink-0 transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white transition-colors duration-300 group-hover:text-[#FF4D37] dark:group-hover:text-[#FF4D37]">
                      {item.title}
                    </h3>
                    <p className="section-copy mt-2 break-words">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            viewport={{ once: true, margin: "-100px" }}
            className="soft-card rounded-3xl p-6 sm:p-8"
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  placeholder={t("contact.placeholderName")}
                  className="field"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                />
                <input
                  type="email"
                  placeholder={t("contact.placeholderEmail")}
                  className="field"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </div>
              <input
                id="contact-subject-input"
                type="text"
                placeholder={t("contact.placeholderSubject")}
                className="field"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
              />
              <textarea
                rows={6}
                placeholder={t("contact.placeholderMsg")}
                className="field resize-none"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
              />
              {feedback && (
                <p
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    status === "success"
                      ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                  }`}
                >
                  {feedback}
                </p>
              )}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="brand-button w-full px-8 py-4 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer text-sm"
              >
                {status === "loading" ? t("contact.sending") : t("contact.sendBtn")}
                <Send size={20} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
