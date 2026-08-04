import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, PenTool, Rocket, Search } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
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

const defaultProcessIcons = [<Search size={30} />, <PenTool size={30} />, <Code2 size={30} />, <Rocket size={30} />];

const Process = () => {
  const { t } = useLanguage();
  const [dynamicProcess, setDynamicProcess] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/cms/process")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setDynamicProcess(data.items);
        }
      })
      .catch((err) => console.warn("Backend process fetch fallback:", err));
  }, []);

  const fallbackProcess = [
    { id: "01", icon: <Search size={30} />, title: t("process.steps.discovery"), description: t("process.steps.discoveryDesc") },
    { id: "02", icon: <PenTool size={30} />, title: t("process.steps.design"), description: t("process.steps.designDesc") },
    { id: "03", icon: <Code2 size={30} />, title: t("process.steps.development"), description: t("process.steps.developmentDesc") },
    { id: "04", icon: <Rocket size={30} />, title: t("process.steps.launch"), description: t("process.steps.launchDesc") },
  ];

  const processList = dynamicProcess.length > 0
    ? dynamicProcess.map((item, idx) => ({
        id: item.step || `0${idx + 1}`,
        icon: defaultProcessIcons[idx % defaultProcessIcons.length],
        title: item.title,
        description: item.description,
      }))
    : fallbackProcess;

  return (
    <section className="section-shell bg-white dark:bg-[#0d111a] transition-colors duration-300">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">{t("process.eyebrow")}</p>
          <h2 className="section-title mt-3 text-3xl md:text-4xl">
            {t("process.title")}
          </h2>
          <p className="section-copy mt-5">
            {t("process.copy")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {processList.map((item) => (
            <motion.article
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -7, scale: 1.02 }}
              className="soft-card relative rounded-3xl p-7 cursor-pointer transition-shadow transition-colors duration-300 hover:shadow-xl"
            >
              <div className="mb-7 flex items-center justify-between">
                <div className="icon-tile">{item.icon}</div>
                <span className="text-4xl font-black text-[#FF4D37]/18">
                  {item.id}
                </span>
              </div>
              <h3 className="text-xl font-black text-[#182033] dark:text-white">{item.title}</h3>
              <p className="section-copy mt-3 text-sm">{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
