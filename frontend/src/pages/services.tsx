import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Briefcase,
  ShoppingCart,
  Factory,
  Truck,
  Building,
  GraduationCap,
  Megaphone,
  Users,
  Rocket,
  X,
} from "lucide-react";
import Services from "../components/services";
import Process from "../components/process";
import WhyChooseUs from "../components/whychoseus";
import Testimonials from "../components/testimonial";
import Contact from "../components/contact";
import { useLanguage } from "../context/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const OurServices = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<any | null>(null);
  const { t } = useLanguage();

  const industries = [
    { 
      name: t("industries.list.healthcare"), 
      icon: <Activity size={24} />, 
      desc: t("industries.list.healthcareDesc"),
      detailedDesc: t("industries.list.healthcareDetail")
    },
    { 
      name: t("industries.list.finance"), 
      icon: <Briefcase size={24} />, 
      desc: t("industries.list.financeDesc"),
      detailedDesc: t("industries.list.healthcareDetail") // wait, let's make sure it is financeDetail
    },
    { 
      name: t("industries.list.retail"), 
      icon: <ShoppingCart size={24} />, 
      desc: t("industries.list.retailDesc"),
      detailedDesc: t("industries.list.retailDetail")
    },
    { 
      name: t("industries.list.manufacturing"), 
      icon: <Factory size={24} />, 
      desc: t("industries.list.manufacturingDesc"),
      detailedDesc: t("industries.list.manufacturingDetail")
    },
    { 
      name: t("industries.list.logistics"), 
      icon: <Truck size={24} />, 
      desc: t("industries.list.logisticsDesc"),
      detailedDesc: t("industries.list.logisticsDetail")
    },
    { 
      name: t("industries.list.realestate"), 
      icon: <Building size={24} />, 
      desc: t("industries.list.realestateDesc"),
      detailedDesc: t("industries.list.realestateDetail")
    },
    { 
      name: t("industries.list.education"), 
      icon: <GraduationCap size={24} />, 
      desc: t("industries.list.educationDesc"),
      detailedDesc: t("industries.list.educationDetail")
    },
    { 
      name: t("industries.list.marketing"), 
      icon: <Megaphone size={24} />, 
      desc: t("industries.list.marketingDesc"),
      detailedDesc: t("industries.list.marketingDetail")
    },
    { 
      name: t("industries.list.hr"), 
      icon: <Users size={24} />, 
      desc: t("industries.list.hrDesc"),
      detailedDesc: t("industries.list.hrDetail")
    },
    { 
      name: t("industries.list.startups"), 
      icon: <Rocket size={24} />, 
      desc: t("industries.list.startupsDesc"),
      detailedDesc: t("industries.list.startupsDetail")
    },
  ];

  // Fix detailedDesc lookup for finance
  industries[1].detailedDesc = t("industries.list.financeDetail");

  return (
    <main className="pt-16">
      <Services detailed={true} />
      
      {/* Industries We Serve Section */}
      <section className="section-shell bg-white dark:bg-[#0d111a] border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="container-shell">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <p className="eyebrow justify-center">{t("industries.eyebrow")}</p>
            <h2 className="section-title mt-4 text-3xl md:text-4xl">
              {t("industries.title")}
            </h2>
            <p className="section-copy mt-6">
              {t("industries.copy")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
          >
            {industries.map((ind) => (
              <motion.div
                key={ind.name}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setSelectedIndustry(ind)}
                className="soft-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-shadow transition-colors duration-300 hover:shadow-lg hover:border-[#ffd5ca]"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF1EC] to-[#FFF8F4] dark:from-[#2c1a16] dark:to-[#1c1512] text-[#FF4D37] mb-4 border border-[#FF4D37]/10 dark:border-[#FF4D37]/20">
                    {ind.icon}
                  </div>
                  <h3 className="text-base font-black text-[#182033] dark:text-white mb-2">{ind.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{ind.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedIndustry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndustry(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#161c2a] p-8 shadow-2xl border border-gray-100 dark:border-slate-800 z-10"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedIndustry(null)}
                className="absolute right-6 top-6 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition duration-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex gap-4 items-center mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF1EC] to-[#FFF8F4] dark:from-[#2c1a16] dark:to-[#1c1512] text-[#FF4D37] border border-[#FF4D37]/10 dark:border-[#FF4D37]/20 shrink-0">
                  {selectedIndustry.icon}
                </div>
                <div>
                  <span className="eyebrow">{t("industries.detailModalTitle")}</span>
                  <h3 className="text-2xl font-black text-[#182033] dark:text-white mt-0.5">{selectedIndustry.name}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="section-copy text-sm leading-relaxed">
                  {selectedIndustry.detailedDesc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex gap-3">
                <button
                  onClick={() => setSelectedIndustry(null)}
                  className="ghost-button flex-1 px-6 py-3 cursor-pointer text-sm"
                >
                  {t("industries.closeBtn")}
                </button>
                <button
                  onClick={() => {
                    const event = new CustomEvent("set-contact-subject", {
                      detail: `${selectedIndustry.name} AI & Data Services Inquiry`,
                    });
                    window.dispatchEvent(event);
                    setSelectedIndustry(null);
                  }}
                  className="brand-button flex-1 px-6 py-3 cursor-pointer text-sm"
                >
                  {t("industries.inquireBtn")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Process />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default OurServices;
