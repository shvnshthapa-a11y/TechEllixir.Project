import { motion } from "framer-motion";
import { ArrowRight, Layers3, Target, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
};

const About = () => {
  const { t } = useLanguage();

  const metrics = [
    ["100+", t("about.metrics.delivered")],
    ["50+", t("about.metrics.happy")],
    ["10+", t("about.metrics.experience")],
    ["24/7", t("about.metrics.support")],
  ];

  const principles = [
    {
      icon: <Target size={22} />,
      title: t("about.principles.outcome"),
      copy: t("about.principles.outcomeDesc"),
    },
    {
      icon: <Layers3 size={22} />,
      title: t("about.principles.scale"),
      copy: t("about.principles.scaleDesc"),
    },
    {
      icon: <Users size={22} />,
      title: t("about.principles.human"),
      copy: t("about.principles.humanDesc"),
    },
  ];

  return (
    <section className="section-shell bg-white dark:bg-[#0d111a] transition-colors duration-300">
      <div className="container-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="eyebrow">{t("about.eyebrow")}</span>
            <h2 className="section-title mt-4 text-3xl lg:text-4xl">
              {t("about.title")}
            </h2>
            <p className="section-copy mt-6 text-lg">
              {t("about.copy1")}
            </p>
            <p className="section-copy mt-4">
              {t("about.copy2")}
            </p>
            <motion.a
              href="/about"
              className="brand-button mt-8 px-8 py-4 cursor-pointer"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {t("about.learnMore")}
              <ArrowRight size={19} />
            </motion.a>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {metrics.map(([value, label]) => (
                <motion.div
                  key={label}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="soft-card rounded-3xl p-6 text-center cursor-default transition-shadow duration-300 hover:shadow-lg"
                >
                  <h3 className="text-3xl font-black text-[#FF4D37] sm:text-4xl">
                    {value}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4">
              {principles.map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="soft-card flex gap-4 rounded-3xl p-5 cursor-default transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="icon-tile !h-12 !w-12 !rounded-2xl">{item.icon}</div>
                  <div>
                    <h3 className="font-black text-[#182033] dark:text-white">{item.title}</h3>
                    <p className="section-copy mt-1 text-sm">{item.copy}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
