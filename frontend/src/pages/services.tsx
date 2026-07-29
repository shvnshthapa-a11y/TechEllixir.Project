import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  const { t } = useLanguage();
  const [cmsIndustries, setCmsIndustries] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/cms/industries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          setCmsIndustries(data.items);
        }
      })
      .catch((err) => console.warn("Industries CMS fetch fallback:", err));
  }, []);

  const fallbackIndustries = [
    { id: "healthcare", name: t("industries.list.healthcare"), icon: <Activity size={24} />, desc: t("industries.list.healthcareDesc") },
    { id: "finance", name: t("industries.list.finance"), icon: <Briefcase size={24} />, desc: t("industries.list.financeDesc") },
    { id: "retail", name: t("industries.list.retail"), icon: <ShoppingCart size={24} />, desc: t("industries.list.retailDesc") },
    { id: "manufacturing", name: t("industries.list.manufacturing"), icon: <Factory size={24} />, desc: t("industries.list.manufacturingDesc") },
    { id: "logistics", name: t("industries.list.logistics"), icon: <Truck size={24} />, desc: t("industries.list.logisticsDesc") },
    { id: "realestate", name: t("industries.list.realestate"), icon: <Building size={24} />, desc: t("industries.list.realestateDesc") },
    { id: "education", name: t("industries.list.education"), icon: <GraduationCap size={24} />, desc: t("industries.list.educationDesc") },
    { id: "marketing", name: t("industries.list.marketing"), icon: <Megaphone size={24} />, desc: t("industries.list.marketingDesc") },
    { id: "hr", name: t("industries.list.hr"), icon: <Users size={24} />, desc: t("industries.list.hrDesc") },
    { id: "startups", name: t("industries.list.startups"), icon: <Rocket size={24} />, desc: t("industries.list.startupsDesc") },
  ];

  const displayIndustries = cmsIndustries.length > 0
    ? cmsIndustries.map((item) => {
        const idKey = (item.id || item.slug || "healthcare").toLowerCase();
        let icon = <Rocket size={24} />;
        if (idKey.includes("health")) icon = <Activity size={24} />;
        else if (idKey.includes("fin")) icon = <Briefcase size={24} />;
        else if (idKey.includes("ret") || idKey.includes("shop")) icon = <ShoppingCart size={24} />;
        else if (idKey.includes("man")) icon = <Factory size={24} />;
        else if (idKey.includes("log")) icon = <Truck size={24} />;
        else if (idKey.includes("real")) icon = <Building size={24} />;
        else if (idKey.includes("edu")) icon = <GraduationCap size={24} />;
        else if (idKey.includes("mark")) icon = <Megaphone size={24} />;
        else if (idKey.includes("hr")) icon = <Users size={24} />;

        return {
          id: item.id || item.slug || "healthcare",
          name: item.title || item.name || "Industry Vertical",
          icon,
          desc: item.tagline || item.description || item.desc || "Enterprise specialized solution.",
        };
      })
    : fallbackIndustries;

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
            {displayIndustries.map((ind) => (
              <motion.div
                key={ind.id + ind.name}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="soft-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-shadow transition-colors duration-300 hover:shadow-lg hover:border-[#ffd5ca]"
              >
                <Link to={`/industry/${ind.id}`} className="block h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF1EC] to-[#FFF8F4] dark:from-[#2c1a16] dark:to-[#1c1512] text-[#FF4D37] mb-4 border border-[#FF4D37]/10 dark:border-[#FF4D37]/20">
                    {ind.icon}
                  </div>
                  <h3 className="text-base font-black text-[#182033] dark:text-white mb-2">{ind.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{ind.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Process />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default OurServices;
