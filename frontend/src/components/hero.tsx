import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import heroImage from "../assets/heowbg.png";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  const trustPoints = [
    t("about.principles.outcome"),
    t("about.principles.human"),
    t("about.principles.scale")
  ];

  const stats = [
    ["100+", t("hero.stats.shipped")],
    ["50+", t("hero.stats.supported")],
    ["24/7", t("hero.stats.assistance")],
  ];

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pb-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#fffaf7_0%,#ffffff_42%,#fff0eb_100%)] dark:bg-[linear-gradient(135deg,#0d111a_0%,#131924_42%,#0d111a_100%)]" />
      <div className="absolute left-0 top-24 -z-10 h-64 w-64 rounded-full bg-[#FF4D37]/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#FFC44D]/10 blur-3xl" />

      <div className="container-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15, mass: 1 }}
          >
            <h1 className="section-title mt-7 text-4xl sm:text-5xl lg:text-5xl">
              {t("hero.title1")}{" "}
              <span className="block text-[#FF4D37]">{t("hero.title2")}</span>
            </h1>

            <p className="section-copy mt-7 max-w-xl text-lg">
              {t("hero.copy")}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <motion.a
                href="/contact"
                className="brand-button px-8 py-4 cursor-pointer"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {t("hero.startProject")}
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="/services"
                className="ghost-button px-8 py-4 cursor-pointer"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <PlayCircle size={22} />
                {t("hero.exploreServices")}
              </motion.a>
            </div>

            <div className="mt-9 grid gap-3 text-sm font-semibold text-gray-700 sm:grid-cols-3">
              {trustPoints.map((item) => (
                <div key={item} className="flex items-center gap-2 dark:text-gray-300">
                  <CheckCircle2 className="text-[#FF4D37]" size={18} />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15, mass: 1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className=" ">
              <div className=" ">
                <img
                  src={heroImage}
                  alt="Digital product dashboard illustration"
                  className="w-full rounded-2xl"
                />
              </div>
            </div>

            <motion.div
              animate={{
                y: [-12, 12, -12],
                rotate: [-2, 2, -2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="soft-card absolute -left-3 top-8 rounded-2xl p-4 sm:-left-8 sm:p-5 cursor-default"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {t("about.metrics.delivered").split(" ")[1] || "Delivered"}
              </p>
              <h3 className="mt-1 text-2xl font-black text-[#FF4D37]">100+</h3>
            </motion.div>

            <motion.div
              animate={{
                y: [12, -12, 12],
                rotate: [2, -2, 2]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="soft-card absolute -right-2 bottom-8 rounded-2xl p-4 sm:-right-8 sm:p-5 cursor-default"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {t("hero.stats.satisfaction")}
              </p>
              <h3 className="mt-1 text-2xl font-black text-[#FF4D37]">98%</h3>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="mt-14 grid gap-4 p-4 backdrop-blur md:grid-cols-3"
        >
          {stats.map(([value, label]) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-2xl bg-white p-5 text-center shadow-sm cursor-default"
            >
              <div className="text-3xl font-black text-[#FF4D37]">{value}</div>
              <div className="mt-1 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
